import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import User from "@/model/userModel";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if(!session || !session.user.email || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const file = formData.get("image") as Blob | null;

        let imageUrl;

        if(file) {
            imageUrl = await uploadOnCloudinary(file);
        }

        const user = await User.findByIdAndUpdate(session.user.id, { name, image: imageUrl }, { new: true });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
