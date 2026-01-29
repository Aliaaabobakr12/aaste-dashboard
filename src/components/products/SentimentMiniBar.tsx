import { SentimentSummary } from '@/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Need to add tooltip if not present

interface SentimentMiniBarProps {
    summary: SentimentSummary;
    className?: string;
}

export function SentimentMiniBar({ summary, className }: SentimentMiniBarProps) {
    const { positive, negative, neutral, total } = summary;

    if (total === 0) return <div className="h-2 w-full bg-gray-100 rounded-full" />;

    const posPct = (positive / total) * 100;
    const negPct = (negative / total) * 100;
    const neuPct = (neutral / total) * 100;

    return (
        <div className={cn("flex h-2.5 w-full rounded-full overflow-hidden bg-gray-100", className)}>
            < div style={{ width: `${posPct}%` }} className="bg-emerald-500" title={`Pos: ${positive}`} />
            <div style={{ width: `${neuPct}%` }} className="bg-amber-400" title={`Neu: ${neutral}`} />
            <div style={{ width: `${negPct}%` }} className="bg-red-500" title={`Neg: ${negative}`} />
        </div>
    );
}
