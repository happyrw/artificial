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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { formSchema } from "@/lib/validation/user";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Loader, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constant";
import { CustomField } from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import MediaUploader from "./mediaUploader";
import TransformedImage from "./transformedImage";
import { updateCredits } from "@/lib/actions/userAction";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/imageActions";
import { InsufficientCreditsModal } from "./insufficientCreditsModal";

const TransformationForm = ({ data = null, action, userId, creditBalance, type, config }: TransformationFormProps) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(data);
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config);
    const [isPending, startTransition] = useTransition();

    const transformationType = transformationTypes[type];
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

        setLoading(true);

        if (data || image) {
            const transformationUrl = getCldImageUrl({
                width: image?.width,
                height: image?.height,
                src: image?.publicId,
                ...transformationConfig,
            })

            const imageData = {
                title: values.title,
                publicId: image?.publicId,
                transformationType: type,
                width: image?.width,
                height: image?.height,
                config: transformationConfig,
                secureURL: image?.secureURL,
                transformationURL: transformationUrl,
                aspectRatio: values.aspectRatio,
                prompt: values.prompt,
                color: values.color,
            }

            if (action === 'Add') {
                try {
                    const newImage = await addImage({
                        image: imageData,
                        userId,
                        path: '/'
                    })

                    if (newImage) {
                        form.reset()
                        setImage(data)
                        router.push(`/transformations/${newImage._id}`)
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            if (action === 'Update') {
                try {
                    const updatedImage = await updateImage({
                        image: {
                            ...imageData,
                            _id: data._id,
                        },
                        userId,
                        path: `/transformations/${data._id}`
                    })

                    if (updatedImage) {
                        router.push(`/transformations/${updatedImage._id}`)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        setLoading(false);
    };

    const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imageSize = aspectRatioOptions[value as AspectRatioKey];
        setImage((prevState: any) => ({
            ...prevState,
            aspectRatio: imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height,
        }));

        setNewTransformation(transformationType.config);
        return onChangeField(value);
    }

    const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
        debounce(() => {
            setNewTransformation((prevState: any) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']: value
                }
            }))
        }, 1000)();
        return onChangeField(value);
    }
    const onTransformHandler = () => {
        setIsTransforming(true);
        setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig));
        setNewTransformation(null);

        startTransition(async () => {
            await updateCredits(userId, creditFee);
        })
    };

    useEffect(() => {
        if (image && (type === 'restore' || 'removeBackground')) {
            setNewTransformation(transformationType.config);
        }
    }, [image, transformationType.config, type]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
                <CustomField
                    control={form.control as any}
                    name="title"
                    formLabel="Image Title"
                    className="w-full"
                    render={({ field }) => <Input {...field} className="input-field" />}
                />

                {type === 'fill' && (
                    <CustomField
                        control={form.control as any}
                        name="aspectRatio"
                        formLabel="Aspect ratio"
                        className="w-full"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                                value={field.value}
                            >
                                <SelectTrigger className="select-field">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(aspectRatioOptions).map((key) => (
                                        <SelectItem key={key} value={key} className="select-item">
                                            {aspectRatioOptions[key as AspectRatioKey].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        )}
                    />
                )}

                {(type === 'remove' || type === 'recolor') && (
                    <div className="prompt-field">
                        <CustomField
                            control={form.control as any}
                            name="prompt"
                            className="w-full"
                            formLabel={type === 'remove' ? "Object remove" : "Object recolor"}
                            render={({ field }) => (
                                <Input
                                    value={field.value} className="input-field"
                                    onChange={(e) => onInputChangeHandler('prompt', e.target.value, type, field.onChange)}
                                />
                            )}
                        />

                        {type === 'recolor' && (
                            <CustomField
                                control={form.control as any}
                                name="color"
                                formLabel="Replacement color"
                                className="w-full"
                                render={({ field }) => (
                                    <Input
                                        value={field.value} className="input-field"
                                        onChange={(e) => onInputChangeHandler('color', e.target.value, 'recolor', field.onChange)}
                                    />
                                )}
                            />
                        )}
                    </div>
                )}

                <div className="media-uploader-field">
                    <CustomField
                        control={form.control as any}
                        name="publicId"
                        className="flex size-full flex-col"
                        render={({ field }) => (
                            <MediaUploader
                                onValueChange={field.onChange}
                                setImage={setImage}
                                publicId={field.value}
                                image={image}
                                type={type}
                            />
                        )}
                    />

                    <TransformedImage
                        image={image}
                        type={type}
                        title={form.getValues().title}
                        isTransforming={isTransforming}
                        setIsTransforming={setIsTransforming}
                        transformationConfig={transformationConfig as any}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Button type='button' disabled={isTransforming || newTransformation === null} onClick={onTransformHandler} className="submit-button capitalize">{isTransforming ? "Transforming" : "Apply Transformation"}</Button>
                    <Button type='submit' disabled={loading} className="submit-button capitalize">{loading ? "Submitting" : "Submit"}</Button>
                </div>
            </form>
        </Form>
    )
}

export default TransformationForm;
