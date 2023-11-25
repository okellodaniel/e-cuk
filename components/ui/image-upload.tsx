"use client";

import { Mountain, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    if (!isMounted) return null;

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] overflow-hidden rounded-md">
                        <div className="z-10 absolute top-2 right-2">
                            <Button className="button" onClick={() => onRemove(url)}>
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageUpload;