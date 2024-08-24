import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const HomePage = async () => {
  // const user = await currentUser();
  // if (!user) return null;

  return (
    <div>
      HomePage
    </div>
  );
};

export default HomePage;