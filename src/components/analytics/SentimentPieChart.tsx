'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductAnalytics } from '@/types';

interface SentimentPieChartProps {
    analytics: ProductAnalytics;
}

const COLORS = ['var(--chart-2)', 'var(--destructive)', 'var(--chart-4)']; // Green (Positive), Red (Negative), Yellow (Neutral)

export function SentimentPieChart({ analytics }: SentimentPieChartProps) {
    const { positive, negative, neutral } = analytics.sentiment_distribution;

    const data = [
        { name: 'Positive', value: positive },
        { name: 'Negative', value: negative },
        { name: 'Neutral', value: neutral },
    ];

    return (
        <Card className="col-span-1 bg-card/50 backdrop-blur-sm border-muted/20">
            <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            cursor={false}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
