
import { ParsedTriplet } from '@/types';

/**
 * Parses Python string representation of triplets into structured objects.
 * Input format example: "[([1], [0], 'POS'), ([3, 4], [2], 'NEG')]"
 */
export function parsePythonTriplets(tripletsStr: string, text: string): ParsedTriplet[] {
    try {
        // 1. Convert Python tuple/list string to JSON-compatible string
        // Replace ( -> [
        // Replace ) -> ]
        // Replace ' -> "
        // Replace None -> null (just in case)
        const jsonStr = tripletsStr
            .replace(/\(/g, '[')
            .replace(/\)/g, ']')
            .replace(/'/g, '"')
            .replace(/None/g, 'null');

        // 2. Parse as JSON
        // Expected structure: Array of [aspectIndices, opinionIndices, sentiment]
        const rawTriplets = JSON.parse(jsonStr);

        if (!Array.isArray(rawTriplets)) {
            console.warn('Parsed triplets is not an array:', rawTriplets);
            return [];
        }

        const words = text.split(/\s+/); // Split by whitespace to reconstruct text

        return rawTriplets.map((t: any) => {
            const aspectIndices = t[0] || [];
            const opinionIndices = t[1] || [];
            const sentiment = t[2] || 'NEU';

            // Reconstruct text from indices
            // Note: Python indices are likely word-based indices from the split text
            const aspectText = aspectIndices.map((i: number) => words[i]).join(' ');
            const opinionText = opinionIndices.map((i: number) => words[i]).join(' ');

            return {
                aspect_indices: aspectIndices,
                aspect_text: aspectText,
                opinion_indices: opinionIndices,
                opinion_text: opinionText,
                sentiment: sentiment as 'POS' | 'NEG' | 'NEU'
            };
        });

    } catch (error) {
        console.error('Failed to parse triplets string:', error, tripletsStr);
        return [];
    }
}
