'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import RecipeCard from '@/components/RecipeCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search, Loader2, X } from 'lucide-react'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All')
    const [recipes, setRecipes] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRecipes()
        }, 500)

        return () => clearTimeout(timer)
    }, [query, category])

    const fetchRecipes = async () => {
        setLoading(true)
        try {
            let queryBuilder = supabase
                .from('recipes')
                .select('*')
                .order('created_at', { ascending: false })

            if (category !== 'All') {
                queryBuilder = queryBuilder.eq('category', category)
            }

            if (query) {
                // Search in title OR ingredients (using ilike for case-insensitive)
                // Note: searching arrays in Supabase via ilike text representation is a simple tailored approach
                queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            }

            const { data, error } = await queryBuilder

            if (error) throw error
            setRecipes(data || [])
        } catch (error) {
            console.error('Error fetching recipes:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Search Recipes</h1>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by title or description..."
                            className="pl-9"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat}
                                variant={category === cat ? 'primary' : 'outline'}
                                onClick={() => setCategory(cat)}
                                className="whitespace-nowrap"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    No recipes found matching your criteria.
                </div>
            )}
        </div>
    )
}
