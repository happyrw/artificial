import LogoutButton from '@/components/auth/logutButton';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const HomePage = async () => {
  const user = await currentUser();
  if (!user) return null;

  return (
    <div>
      HomePage
    </div>
  );
};

export default HomePage;