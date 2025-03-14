import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-[450px] p-4 space-y-4">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90",
              card: "shadow-none"
            }
          }}
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
        />
        <div className="p-4 bg-muted/80 backdrop-blur rounded-lg shadow">
          <h3 className="font-semibold mb-2">Sign In Options:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Use your phone number and password</li>
            <li>Verify with OTP if you forget password</li>
            <li>Click "Sign Up" if you don't have an account</li>
          </ul>
        </div>
      </div>
    </div>
  )
}