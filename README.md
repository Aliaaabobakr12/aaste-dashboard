# ASTE Dashboard

The **ASTE Dashboard** represents a cutting-edge interface for **Aspect-Sentiment-Triplet Extraction (ASTE)** tailored for Arabic product reviews. This application enables stakeholders to visualize nuanced customer feedback by extracting aspect-opinion-sentiment triplets from raw text.

## Features

- **Upload & Analyze**: Drag-and-drop JSON files containing product reviews for instant analysis.
- **Arabic NLP Support**: Specialized RTL layout and font support (Cairo) for Arabic content navigation.
- **Deep Insights**:
  - **Triplets**: View extracted Aspect-Opinion-Sentiment triplets (e.g., "Quality" - "Excellent" - "Positive").
  - **Visualizations**: Interactive charts for aspect frequency, sentiment distribution, and sentiment trends.
- **File Management**: Manage processed files and historical data directly from the dashboard.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the dashboard**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and storage logic.
- `scripts`: Helper scripts for data processing and testing.

---
Built for the ASTE Arabic NLP initiative.
