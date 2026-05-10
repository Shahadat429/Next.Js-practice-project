'use client'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { createContext, useEffect, useState } from 'react'

type UserContextType = {
    user: userType | undefined;
    setUser: (user: userType) => void;
}
type userType = {
    id: string;
    name: string;
    email: string;
    image?: string;
}


const userDataConext = createContext<UserContextType | undefined>(undefined);

function UserContext({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<userType | undefined>(undefined);
    const session = useSession();
    useEffect(() => {
        async function getUser(){
            try {
                const result = await axios.get('/api/user'); 
                setUser(result.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
        getUser();
    }, [session])

    const data = {
        user,
        setUser
    }

  return (
    <userDataConext.Provider value={data}>
        {children}
    </userDataConext.Provider>
  )
}

export default UserContext
