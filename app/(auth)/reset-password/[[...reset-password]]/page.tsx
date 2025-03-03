import { ResetPassword } from "@clerk/nextjs"

export default function ResetPasswordPage() {
  return (
    <>
      <ResetPassword
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/90",
            card: "shadow-none"
          },
          layout: {
            helpersMargin: "1rem",
            socialButtonsPlacement: "bottom"
          }
        }}
        afterResetPasswordUrl="/sign-in"
      />
      <div className="p-4 bg-muted/80 backdrop-blur rounded-lg shadow">
        <h3 className="font-semibold mb-2">Reset Password Help:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Enter your phone number to receive a reset code</li>
          <li>Check your phone for the verification code</li>
          <li>Create a new secure password</li>
        </ul>
      </div>
    </>
  )
} 