import connectDB from "@/lib/db";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();
        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        await connectDB();

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        if(password.length < 6){
            return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ user }, { status: 201 });

    } catch (error) {
        return NextResponse.json({message: `Registration error: ${error}`}, { status: 500 })
    }
}

