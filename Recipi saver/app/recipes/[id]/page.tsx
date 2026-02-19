import { createClient } from '@/lib/supabaseServer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Clock, Users, ChevronLeft, Calendar } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/auth')
    }

    const { data: recipe } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!recipe) {
        notFound()
    }

    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Link href="/">
                <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Recipes
                </Button>
            </Link>

            <article className="space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                {recipe.category}
                            </span>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">{recipe.title}</h1>
                        </div>
                        {/* Edit/Delete Actions could go here */}
                    </div>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {recipe.description}
                    </p>

                    <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                        <div className="flex items-center gap-2">
                            <Clock className="text-primary h-5 w-5" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Time</span>
                                <span className="font-medium">{totalTime} mins</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users className="text-primary h-5 w-5" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Servings</span>
                                <span className="font-medium">{recipe.servings} people</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="text-primary h-5 w-5" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Created</span>
                                <span className="font-medium">{new Date(recipe.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                {recipe.image_url && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                        <Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                    {/* Ingredients Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-foreground">Ingredients</h3>
                        <ul className="space-y-3">
                            {recipe.ingredients && recipe.ingredients.map((ingredient: string, index: number) => (
                                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                    <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                    <span className="leading-snug">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-foreground">Instructions</h3>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            {recipe.instructions.split('\n').map((paragraph: string, index: number) => (
                                paragraph.trim() && (
                                    <p key={index} className="mb-4 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                                        {paragraph}
                                    </p>
                                )
                            ))}
                        </div>
                    </div>
                </div>

            </article>
        </div>
    )
}
