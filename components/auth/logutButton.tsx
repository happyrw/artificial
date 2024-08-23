"use client";

import { SignedIn, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React from 'react'

const LogoutButton = () => {
    const router = useRouter();

    const handleSignOut = () => {
        router.push('/sign-in');
    };
    return (
        <div>
            <SignedIn>
                <SignOutButton>
                    <button onClick={handleSignOut}>Logout</button>
                </SignOutButton>
            </SignedIn>
        </div>
    )
}

export default LogoutButton;