"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { UserValidation } from "@/lib/validation/user";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import ProfileUpload from "./profileUpload";
import { Loader, X } from "lucide-react";
import { UpdateUser } from "@/lib/actions/userAction";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
};

const AccountProfile = ({ user }: Props) => {
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user.image || '',
            name: user.name || '',
            username: user.username || '',
            bio: user.bio || '',
        }
    });

    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        setLoading(true);
        try {
            await UpdateUser({
                username: values.username,
                userId: user.id,
                name: values.name,
                image: values.profile_photo,
                path: pathname,
                bio: values.bio,
            });

            if (pathname === "/profile/edit") {
                router.back()
            } else {
                router.push("/");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-4 mx-auto min-w-[90vw] md:min-w-[500px]"
            >
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-5">
                            <FormLabel>
                                {field.value && (
                                    <div className='relative h-20 w-20 bg-slate-300 rounded-full'>
                                        <Image
                                            fill
                                            src={field.value}
                                            alt='profile picture'
                                            className='rounded-full object-cover'
                                        />
                                        <button
                                            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                                            type='button'
                                            onClick={() => field.onChange("")}
                                        >
                                            <X className='h-4 w-4' />
                                        </button>
                                    </div>
                                )}
                            </FormLabel>
                            <FormControl>
                                {!field.value && <ProfileUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                                }
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    className="text-black"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    className="text-black"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={5}
                                    {...field}
                                    className="text-black"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button disabled={loading} type="submit" className="bg-blue-950">{loading ? <Loader className="w-4 h-4 animate-spin" /> : "Submit"}</Button>
            </form>
        </Form>
    );
};

export default AccountProfile;