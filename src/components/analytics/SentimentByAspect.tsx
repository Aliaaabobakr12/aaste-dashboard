'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductAnalytics } from '@/types';

interface SentimentByAspectProps {
    analytics: ProductAnalytics;
}

export function SentimentByAspect({ analytics }: SentimentByAspectProps) {
    const data = analytics.aspect_sentiment;

    return (
        <Card className="col-span-1 md:col-span-2 bg-card/50 backdrop-blur-sm border-muted/20">
            <CardHeader>
                <CardTitle>Sentiment Trends by Aspect</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)/0.1" vertical={false} />
                        <XAxis
                            dataKey="aspect"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ stroke: 'var(--muted)/0.2', strokeWidth: 2 }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: 'var(--radius)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            labelStyle={{ color: 'var(--muted-foreground)' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                        />
                        <Line
                            type="monotone"
                            dataKey="positive"
                            name="Positive"
                            stroke="var(--chart-2)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--chart-2)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="neutral"
                            name="Neutral"
                            stroke="var(--chart-4)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--chart-4)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="negative"
                            name="Negative"
                            stroke="var(--destructive)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--destructive)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
