'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductAnalytics } from '@/types';

interface AspectBarChartProps {
    analytics: ProductAnalytics;
}

export function AspectBarChart({ analytics }: AspectBarChartProps) {
    const data = analytics.aspect_frequency;

    return (
        <Card className="col-span-1 bg-card/50 backdrop-blur-sm border-muted/20">
            <CardHeader>
                <CardTitle>Top Mentioned Aspects</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="aspect"
                            type="category"
                            width={80}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                        // RTL support might need adjustments, but standard text direction usually works
                        />
                        <Tooltip
                            cursor={false}
                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                        />
                        <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
