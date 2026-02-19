'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { LogOut, Plus, Search, UtensilsCrossed, User as UserIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const router = useRouter()
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/auth')
        router.refresh()
    }

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <UtensilsCrossed className="h-6 w-6" />
                    <span>Recipe Saver</span>
                </Link>

                {!loading && (
                    <div className="flex items-center gap-2 md:gap-4">
                        {session ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hidden md:flex"
                                    onClick={() => router.push('/search')}
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => router.push('/recipes/create')}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">New Recipe</span>
                                    <span className="sm:hidden">New</span>
                                </Button>

                                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Sign Out"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => router.push('/auth')}
                            >
                                <UserIcon className="h-4 w-4 mr-2" />
                                Sign In
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
