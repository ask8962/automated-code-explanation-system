'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ExplanationSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Overview Skeleton */}
            <Card className="border-l-4 border-l-primary/30 bg-card/50 border-y border-r border-border shadow-lg">
                <CardHeader className="pb-2">
                    <div className="h-6 w-32 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-muted rounded" />
                        <div className="h-4 w-3/4 bg-muted rounded" />
                        <div className="h-4 w-5/6 bg-muted rounded" />
                    </div>
                </CardContent>
            </Card>

            {/* Steps Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div className="h-6 w-36 bg-muted rounded" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 bg-muted rounded" />
                                    <div className="h-3 w-full bg-muted rounded" />
                                    <div className="h-3 w-2/3 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Key Concepts Skeleton */}
                <div className="space-y-4">
                    <div className="h-6 w-32 bg-muted rounded" />
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="bg-card border-border shadow-sm">
                            <CardContent className="p-4 space-y-2">
                                <div className="h-4 w-1/2 bg-muted rounded" />
                                <div className="h-3 w-full bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Complexity Skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                    <CardContent className="p-4 space-y-2">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-8 w-16 bg-muted rounded" />
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardContent className="p-4 space-y-2">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-8 w-16 bg-muted rounded" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
