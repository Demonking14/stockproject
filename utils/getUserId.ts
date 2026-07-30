import { NextRequest } from "next/server";
export  function getUserId(request:NextRequest) {
    const userId = request.headers?.get('x-user-id');
    if(!userId){
        return null
    }
    return Number(userId);
}