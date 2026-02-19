'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import ImageUpload from '@/components/ImageUpload'
import { Plus, Trash2, Clock, Users, Save } from 'lucide-react'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

export default function RecipeForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Form State
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [ingredients, setIngredients] = useState<string[]>([''])
    const [instructions, setInstructions] = useState('')
    const [prepTime, setPrepTime] = useState('')
    const [cookTime, setCookTime] = useState('')
    const [servings, setServings] = useState('')
    const [category, setCategory] = useState(CATEGORIES[2]) // Default to Dinner
    const [imageUrl, setImageUrl] = useState('')

    // Ingredient Handlers
    const handleAddIngredient = () => {
        setIngredients([...ingredients, ''])
    }

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients]
        newIngredients[index] = value
        setIngredients(newIngredients)
    }

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients)
    }

    // Submission Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('You must be logged in to create a recipe')

            // Filter out empty ingredients
            const validIngredients = ingredients.filter(i => i.trim() !== '')

            const recipeData = {
                user_id: user.id,
                title,
                description,
                ingredients: validIngredients,
                instructions,
                prep_time: parseInt(prepTime) || 0,
                cook_time: parseInt(cookTime) || 0,
                servings: parseInt(servings) || 1,
                category,
                image_url: imageUrl,
            }

            const { error } = await supabase
                .from('recipes')
                .insert([recipeData])

            if (error) throw error

            router.push('/')
            router.refresh()

        } catch (error: any) {
            alert('Error creating recipe: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-20">

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Create New Recipe</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Share your culinary masterpiece with the world.</p>
            </div>

            {/* Image Upload */}
            <section>
                <label className="block text-sm font-medium mb-3">Recipe Photo</label>
                <ImageUpload onUpload={setImageUrl} />
            </section>

            {/* Basic Info */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium">Title</label>
                    <Input
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Grandma's Apple Pie"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium">Short Description</label>
                    <textarea
                        className="w-full flex min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="A brief overview of the dish..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium flex items-center gap-2">
                        <Users size={16} /> Servings
                    </label>
                    <Input
                        type="number"
                        min="1"
                        value={servings}
                        onChange={e => setServings(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium flex items-center gap-2">
                        <Clock size={16} /> Prep Time (mins)
                    </label>
                    <Input
                        type="number"
                        min="0"
                        value={prepTime}
                        onChange={e => setPrepTime(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium flex items-center gap-2">
                        <Clock size={16} /> Cook Time (mins)
                    </label>
                    <Input
                        type="number"
                        min="0"
                        value={cookTime}
                        onChange={e => setCookTime(e.target.value)}
                    />
                </div>
            </section>

            {/* Ingredients */}
            <section className="space-y-4">
                <label className="block text-lg font-semibold">Ingredients</label>
                <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={ingredient}
                                onChange={e => handleIngredientChange(index, e.target.value)}
                                placeholder={`Ingredient ${index + 1}`}
                            />
                            {ingredients.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleRemoveIngredient(index)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddIngredient} className="mt-2">
                        <Plus size={16} className="mr-1" /> Add Ingredient
                    </Button>
                </div>
            </section>

            {/* Instructions */}
            <section className="space-y-4">
                <label className="block text-lg font-semibold">Instructions</label>
                <textarea
                    className="w-full flex min-h-[200px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 leading-relaxed"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="Step 1: Preheat oven to..."
                />
                <p className="text-xs text-muted-foreground">Tip: Use blank lines to separate paragraphs.</p>
            </section>

            {/* Submit */}
            <div className="pt-6 border-t border-border flex justify-end">
                <Button size="lg" type="submit" isLoading={loading} className="w-full md:w-auto">
                    <Save size={18} className="mr-2" />
                    Save Recipe
                </Button>
            </div>

        </form>
    )
}
