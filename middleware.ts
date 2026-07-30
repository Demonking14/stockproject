import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export async function middleware(request:NextRequest) {
    const token = request.cookies.get("token")?.value;
    if(!token){
        return NextResponse.json(
            {
                message:"Unauthorized",
                success:false
            }, {status:401}
        )
    }
    try {
        const {payload}  = await jwtVerify(token, secret);
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id' , String(payload.userId));  
        return NextResponse.next({request:{headers:requestHeaders}});
    } catch (error) {
        return NextResponse.json(
            {
                message:"Invalid or expired token",
                success:false
            },
            {status:401}
        )
    }
}
export const config = {
    matcher:['/api/portfolio/:path*' , '/api/orders/:path*' , '/api/holdings/:path*'  , '/api/profile/:path*', '/portfolio'  , '/orders' , '/holdings' , '/profile' ]
};