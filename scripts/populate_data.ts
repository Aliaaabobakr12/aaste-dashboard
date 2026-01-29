
import fs from 'fs';
import path from 'path';

// Define types locally since we are running standalone
interface RawReview {
    review_text: string;
    scraped_at: string;
    product_link: string;
    product_name: string;
    star_rating: string;
    review_title: string;
    category: string;
    triplets: string;
}

interface ProcessedReview extends RawReview {
    id: string;
    parsed_triplets: ParsedTriplet[];
    overall_sentiment: 'POS' | 'NEG' | 'NEU' | 'MIXED';
}

interface ParsedTriplet {
    aspect_indices: number[];
    aspect_text: string;
    opinion_indices: number[];
    opinion_text: string;
    sentiment: 'POS' | 'NEG' | 'NEU';
}

const rawData = [
    {
        "review_text": "شرابات عاديه مش احسن حاجه ونسبه القطن مش واضحه عليها وجايين في تغليف باين انه مش احسن حاجه .. علي قد السعر مناسبه",
        "scraped_at": "2025-12-24T15:00:42.453052",
        "product_link": "https://www.amazon.eg/-/en/Pairs-Ankle-Socks-Fashion-Comfort/dp/B0D9R45Y76/ref=sr_1_5?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-5",
        "product_name": "6 Pairs Ankle Socks for Men Fashion Comfortable Foot Light Foot Socks Full Size (41-46)",
        "star_rating": "3.0",
        "review_title": "مش احسن حاجه بس عادية",
        "category": "Fashion",
        "triplets": "[([0], [1, 2, 3, 4], 'NEU'), ([5, 6], [7, 8], 'NEG'), ([12], [15, 16, 17], 'NEG')]"
    },
    {
        "review_text": "خامه الشرابات و التغليف رائعه و السعر ممتاز مقابل الخامه",
        "scraped_at": "2025-12-24T15:00:42.514809",
        "product_link": "https://www.amazon.eg/-/en/Pairs-Ankle-Socks-Fashion-Comfort/dp/B0D9R45Y76/ref=sr_1_5?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-5",
        "product_name": "6 Pairs Ankle Socks for Men Fashion Comfortable Foot Light Foot Socks Full Size (41-46)",
        "star_rating": "5.0",
        "review_title": "خامة جيدة",
        "category": "Fashion",
        "triplets": "[([0, 1], [4], 'POS'), ([3], [4], 'POS'), ([6], [7], 'POS')]"
    },
    {
        "review_text": "الشرابات تقيله تنفع للشتاء",
        "scraped_at": "2025-12-24T15:00:42.713976",
        "product_link": "https://www.amazon.eg/-/en/Pairs-Ankle-Socks-Fashion-Comfort/dp/B0D9R45Y76/ref=sr_1_5?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-5",
        "product_name": "6 Pairs Ankle Socks for Men Fashion Comfortable Foot Light Foot Socks Full Size (41-46)",
        "star_rating": "5.0",
        "review_title": "5",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([0], [2, 3], 'POS')]"
    },
    {
        "review_text": "خامه جيده بس الليكرا خفيفه شويه و المقاس اصغر بشويه",
        "scraped_at": "2025-12-24T15:13:27.927719",
        "product_link": "https://www.amazon.eg/-/en/Trendora-Cotton-Blend-Colours-Regular/dp/B0DY554FTN/ref=sr_1_20?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-20",
        "product_name": "Cotton Blend Ankle Socks for Men, 5 Pairs With 1 Gift, Mixed Colours, Regular Size",
        "star_rating": "4.0",
        "review_title": "تقييم المنتج",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([3], [4], 'NEG'), ([7], [8], 'NEG')]"
    },
    {
        "review_text": "الخامه متوسطه سعر مقابل جوده وطلبت الخمسه بعتولي سبعه ف السعر مقابلهم ممتازين و الباكيدج جميل",
        "scraped_at": "2025-12-24T15:13:27.972286",
        "product_link": "https://www.amazon.eg/-/en/Trendora-Cotton-Blend-Colours-Regular/dp/B0DY554FTN/ref=sr_1_20?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-20",
        "product_name": "Cotton Blend Ankle Socks for Men, 5 Pairs With 1 Gift, Mixed Colours, Regular Size",
        "star_rating": "5.0",
        "review_title": "جميل",
        "category": "Fashion",
        "triplets": "[([0], [1], 'NEU'), ([2], [3, 4], 'POS'), ([10, 11], [12], 'POS'), ([14], [15], 'POS')]"
    },
    {
        "review_text": "شرابات ممتازه جبتها لولادي وبصراحه جميله جدا انصح بيها بشده",
        "scraped_at": "2025-12-24T15:13:28.024545",
        "product_link": "https://www.amazon.eg/-/en/Trendora-Cotton-Blend-Colours-Regular/dp/B0DY554FTN/ref=sr_1_20?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-20",
        "product_name": "Cotton Blend Ankle Socks for Men, 5 Pairs With 1 Gift, Mixed Colours, Regular Size",
        "star_rating": "5.0",
        "review_title": "القاهرة",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([0], [5], 'POS'), ([0], [7, 8], 'POS')]"
    },
    {
        "review_text": "منتج كويس جدا و لكن ليس قطن 100 وصلني 6 شرابات",
        "scraped_at": "2025-12-24T15:13:28.071602",
        "product_link": "https://www.amazon.eg/-/en/Trendora-Cotton-Blend-Colours-Regular/dp/B0DY554FTN/ref=sr_1_20?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-20",
        "product_name": "Cotton Blend Ankle Socks for Men, 5 Pairs With 1 Gift, Mixed Colours, Regular Size",
        "star_rating": "4.0",
        "review_title": "خامة متوسطة ولكنها جيدة",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([0], [5, 6], 'NEG')]"
    },
    {
        "review_text": "بصراحه خامه ممتازه و بتستحمل ونفس اللي في الصوره",
        "scraped_at": "2025-12-24T15:13:28.113606",
        "product_link": "https://www.amazon.eg/-/en/Trendora-Cotton-Blend-Colours-Regular/dp/B0DY554FTN/ref=sr_1_20?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-20",
        "product_name": "Cotton Blend Ankle Socks for Men, 5 Pairs With 1 Gift, Mixed Colours, Regular Size",
        "star_rating": "5.0",
        "review_title": "التجمع الخامس",
        "category": "Fashion",
        "triplets": "[([1], [2], 'POS'), ([1], [4], 'POS'), ([1], [5, 6, 7, 8], 'POS')]"
    },
    {
        "review_text": "شرابات جميله جدا ونفس الوصف وعمليه وشيك جدا",
        "scraped_at": "2025-12-24T15:13:28.155115",
        "product_link": "https://www.amazon.eg/-/en/Trendora-Cotton-Blend-Colours-Regular/dp/B0DY554FTN/ref=sr_1_20?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-20",
        "product_name": "Cotton Blend Ankle Socks for Men, 5 Pairs With 1 Gift, Mixed Colours, Regular Size",
        "star_rating": "5.0",
        "review_title": "مدينة نصر",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([0], [3, 4], 'POS'), ([0], [5], 'POS'), ([0], [6], 'POS')]"
    },
    {
        "review_text": "شراب جميل وخامه مريحه وسعر مناسب",
        "scraped_at": "2025-12-24T15:31:26.498885",
        "product_link": "https://www.amazon.eg/-/en/Cottonil-Cushion-Cotton-Athletic-Comfort/dp/B0FQ466RM2/ref=sr_1_43?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-43",
        "product_name": "Cottonil Pack of 2 Full Towel Cushion Cotton Crew Sport Socks, Plain Color, Athletic Comfort Fit",
        "star_rating": "5.0",
        "review_title": "جميل",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([2], [3], 'POS'), ([4], [5], 'POS')]"
    },
    {
        "review_text": "شراب ممتاز وخامه جيده جدا",
        "scraped_at": "2025-12-24T15:31:26.555886",
        "product_link": "https://www.amazon.eg/-/en/Cottonil-Cushion-Cotton-Athletic-Comfort/dp/B0FQ466RM2/ref=sr_1_43?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-43",
        "product_name": "Cottonil Pack of 2 Full Towel Cushion Cotton Crew Sport Socks, Plain Color, Athletic Comfort Fit",
        "star_rating": "5.0",
        "review_title": "ممتاذ جدا انصح بيه",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([2], [3], 'POS')]"
    },
    {
        "review_text": "المنتج ممتاز و نضيف اوي",
        "scraped_at": "2025-12-24T15:23:51.183334",
        "product_link": "https://www.amazon.eg/-/en/COTTONIL-Socket-multicolor-Color-fitted/dp/B091J6MBZ5/ref=sr_1_33?dib=eyJ2IjoiMSJ9._aFYurwNIEiRYF-1xMy6GDfvTzj_kIBw9Co-Fl9JEz5Lacj8uphUPVEo8L26DgK171Xp5hvAcd0pE8QTHJ1tu2medefg0rdt4W3GhSYJYQvx8GdAK-Bynn8FBPGeXEvZU1F95Q_s-rPJFp-Y67YwV6cFO2v4m-MWWPDO0lVzenY0NAdoOfyRVVTrKUrLuSe6S1BFzCf_EqtqEKyn4xk2Gv3S25J2AldHg15N6hp0ZrxGtT9RL4PRMxkBhf_YHL-h15OupyjFmywyUlO7k_QJZ0gQy6z2qOXFX6yvhf8bDOE._C33iN4GKa4wBq2qWH753rMQ2bXmqk9sRxBGobz5l8E&dib_tag=se&keywords=socks+men&qid=1766572739&sr=8-33",
        "product_name": "Cottonil Set Of 3 Ankle Socks - For Women",
        "star_rating": "5.0",
        "review_title": "ممتازة",
        "category": "Fashion",
        "triplets": "[([0], [1], 'POS'), ([0], [3], 'POS')]"
    }
];

