'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-destructive/10 p-6 rounded-full mb-8">
                <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Something went wrong!</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                We encountered an unexpected error. Our team has been notified.
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </Button>
            </div>
        </div>
    );
}
