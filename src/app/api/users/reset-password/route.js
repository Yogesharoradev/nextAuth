import connect from '@/dbConfig/config';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(req) {
    try {
        const { token, newPassword, confirmPassword } = await req.json();

        if (!newPassword || !confirmPassword) {
            return NextResponse.json({ status: 400, success: false, message: "Please provide both new password and confirm password." });
        }
        
        if (newPassword !== confirmPassword) {
            return NextResponse.json({ status: 400, success: false, message: "Passwords do not match." });
        }
        console.log('Received token:', token); 
        console.log('Token Secret:', process.env.TOKEN_SECRET);

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET); 
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ status: 404, success: false, message: "User not found." });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ status: 200, success: true, message: "Password changed successfully." });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ status: 500, success: false, message: "Unable to change password" });
    }
}
