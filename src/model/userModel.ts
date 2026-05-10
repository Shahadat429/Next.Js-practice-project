import mongoose, { Date } from "mongoose";

interface schemaType{
    _id?: mongoose.Types.ObjectId,
    name?: string,
    image?: string,
    email: string,
    password?: string,
    createdAt?: Date,
    updatedAt?: Date
}

const userSchema = new mongoose.Schema<schemaType>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    image: { type: String }  
},{timestamps: true});

const User = mongoose.models?.User || mongoose.model('User', userSchema);

export default User;