import { VerifyEmailCode } from "@clerk/nextjs"

export default function VerifyPage() {
  return (
    <>
      <VerifyEmailCode
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
      />
      <div className="p-4 bg-muted/80 backdrop-blur rounded-lg shadow">
        <h3 className="font-semibold mb-2">Verification Help:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Enter the code sent to your phone</li>
          <li>Codes expire after 10 minutes</li>
          <li>Click resend if you didn't receive the code</li>
        </ul>
      </div>
    </>
  )
} 