// Helper to parse the weird string format for triplets
// e.g., "[([0], [1], 'POS'), ([0], [3, 4], 'POS')]"
function parseTriplets(tripletStr: string, reviewText: string): ParsedTriplet[] {
    try {
        // This is a rough parser for the Python-style representation in the JSON string
        // We will remove the outer brackets and then look for tuples
        const inner = tripletStr.replace(/^\[|\]$/g, '').trim();
        if (!inner) return [];

        // Split by "), (" to separate triplets
        // We need to handle the first and last parenthesis as well
        const rawTriplets = inner.split(/\),\s*\(/);

        const words = reviewText.split(' ');

        return rawTriplets.map(raw => {
            // Clean up parenthesis
            const cleaned = raw.replace(/^\(/, '').replace(/\)$/, '');

            // Expected format: "[indices], [indices], 'SENTIMENT'"
            // We can try to regex extract these

            const match = cleaned.match(/\[([\d,\s]*)\],\s*\[([\d,\s]*)\],\s*'([A-Z]+)'/);

            if (!match) return null;

            const aspectIndices = match[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const opinionIndices = match[2].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const sentiment = match[3] as 'POS' | 'NEG' | 'NEU';

            const aspectText = aspectIndices.map(i => words[i] || '').join(' ');
            const opinionText = opinionIndices.map(i => words[i] || '').join(' ');

            return {
                aspect_indices: aspectIndices,
                aspect_text: aspectText,
                opinion_indices: opinionIndices,
                opinion_text: opinionText,
                sentiment
            };
        }).filter(t => t !== null) as ParsedTriplet[];
    } catch (e) {
        console.error('Error parsing triplet:', tripletStr, e);
        return [];
    }
}

async function main() {
    const processed: ProcessedReview[] = rawData.map((review, index) => {
        const parsed = parseTriplets(review.triplets, review.review_text);

        // Determine overall sentiment (simple majority or mixed)
        let overall: ProcessedReview['overall_sentiment'] = 'NEU';
        const pos = parsed.filter(t => t.sentiment === 'POS').length;
        const neg = parsed.filter(t => t.sentiment === 'NEG').length;

        if (pos > neg) overall = 'POS';
        else if (neg > pos) overall = 'NEG';
        else if (parsed.length > 0) overall = 'MIXED';

        return {
            ...review,
            id: `review-${index}`, // Simple ID generation
            parsed_triplets: parsed,
            overall_sentiment: overall
        } as ProcessedReview; // Cast as ProcessedReview because rawData is inferred
    });

    const outputPath = path.join(process.cwd(), 'data', 'sample-data.json');
    // Ensure data dir exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(processed, null, 2));
    console.log(`Successfully wrote ${processed.length} reviews to ${outputPath}`);
}

main().catch(console.error);
