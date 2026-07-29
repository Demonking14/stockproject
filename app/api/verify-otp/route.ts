import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from '@/lib/prisma'
import { Credentials } from "@/utils/validations";
export async function POST(request: NextRequest) {
    try {
        const { email, otp }:Credentials= await request.json();
        if (!email || !otp) {
            return NextResponse.json(
                {
                    message: "Email and OTP are required",
                    success: false
                },
                {
                    status: 400
                }
            )
        }
        const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                message: "Invalid E-mail",
                success: false
            }, { status: 400 })
        }
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                    success: false
                }, { status: 404 }
            )
        }
        if (user.otp !== otp) {
            return NextResponse.json(
                {
                    message: "Invalid OTP",
                    success: false
                }, { status: 401 }
            )
        }
        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return NextResponse.json({
                message: "OTP has expired",
                success: false
            }, { status: 401 })
        }
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null
            }
        })
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({
            userId: updatedUser.id,
            email: updatedUser.email
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(secret)

        const response = NextResponse.json(
            {
                message: "Email Verified Successfully",
                success: true,
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    isVerified: updatedUser.isVerified
                }
            }, { status: 200 })
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })
        return response;
    } catch (error) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            { message: 'Internal server error' , success:false },
            { status: 500 }
        );
    }
}