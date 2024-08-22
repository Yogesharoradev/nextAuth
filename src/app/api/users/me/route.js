import connect from '@/dbConfig/config';
import { getData } from '@/helpers/getData';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';

connect()

export async function POST(req){
    try{  
      const UserId = await getData(req)
        
     const user = await User.findOne({_id : UserId}).select("-password")
        
    return NextResponse.json({message : "Welcome" , status : 200 ,data : user})



    }catch(err){
        return NextResponse.json({message : err.message , status : 500})
    }
}