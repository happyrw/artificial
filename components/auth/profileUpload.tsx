import { UploadButton } from '@/lib/uploadthing';
import React from 'react'

interface FileProps {
    onChange: (url: string) => void;
    value: string;
}

const ProfileUpload = ({ onChange, value }: FileProps) => {
    return (
        <main>
            <UploadButton
                endpoint="imageUploader"
                appearance={{
                    allowedContent: {
                        display: 'none'
                    }
                }}
                onClientUploadComplete={(res) => {
                    onChange(res?.[0].url)
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </main>
    )
}

export default ProfileUpload;