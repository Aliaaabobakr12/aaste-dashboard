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
        <Card className="col-span-1">
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
                            tick={{ fontSize: 12 }}
                        // RTL support might need adjustments, but standard text direction usually works
                        />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
