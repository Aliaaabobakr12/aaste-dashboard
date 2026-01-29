'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductAnalytics } from '@/types';

interface SentimentByAspectProps {
    analytics: ProductAnalytics;
}

export function SentimentByAspect({ analytics }: SentimentByAspectProps) {
    const data = analytics.aspect_sentiment;

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Sentiment by Aspect</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="aspect" />
                        <YAxis />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Legend />
                        <Bar dataKey="positive" stackId="a" fill="#22c55e" name="Positive" />
                        <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
                        <Bar dataKey="neutral" stackId="a" fill="#eab308" name="Neutral" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
