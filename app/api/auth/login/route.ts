import { NextResponse, NextRequest } from "next/server";
import { prisma } from '@/lib/prisma'
import { SignJWT } from "jose";
import { Credentials } from "@/utils/validations";
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
    try {
        const { email, password }: Credentials = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                {
                    message: "All Fields are required",
                    success: false,
                }, { status: 400 }
            )
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    message: "Invalid credentials",
                    success: false
                }, { status: 400 }
            )
        }
        if (password.length < 6) {
            return NextResponse.json(
                {
                    message: "Invalid credentials",
                    success: false
                }, { status: 400 }
            )
        }
        const user = await prisma.user.findUnique(
            {
                where: { email }
            }
        )
        if (!user) {
            return NextResponse.json(
                {
                    message: "Invalid Credentials",
                    success: false
                },
                { status: 401 }
            )
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    message: "Invalid Credentials",
                    success: false
                },
                { status: 401 }
            )
        }
        if (!user.isVerified) {
            return NextResponse.json(
                {
                    message: "User not verified",
                    success: false
                }, { status: 403 }
            )
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new SignJWT(
            {
                userId: user.id,
                email: user.email
            }
        ).setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(secret)
        const response = NextResponse.json(
            {
                message: "Logged in successfully",
                success: true
            }, { status: 200 }
        )
        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV == 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        })

        return response
    } catch (error) {
        console.error('Login route error:', error);
        return NextResponse.json(
            { message: 'Internal server error' , success:false },

            { status: 500 }
        );
    }
}