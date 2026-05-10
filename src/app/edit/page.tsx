'use client'
import axios from 'axios';
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { CgProfile } from "react-icons/cg";

function Page() {

    const { data, update } = useSession();
    const [name, setName] = useState('');
    const [frontendImage, setFrontendImage] = useState('');
    const [backendImage, setBackendImage] = useState<File>();
    const imageInput = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return;
        const file = files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (backendImage) {
                formData.append("image", backendImage);
            }

            const result = await axios.post('/api/edit', formData);
            setLoading(false);
            await update();
            console.log(result);
            toast.success("Profile updated successfully!");
        } catch (error) {
            setLoading(false);
            toast.error("Failed to update profile. Please try again.");
        }
    }

    useEffect(() => {
        if (data) {
            setName(data.user.name || '');
            setFrontendImage(data.user.image || '');
        }
    }, [data]);

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-black text-white px-4'>
            <div className='w-full max-w-md border-2 border-white rounded-2xl p-8 shadow-lg'>
                <h1 className='text-2xl text-center font-semibold mb-2'>Edit Profile</h1>
                <form onSubmit={handleSubmit} className="space-y-2 flex flex-col w-full items-center">

                    <div className='w-[100px] h-[100px] rounded-full border-2 flex justify-center items-center border-white transition-all hover:border-blue-500 hover:text-blue-500 cursor-pointer overflow-hidden relative  ' onClick={() => imageInput.current?.click()}>

                        <input type='file' accept='image/*' hidden ref={imageInput} onChange={handleImage} />

                        {
                            frontendImage ? <Image src={frontendImage} alt='User Image' fill className='object-cover' /> : <CgProfile size={60} color='white' />
                        }
                    </div>
                    <div className='w-full'>
                        <label className="label">Name</label>
                        <input
                            type="text"
                            className="w-full border-b border-white py-2 px-1 bg-black text-white outline-none placeholder-gray-500"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-white text-black py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors cursor-pointer" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Page
