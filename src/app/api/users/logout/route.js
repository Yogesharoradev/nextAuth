import connect from '@/dbConfig/config';
import { NextResponse } from 'next/server';

connect()

export async function GET(req){
    try{    
    const response = NextResponse.json({message : "Logout Successfully" , status : 200})

    response.cookies.set("token", "" ,{httpOnly : false , expiresIn : new Date(0) })

    return response


    }catch(err){
        return NextResponse.json({message : err.message , status : 500})
    }
}