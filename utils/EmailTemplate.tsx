import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface VerificationEmailProps {
  otp: string
  fullname: string
  email: string
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  otp,
  fullname,
  email,
}) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-otp?email=${email}`

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for YourCompany</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-5">
          <Container className="max-w-[600px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <Section className="bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-8">
              <Heading className="text-white text-2xl font-bold text-center m-0">
                🔐 Verify Your Email
              </Heading>
            </Section>

            {/* Content */}
            <Section className="px-10 py-8">
              <Heading className="text-2xl font-semibold text-gray-800 mb-4">
                Hello {fullname}! 👋
              </Heading>
              
              <Text className="text-gray-600 text-base leading-relaxed mb-4">
                Thank you for signing up. Please verify your email address using the OTP below:
              </Text>

              {/* OTP Box */}
              <Section className="bg-gray-50 border-2 border-dashed border-indigo-400 rounded-lg px-8 py-6 my-8 text-center">
                <Text className="text-5xl font-bold text-indigo-500 tracking-[10px] font-mono m-0">
                  {otp}
                </Text>
                <Text className="text-gray-500 text-sm mt-2">
                  Enter this code to complete your registration
                </Text>
              </Section>

              {/* Verify Button */}
              <Section className="text-center my-8">
                <Button
                  href={verifyUrl}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-md text-base no-underline inline-block transition-colors"
                >
                  Verify Email
                </Button>
              </Section>

              {/* Expiry Info */}
              <Text className="text-gray-600 text-sm text-center mt-4">
                ⏰ This OTP will expire in{' '}
                <span className="text-red-600 font-semibold">15 minutes</span>
              </Text>

              <Hr className="border-t border-gray-200 my-8" />

              {/* Footer Note */}
              <Text className="text-gray-400 text-sm">
                If you didn't create an account with us, you can safely ignore this email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-10 py-6 text-center border-t border-gray-200">
              <Text className="text-gray-500 text-sm m-0">
                © {new Date().getFullYear()} YourCompany. All rights reserved.
              </Text>
              <Link
                href="mailto:support@yourcompany.com"
                className="text-indigo-500 no-underline text-sm"
              >
                support@yourcompany.com
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default VerificationEmail