import connect from '@/dbConfig/config';
import { sendEmail } from '@/helpers/mailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';

connect();

export async function POST(req) {
    try {
     
        const reqBody = await req.json();
        const { email, username, password } = reqBody

        if (!email || !username || !password) {
            return NextResponse.json({ error: 'All fields are required', status: 400 });
        }

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: 'User already exists', status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save()

       
        await sendEmail({ email, emailType: 'VERIFY', userId: savedUser._id });

        return NextResponse.json({
            message: 'User registered successfully',
            success: true,
            savedUser,
        });

    } catch (err) {
        console.error('Error during signup:', err.message);
        return NextResponse.json({ error: err.message, status: 500 });
    }
}
