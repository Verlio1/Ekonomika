import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, ChefHat } from 'lucide-react'
import FavoriteButton from '@/components/FavoriteButton'

interface Recipe {
    id: string
    title: string
    description: string
    image_url: string | null
    prep_time: number
    cook_time: number
    servings: number
    category: string
    is_favorite?: boolean // Added this line
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

    return (
        <Link href={`/recipes/${recipe.id}`} className="group block h-full">
            <article className="h-full flex flex-col rounded-xl overflow-hidden border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:ring-2 hover:ring-primary/20 relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {recipe.image_url ? (
                        <Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                            <ChefHat size={48} className="opacity-20" />
                        </div>
                    )}

                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                        <FavoriteButton recipeId={recipe.id} initialIsFavorite={recipe.is_favorite || false} />
                    </div>

                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-black/50 text-white backdrop-blur-md rounded-full shadow-sm">
                            {recipe.category}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col flex-1 p-4 gap-2">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {recipe.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
                        {recipe.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                        {totalTime > 0 && (
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{totalTime}m</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{recipe.servings} pp</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    )
}
