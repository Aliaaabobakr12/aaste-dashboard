import { useQuery } from '@tanstack/react-query';
import { ProcessedReview } from '@/types';

async function fetchProductReviews(id: string): Promise<ProcessedReview[]> {
    const res = await fetch(`/api/products/${id}/reviews`);
    if (!res.ok) {
        throw new Error('Failed to fetch reviews');
    }
    return res.json();
}

export function useReviews(id: string) {
    return useQuery({
        queryKey: ['product-reviews', id],
        queryFn: () => fetchProductReviews(id),
        enabled: !!id,
    });
}
