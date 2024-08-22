
import { sendEmail } from '@/helpers/mailer';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const {email} = await req.json();

    if (!email) {
      return NextResponse.json({status : 500 , message : "Email required" })
    }
   

    const user  = await User.findOne({email})

    if (!user) {
      return NextResponse.json({status : 500 , message : "User is undefined" })
    }


    await sendEmail({
      email,
      emailType: 'RESET',
      userId : user._id,
    });

    return  NextResponse.json({status : 200 , message : "Email sent sucessfully" })
  } catch (err) {
    return  NextResponse.json({status : 500 , message : "Email not send failed" })
  }
}
