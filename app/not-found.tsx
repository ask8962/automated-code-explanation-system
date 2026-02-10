'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-secondary/20 p-6 rounded-full mb-8">
                <FileQuestion className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
            <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </Button>
            </Link>
        </div>
    );
}
