import LogoutButton from '@/components/auth/logutButton';
import { fetchUser } from '@/lib/actions/userAction';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const HomePage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarding) {
    redirect("/onboarding")
  };
  return (
    <div>
      HomePage
    </div>
  );
};

export default HomePage;