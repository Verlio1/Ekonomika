import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'
import RecipeCard from '@/components/RecipeCard'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

// Prevent caching so we always get fresh data
export const dynamic = 'force-dynamic'

export default async function Home() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    // If not logged in, show landing page content
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
                    Your Personal <br /> Culinary Collection
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    Save, organize, and share your favorite recipes in one beautiful place.
                    Access them from anywhere, anytime.
                </p>
                <div className="flex gap-4">
                    <Link href="/auth">
                        <Button size="lg">Get Started</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Fetch recipes for logged-in user
    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Recipes</h1>
                    <p className="text-muted-foreground">
                        {recipes?.length || 0} {(recipes?.length === 1) ? 'recipe' : 'recipes'} in your collection
                    </p>
                </div>
                <Link href="/recipes/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Recipe
                    </Button>
                </Link>
            </div>

            {recipes && recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recipes.map((recipe: any) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-full mb-4 shadow-sm">
                        <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm text-center">
                        Start building your collection by adding your first culinary masterpiece.
                    </p>
                    <Link href="/recipes/create">
                        <Button>Create Recipe</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
