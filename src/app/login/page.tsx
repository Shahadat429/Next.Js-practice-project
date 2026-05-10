'use client'
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const session = useSession();
  console.log(session?.data?.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })


      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className='bg-white  border-base-300 rounded-box border p-4 w-[400px] text-black'>
        <h1 className="text-2xl text-center w-full">Login</h1>
        <form className="fieldset" onSubmit={handleLogin}>

          <label className="label">Email</label>
          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* <label className="label">Confirm Password</label>
                    <input type="password" className="input w-full" placeholder="Confirm Password" /> */}

          <button className="btn btn-neutral mt-4">Login</button>

          <p className="text-sm mt-2">Didn't have an account?
            <span onClick={() => router.push('/register')} className="link link-hover text-blue-700"> Register</span></p>

          <div className="divider">OR</div>

          <button type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn bg-black text-white border-[#e5e5e5]">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Sign In with Google
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

