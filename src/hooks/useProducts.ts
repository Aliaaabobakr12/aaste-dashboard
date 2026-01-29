import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';

async function fetchProducts(): Promise<Product[]> {
    const res = await fetch('/api/products');
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
}

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });
}
