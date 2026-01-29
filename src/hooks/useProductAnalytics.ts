import { useQuery } from '@tanstack/react-query';
import { ProductAnalytics } from '@/types';

async function fetchProductAnalytics(id: string): Promise<ProductAnalytics> {
    // id is already encoded from URL if passed from page params, but we might need to double check
    // if useQuery passes it row.
    // Actually the component calling this will pass the ID.
    const res = await fetch(`/api/products/${id}/analytics`);
    if (!res.ok) {
        throw new Error('Failed to fetch analytics');
    }
    return res.json();
}

export function useProductAnalytics(id: string) {
    return useQuery({
        queryKey: ['product-analytics', id],
        queryFn: () => fetchProductAnalytics(id),
        enabled: !!id,
    });
}
