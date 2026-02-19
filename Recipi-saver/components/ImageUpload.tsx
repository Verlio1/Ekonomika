'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    onUpload: (url: string) => void
    initialImage?: string
}

export default function ImageUpload({ onUpload, initialImage }: ImageUploadProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return
        }

        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        setUploading(true)

        try {
            const { error: uploadError } = await supabase.storage
                .from('recipe-images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath)

            setImageUrl(data.publicUrl)
            onUpload(data.publicUrl)

        } catch (error: any) {
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        setImageUrl(null)
        onUpload('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center group hover:border-primary transition-colors">
                {imageUrl ? (
                    <>
                        <Image
                            src={imageUrl}
                            alt="Recipe Upload"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </>
                ) : (
                    <div className="text-center p-6 text-muted-foreground">
                        {uploading ? (
                            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-primary" />
                        ) : (
                            <ImagePlus className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        )}
                        <p className="text-sm font-medium">
                            {uploading ? 'Uploading...' : 'Click or drag to upload photo'}
                        </p>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={uploading}
                />
            </div>
        </div>
    )
}
