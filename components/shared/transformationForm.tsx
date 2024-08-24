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

import { formSchema } from "@/lib/validation/user";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Loader, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { defaultValues } from "@/constant";

const TransformationForm = ({ data = null, action }: TransformationFormProps) => {
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const initialValues = data && action === "Update" ? {
        title: data.title,
        publicId: data.publicId,
        aspectRatio: data.aspectRatio,
        color: data.color,
        prompt: data.prompt,
    } : defaultValues

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    };

    return (
        <div>TransformationForm</div>
    )
}

export default TransformationForm;