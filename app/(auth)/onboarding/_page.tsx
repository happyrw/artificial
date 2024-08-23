// import AccountProfile from "@/components/auth/accoutProfile";
// import { fetchUser } from "@/lib/actions/userAction";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// async function Page() {
//     const user = await currentUser();
//     if (!user) return null;

//     const userInfo = await fetchUser(user.id);
//     if (userInfo?.onboarding) redirect('/');

//     const userData = {
//         id: user?.id,
//         objectId: userInfo?._id,
//         username: userInfo?.username || user?.username,
//         name: userInfo?.name || user?.firstName || "",
//         bio: userInfo?.bio || "",
//         image: userInfo?.image || user?.imageUrl,
//     }

//     return (
//         <main className="bg-black/40 text-white p-5 shadow-md shadow-white mb-2">
//             <h1 className="text-2xl font-bold">Onboarding</h1>
//             <p className="mb-4 capitalize font-extralight">
//                 complete your profile now
//             </p>
//             <section>
//                 <AccountProfile user={userData} />
//             </section>
//         </main>
//     )
// };

// export default Page;