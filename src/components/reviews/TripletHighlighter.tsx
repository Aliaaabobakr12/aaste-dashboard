import { ParsedTriplet } from '@/types';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TripletHighlighterProps {
    text: string;
    triplets: ParsedTriplet[];
}

export function TripletHighlighter({ text, triplets }: TripletHighlighterProps) {
    // Tokenize by space to match our simple mock tokenizer
    const words = text.split(/\s+/);

    // Create a map of index -> styles
    const wordStyles = new Map<number, {
        type: 'aspect' | 'opinion',
        sentiment?: 'POS' | 'NEG' | 'NEU',
        triplet: ParsedTriplet
    }>();

    triplets.forEach(triplet => {
        triplet.aspect_indices.forEach(idx => {
            wordStyles.set(idx, { type: 'aspect', triplet });
        });
        triplet.opinion_indices.forEach(idx => {
            wordStyles.set(idx, { type: 'opinion', sentiment: triplet.sentiment, triplet });
        });
    });

    return (
        <div className="text-right leading-loose" dir="rtl">
            {words.map((word, idx) => {
                const style = wordStyles.get(idx);

                if (!style) {
                    return <span key={idx}>{word} </span>;
                }

                // Determine styling
                let className = "";
                let tooltipText = "";

                if (style.type === 'aspect') {
                    className = "font-bold border-b-2 border-primary mx-0.5 px-0.5 rounded-sm bg-primary/10"; // Underline aspect
                    tooltipText = `Aspect: ${style.triplet.aspect_text}`;
                } else if (style.type === 'opinion') {
                    const sentimentColor =
                        style.sentiment === 'POS' ? 'text-green-600 bg-green-100' :
                            style.sentiment === 'NEG' ? 'text-red-600 bg-red-100' :
                                'text-yellow-600 bg-yellow-100';

                    className = cn("font-semibold mx-0.5 px-0.5 rounded-sm", sentimentColor);
                    tooltipText = `Opinion: ${style.triplet.opinion_text} (${style.sentiment})`;
                }

                return (
                    <TooltipProvider key={idx}>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <span className={cn("cursor-help inline-block", className)}>
                                    {word}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltipText}</p>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {style.triplet.aspect_text} ↔ {style.triplet.opinion_text}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            })}
        </div>
    );
}
