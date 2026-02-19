import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Recipe Saver',
    description: 'Save and organize your favorite recipes.',
};

import Navbar from '@/components/Navbar';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={clsx(inter.className, "antialiased min-h-screen bg-background text-foreground")}>
                <Navbar />
                <main className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
                    {children}
                </main>
            </body>
        </html>
    );
}
