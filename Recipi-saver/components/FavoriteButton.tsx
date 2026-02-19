'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
    recipeId: string
    initialIsFavorite: boolean
}

export default function FavoriteButton({ recipeId, initialIsFavorite }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if on a card
        e.stopPropagation()

        setLoading(true)
        const newState = !isFavorite
        setIsFavorite(newState) // Optimistic update

        try {
            const { error } = await supabase
                .from('recipes')
                .update({ is_favorite: newState })
                .eq('id', recipeId)

            if (error) {
                throw error
            }

            router.refresh()
        } catch (error) {
            console.error('Error toggling favorite:', error)
            setIsFavorite(!newState) // Revert on error
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            disabled={loading}
            className={`rounded-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 ${isFavorite ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
        >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
    )
}
