import AuthForm from '@/components/AuthForm'

export default function AuthPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-primary mb-2">Recipe Saver</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Your personal cookbook in the cloud.</p>
            </div>
            <AuthForm />
        </main>
    )
}
