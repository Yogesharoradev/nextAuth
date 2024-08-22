import connect from '@/dbConfig/config';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(req){
    try{    
        const reqBody = await req.json()
        const {email , password} = reqBody

        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({message : "User not exist signup" , status : 500})
        }
       const ValidPassword =  await bcryptjs.compare(password , user.password)

       if(!ValidPassword){
        return NextResponse.json({message : "Wrong Password" , status : 500})
       }
       
       const tokenData = {
            id : user._id,
            username : user.username,
            email  : user.email
       }

      const token =  jwt.sign(tokenData , process.env.TOKEN_SECRET , {expiresIn:"1d"})

      const response =  NextResponse.json({message : "Login succesfull", success: true  , status : 200})

       response.cookies.set("token" , token , {httpOnly :true})

       return response


    }catch(err){
        return NextResponse.json({message : "error in login" , status : 500})
    }
}