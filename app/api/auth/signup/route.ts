import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/utils/sendVerificationEmail';
import { Credentials } from '@/utils/validations';
export async function POST(req: NextRequest) {
    try {
        const { username, fullname, email, password }: Credentials = await req.json();

        if (!username || !fullname || !email || !password) {
            return NextResponse.json({
                message: "All fields are required",
                success: false
            }, { status: 400 })

        }
        const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                message: "Invalid E-mail",
                success: false
            }, { status: 400 })

        }
        if (password.length < 6) {
            return NextResponse.json({
                message: "Password length should be greater than or equal to 6 characters",
                success: false
            },{status:400})
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (existingUser) {
            return NextResponse.json({
                message: "User already exist",
                success: false
            }, { status: 409 })

        }
        const hashPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000)
        const emailResponse =await  sendVerificationEmail(email, fullname, otp )
        if (!emailResponse.success) {
            return NextResponse.json({ message: "Unable to send verification E-mail . Please try again later", success: false }, { status: 503 })
        }
        const user = await prisma.user.create({
            data: {
                username, fullname, email, password: hashPassword, otp, otpExpiry
                , isVerified: false
            }
        })
        return NextResponse.json({
            message: "User created successfully",
            userId: user.id,
            email: user.email,
            success: true
        }, { status: 201 })

    } catch (error) {
        console.log("Error in signup", error)
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 })
    }
}