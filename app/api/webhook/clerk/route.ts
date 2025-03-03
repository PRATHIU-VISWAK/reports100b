import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type;
  const supabase = createClient()

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, phone_numbers, public_metadata } = evt.data

    // Get the primary phone number
    const primaryPhone = phone_numbers?.find(p => p.id === evt.data.primary_phone_number_id)

    if (!primaryPhone) {
      console.error('No primary phone number found')
      return new Response('No primary phone number', { status: 400 })
    }

    // Update or create user profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id,
        name: first_name,
        phone: primaryPhone.phone_number,
        role: (public_metadata.role as string) || 'resident',
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error updating profile:', error)
      return new Response('Error updating profile', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
} 