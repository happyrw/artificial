import Header from '@/components/shared/header';
import TransformationForm from '@/components/shared/transformationForm';
import { transformationTypes } from '@/constant';
import { getUserById } from '@/lib/actions/userAction';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
    const transformation = transformationTypes[type];
    const { userId } = auth();
    if (!userId) redirect("/");
    const user = await getUserById(userId);
    return (
        <>
            <Header
                title={transformation.title}
                subtitle={transformation.subTitle}
            />

            <TransformationForm
                action="Add"
                userId={user._id}
                type={transformation.type as TransformationTypeKey}
                creditBalance={user.creditBalance}
            />
        </>
    )
}

export default AddTransformationTypePage;