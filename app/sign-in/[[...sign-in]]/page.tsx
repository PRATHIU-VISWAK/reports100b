import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen grid place-items-center bg-black">
      <div className="w-full max-w-[450px] p-4 space-y-4">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-white text-black hover:bg-gray-100",
              footerActionLink: "text-white hover:text-gray-300",
              card: "shadow-none bg-black/50 text-white",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-black/30 text-white border-gray-700",
              dividerLine: "bg-gray-800",
              dividerText: "text-gray-500",
              socialButtonsIconButton: "border-gray-700 hover:bg-gray-900"
            }
          }}
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
        />
        <div className="p-6 bg-black/50 backdrop-blur rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-2 text-white">Sign In Options:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-300">
            <li>Use your phone number and password</li>
            <li>Verify with OTP if you forget password</li>
            <li>Click "Sign Up" if you don't have an account</li>
          </ul>
        </div>
      </div>
    </div>
  )
}