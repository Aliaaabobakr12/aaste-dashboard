export interface RawReview {
  review_text: string;
  scraped_at: string;
  product_link: string;
  product_name: string;
  star_rating: string;
  review_title: string;
  category: string;
}

export interface ProcessedReview extends RawReview {
  id: string;
  triplets: string; // Raw triplet string from model
  parsed_triplets: ParsedTriplet[];
  overall_sentiment: 'POS' | 'NEG' | 'NEU' | 'MIXED';
}

export interface ParsedTriplet {
  aspect_indices: number[];
  aspect_text: string;
  opinion_indices: number[];
  opinion_text: string;
  sentiment: 'POS' | 'NEG' | 'NEU';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  link: string;
  review_count: number;
  avg_rating: number;
  sentiment_summary: SentimentSummary;
}

export interface SentimentSummary {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface ProductAnalytics {
  product_id: string;
  product_name: string;
  total_reviews: number;
  avg_rating: number;
  sentiment_distribution: SentimentSummary;
  aspect_frequency: AspectFrequency[];
  aspect_sentiment: AspectSentiment[];
  rating_distribution: RatingDistribution[];
  timeline: TimelinePoint[];
}

export interface AspectFrequency {
  aspect: string;
  count: number;
}

export interface AspectSentiment {
  aspect: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface TimelinePoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface UploadJob {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total_reviews: number;
  processed_reviews: number;
  created_at: string;
  completed_at?: string;
  error?: string;
}

export interface FileMetadata {
  name: string;
  date: string;
  size: number;
  rowCount: number;
}
