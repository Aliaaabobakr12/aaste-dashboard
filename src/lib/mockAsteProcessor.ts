import { RawReview, ProcessedReview, ParsedTriplet } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock aspects and opinions for random generation
const ASPECTS = ['خامة', 'سعر', 'توصيل', 'تغليف', 'جودة', 'لون', 'مقاس', 'طعم', 'ريحة'];
const OPINIONS_POS = ['ممتاز', 'رائع', 'جميل', 'جيد', 'تحفة', 'هايل'];
const OPINIONS_NEG = ['سيء', 'غالي', 'بشع', 'ضعيف', 'متقطع'];
const SENTIMENTS = ['POS', 'NEG', 'NEU'] as const;

export function mockProcessReviews(reviews: RawReview[]): ProcessedReview[] {
    return reviews.map((review) => {
        const isPositiveReview = parseFloat(review.star_rating) >= 4;
        const isNegativeReview = parseFloat(review.star_rating) <= 2;

        // Generate 1-3 random triplets per review
        const numTriplets = Math.floor(Math.random() * 3) + 1;
        const parsedTriplets: ParsedTriplet[] = [];
        const tripletStrings: string[] = [];

        const words = review.review_text.split(/\s+/);

        for (let i = 0; i < numTriplets; i++) {
            // Pick random aspect from predefined list or random word
            const aspect = ASPECTS[Math.floor(Math.random() * ASPECTS.length)];
            // Pick random opinion
            let opinion = '';
            let sentiment: 'POS' | 'NEG' | 'NEU' = 'NEU';

            if (isPositiveReview) {
                opinion = OPINIONS_POS[Math.floor(Math.random() * OPINIONS_POS.length)];
                sentiment = 'POS';
            } else if (isNegativeReview) {
                opinion = OPINIONS_NEG[Math.floor(Math.random() * OPINIONS_NEG.length)];
                sentiment = 'NEG';
            } else {
                opinion = Math.random() > 0.5 ? OPINIONS_POS[0] : OPINIONS_NEG[0];
                sentiment = Math.random() > 0.5 ? 'POS' : 'NEG';
            }

            // In a real scenario, we'd find indices. Here we just mock them to 0 if not found, 
            // strictly for the triplet structure. 
            // However, to make highlighting work in the demo without complex logic, 
            // we might leave indices empty or mock them randomly within range if we want to test highlighting.
            // For simplicity in this MOCK, let's just use the text. The UI might rely on parsing the string 
            // or using the parsed object.

            parsedTriplets.push({
                aspect_indices: [], // Mocking indices is hard without exact matching, leaving empty for now or fill if needed
                aspect_text: aspect,
                opinion_indices: [],
                opinion_text: opinion,
                sentiment: sentiment
            });

            // Mock string format similar to Python output: ([indices], [indices], 'TAG')
            tripletStrings.push(`([?], [?], '${sentiment}')`);
        }

        // Determine overall sentiment based on triplets or rating
        const overallSentiment = parsedTriplets.every(t => t.sentiment === 'POS') ? 'POS'
            : parsedTriplets.every(t => t.sentiment === 'NEG') ? 'NEG'
                : 'MIXED';

        return {
            ...review,
            id: uuidv4(),
            triplets: `[${tripletStrings.join(', ')}]`,
            parsed_triplets: parsedTriplets,
            overall_sentiment: overallSentiment
        };
    });
}
