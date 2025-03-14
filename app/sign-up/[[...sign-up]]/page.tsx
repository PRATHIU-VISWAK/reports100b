import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-[450px] p-4 space-y-4">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90",
              card: "shadow-none"
            },
            layout: {
              socialButtonsVariant: "iconButton",
              socialButtonsPlacement: "bottom"
            }
          }}
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
        />
        <div className="p-4 bg-muted/80 backdrop-blur rounded-lg shadow">
          <h3 className="font-semibold mb-2">Password Requirements:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>Include uppercase and lowercase letters</li>
            <li>Include at least one number</li>
            <li>Must not be a commonly used or breached password</li>
            <li>Avoid using personal information</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
