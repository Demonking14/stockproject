import {VerificationEmail} from '@/utils/EmailTemplate'
import { transporter } from '@/lib/nodemail'
import {render} from '@react-email/render'


export async function sendVerificationEmail(email:string , fullname:string , otp:string) {
  try {
    const html = await render(
      <VerificationEmail otp={otp} fullname={fullname}  email={email} />
    )

    const result = await transporter.sendMail({
      from: process.env.GOOGLE_USER,
      to: email,
      subject: 'Verification OTP',
      html,
    })
    console.log(result);
    return {"message": "Email sent successfully", "success":true }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return {"message": "Unable to send verification email", "success": false}
  }
}