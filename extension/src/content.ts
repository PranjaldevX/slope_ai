// content.ts — The Information Density Filter content script
// Scans page paragraphs, analyzes information density, and fades out low-value content.

import { analyzeText, extractConcepts, analyzeReviewText, jaccardSimilarity, type ScoreBreakdown } from './analyzer';

const SLOP_THRESHOLD = 0.55;  // Lowered from 0.60 for better detection
let slopCount = 0;

/**
 * ============================================================================
 * REVIEW DETECTION - Platform & Selector Configuration
 * ============================================================================
 */

type ReviewSite = 'amazon' | 'yelp' | 'google' | 'generic';

const REVIEW_SELECTORS: Record<ReviewSite, string[]> = {
    amazon: [
        '[data-hook="review"]',
        '.review',
        '[data-hook="review-body"]',
        '.review-text',
        '.a-section.review'
    ],
    yelp: [
        '[class*="review"]',
        '[class*="comment"]',
        'p[class*="comment"]',
        '.review-content'
    ],
    google: [
        '.review-full-text',
        '[data-review-id]',
        '.review-snippet',
        '[jsname="bN97Pc"]'
    ],
    generic: [
        '[class*="review"]',
        '[id*="review"]',
        '[data-review]',
        '.customer-review',
        '.user-review',
        '.review-body'
    ]
};

function detectReviewSite(): ReviewSite {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes('amazon')) return 'amazon';
    if (hostname.includes('yelp')) return 'yelp';
    if (hostname.includes('google')) return 'google';
    return 'generic';
}

interface ReviewElement {
    element: HTMLElement;
    text: string;
}

interface ReviewData {
    element: HTMLElement;
    text: string;
    score: number;
    breakdown: ScoreBreakdown[];
}

function getReviewElements(): ReviewElement[] {
    const site = detectReviewSite();
    const selectors = REVIEW_SELECTORS[site];
    const reviews: ReviewElement[] = [];
    const seen = new Set<string>();
    
    for (const selector of selectors) {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = (el as HTMLElement).innerText?.trim();
                if (text && text.length >= 20 && !seen.has(text)) {
                    reviews.push({
                        element: el as HTMLElement,
                        text
                    });
                    seen.add(text);
                }
            });
        } catch (e) {
            // Selector might not be valid, skip it
            console.warn(`[Review Filter] Invalid selector: ${selector}`);
        }
    }
    
    // Limit to first 50 reviews for performance
    return reviews.slice(0, 50);
}

function hasReviewElements(): boolean {
    return getReviewElements().length > 0;
}

/**
 * ============================================================================
 * CONTENT SCANNING (Original functionality)
 * ============================================================================
 */


function scanPage() {
    const paragraphs = Array.from(document.querySelectorAll('p, .review-text, [data-hook="review-body"]')) as HTMLElement[];
    const headings = Array.from(document.querySelectorAll('h1, h2, h3')) as HTMLElement[];

    let previousText = '';
    let previousConcepts = new Set<string>();
    slopCount = 0;
    const flaggedSnippets: { 
        text: string; 
        score: number;
        breakdown: Array<{
            component: string;
            contribution: number;
            percentage: number;
            description: string;
        }>;
    }[] = [];

    for (const p of paragraphs) {
        const text = p.innerText?.trim();
        if (!text || text.length < 60) continue;

        // Find nearest heading above this paragraph
        let nearestHeading = '';
        let minDistance = Infinity;
        const pTop = p.getBoundingClientRect().top;

        for (const h of headings) {
            const hTop = h.getBoundingClientRect().top;
            if (hTop < pTop) {
                const dist = pTop - hTop;
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestHeading = h.innerText || '';
                }
            }
        }

        const result = analyzeText(text, previousText, nearestHeading, previousConcepts);

        // Debug logging
        console.log(`[Debug] Paragraph: "${text.substring(0, 50)}..."`, {
            slopScore: result.slopScore.toFixed(3),
            compressionRatio: result.compressionRatio.toFixed(3),
            informationGain: result.informationGain.toFixed(3),
            fillerRatio: result.fillerRatio.toFixed(3),
            concreteExamples: result.concreteExamples.toFixed(3),
            breakdown: result.breakdown.slice(0, 3),
        });

        if (result.slopScore >= SLOP_THRESHOLD) {
            // Generate detailed tooltip
            const densityPercent = Math.round((1 - result.slopScore) * 100);
            const topIssues = result.breakdown
                .filter(b => b.contribution > 0)
                .slice(0, 3)
                .map(b => `  • ${b.description}`)
                .join('\n');
            
            const tooltipText = `🔍 Information Density: ${densityPercent}%

Top Issues:
${topIssues || '  • Low overall information content'}

Hover to reveal content`;
            
            p.title = tooltipText;
            p.dataset.slopScore = result.slopScore.toFixed(2);
            p.dataset.breakdown = JSON.stringify(result.breakdown);
            p.classList.add('slop-lens-flagged');
            slopCount++;
            
            // Record snippet for the dashboard (truncate if too long)
            flaggedSnippets.push({
                text: text.length > 150 ? text.substring(0, 150) + '...' : text,
                score: result.slopScore,
                breakdown: result.breakdown
            });
        }

        // Update tracking for next iteration
        previousText = text;
        const currentConcepts = extractConcepts(text);
        currentConcepts.forEach(c => previousConcepts.add(c));
    }

    // Persist count and snippets so popup can read it
    chrome.storage.local.set({
        slopCount,
        flaggedSnippets,
        lastScanUrl: window.location.href,
        lastScanTime: Date.now(),
        scanType: 'content'
    });

    console.log(`[Information Density Filter] Scan complete: ${slopCount} low-density paragraphs found.`);
}

/**
 * ============================================================================
 * REVIEW SCANNING (New functionality)
 * ============================================================================
 */

function scanReviews(): void {
    const site = detectReviewSite();
    const reviewElements = getReviewElements();
    
    if (reviewElements.length === 0) {
        console.log('[Review Filter] No reviews detected');
        return;
    }
    
    console.log(`[Review Filter] Found ${reviewElements.length} reviews on ${site}`);
    
    // Calculate average length for length anomaly detection
    const avgLength = reviewElements.reduce((sum, r) => sum + r.text.length, 0) / reviewElements.length;
    
    // Analyze each review
    const reviews: ReviewData[] = [];
    let previousText = '';
    let previousConcepts = new Set<string>();
    
    for (const reviewEl of reviewElements) {
        const result = analyzeReviewText(
            reviewEl.text,
            previousText,
            avgLength,
            previousConcepts
        );
        
        reviews.push({
            element: reviewEl.element,
            text: reviewEl.text,
            score: result.slopScore,
            breakdown: result.breakdown
        });
        
        previousText = reviewEl.text;
        const currentConcepts = extractConcepts(reviewEl.text);
        currentConcepts.forEach(c => previousConcepts.add(c));
    }
    
    // Flag suspicious reviews
    let suspiciousCount = 0;
    const flaggedReviews: any[] = [];
    
    for (const review of reviews) {
        if (review.score >= SLOP_THRESHOLD) {
            flagReview(review);
            suspiciousCount++;
            flaggedReviews.push({
                text: review.text.substring(0, 150) + '...',
                score: review.score,
                breakdown: review.breakdown
            });
        }
    }
    
    // Calculate average similarity
    const avgSimilarity = calculateAvgSimilarity(reviews);
    
    // Detect clusters
    const clusters = analyzeReviewSimilarity(reviews);
    
    // Flag clusters
    flagReviewClusters(clusters, reviews);
    
    // Store results
    chrome.storage.local.set({
        reviewCount: reviews.length,
        suspiciousReviews: suspiciousCount,
        reviewClusters: clusters.length,
        avgSimilarity,
        flaggedReviews: flaggedReviews.slice(0, 10),
        lastScanUrl: window.location.href,
        lastScanTime: Date.now(),
        scanType: 'reviews'
    });
    
    console.log(`[Review Filter] ${suspiciousCount} suspicious reviews, ${clusters.length} clusters`);
}

function flagReview(review: ReviewData): void {
    const el = review.element;
    
    // Add review-specific class
    el.classList.add('slop-lens-flagged', 'review-flagged');
    el.dataset.slopScore = review.score.toFixed(2);
    el.dataset.breakdown = JSON.stringify(review.breakdown);
    
    // Generate tooltip
    const densityPercent = Math.round((1 - review.score) * 100);
    const topIssues = review.breakdown
        .filter(b => b.contribution > 0)
        .slice(0, 3)
        .map(b => `  • ${b.description}`)
        .join('\n');
    
    el.title = `🛒 Review Authenticity: ${densityPercent}%

Top Issues:
${topIssues || '  • Low overall authenticity'}

Hover to reveal review`;
}

function calculateAvgSimilarity(reviews: ReviewData[]): number {
    if (reviews.length < 2) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < reviews.length - 1; i++) {
        for (let j = i + 1; j < reviews.length; j++) {
            totalSimilarity += jaccardSimilarity(reviews[i].text, reviews[j].text);
            comparisons++;
        }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
}

/**
 * ============================================================================
 * REVIEW CLUSTERING - Detect bot farms
 * ============================================================================
 */

interface ReviewCluster {
    baseIndex: number;
    similarIndices: number[];
    avgSimilarity: number;
}

function analyzeReviewSimilarity(reviews: ReviewData[]): ReviewCluster[] {
    const clusters: ReviewCluster[] = [];
    const SIMILARITY_THRESHOLD = 0.7;
    const processed = new Set<number>();
    
    for (let i = 0; i < reviews.length; i++) {
        if (processed.has(i)) continue;
        
        const similar: number[] = [];
        let totalSimilarity = 0;
        
        for (let j = i + 1; j < reviews.length; j++) {
            if (processed.has(j)) continue;
            
            const similarity = jaccardSimilarity(reviews[i].text, reviews[j].text);
            
            if (similarity >= SIMILARITY_THRESHOLD) {
                similar.push(j);
                totalSimilarity += similarity;
                processed.add(j);
            }
        }
        
        // Only create cluster if 2+ similar reviews found
        if (similar.length >= 2) {
            clusters.push({
                baseIndex: i,
                similarIndices: similar,
                avgSimilarity: totalSimilarity / similar.length
            });
            processed.add(i);
        }
    }
    
    return clusters;
}

function flagReviewClusters(clusters: ReviewCluster[], reviews: ReviewData[]): void {
    for (const cluster of clusters) {
        const allIndices = [cluster.baseIndex, ...cluster.similarIndices];
        
        for (const idx of allIndices) {
            const review = reviews[idx];
            review.element.classList.add('suspicious-review-cluster');
            review.element.dataset.clusterSize = String(allIndices.length);
            
            const clusterBadge = document.createElement('span');
            clusterBadge.className = 'cluster-badge';
            clusterBadge.textContent = `⚠️ ${allIndices.length} similar`;
            clusterBadge.title = 'Part of suspicious review cluster';
            review.element.prepend(clusterBadge);
        }
    }
}

/**
 * ============================================================================
 * STYLES & INITIALIZATION
 * ============================================================================
 */

// Inject a stylesheet for hover-to-reveal on flagged paragraphs
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .slop-lens-flagged {
            opacity: 0.15 !important;
            border-left: 3px solid #ef4444 !important;
            padding-left: 8px !important;
            position: relative !important;
            transition: opacity 0.4s ease-in-out, border-left 0.4s ease-in-out !important;
        }
        .slop-lens-flagged:hover {
            opacity: 0.95 !important;
            cursor: pointer;
        }
        .slop-lens-flagged::before {
            content: '🔍 ' attr(data-slop-score);
            position: absolute;
            top: -6px;
            right: 4px;
            background: #ef4444;
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.2s;
            font-family: system-ui, sans-serif;
            pointer-events: none;
        }
        .slop-lens-flagged:hover::before {
            opacity: 1;
        }
        
        /* Review-specific styling (orange theme) */
        .slop-lens-flagged.review-flagged {
            border-left: 3px solid #f59e0b !important;
        }
        .slop-lens-flagged.review-flagged::before {
            content: '🛒 ' attr(data-slop-score);
            background: #f59e0b;
        }
        
        /* Cluster indicator */
        .suspicious-review-cluster {
            border: 2px solid #ef4444 !important;
            background: rgba(239, 68, 68, 0.05) !important;
        }
        
        .cluster-badge {
            display: inline-block;
            background: #ef4444;
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 8px;
            font-family: system-ui, sans-serif;
        }
    `;
    document.head.appendChild(style);
}

// Auto-scan on page load
injectStyles();

// Determine scan type and run appropriate scanner
const site = detectReviewSite();
if (site !== 'generic' || hasReviewElements()) {
    console.log('[Information Density Filter] Review page detected, scanning reviews...');
    scanReviews();
} else {
    console.log('[Information Density Filter] Content page detected, scanning paragraphs...');
    scanPage();
}

// Listen for manual scan trigger from popup
chrome.runtime.onMessage.addListener((request: any, _sender: any, sendResponse: any) => {
    if (request.action === 'scan') {
        // Reset any existing fades first
        document.querySelectorAll('.slop-lens-flagged').forEach((el) => {
            const p = el as HTMLElement;
            p.style.opacity = '';
            p.style.borderLeft = '';
            p.style.paddingLeft = '';
            p.classList.remove('slop-lens-flagged', 'review-flagged', 'suspicious-review-cluster');
            delete p.dataset.slopScore;
        });
        
        // Determine scan type
        const site = detectReviewSite();
        if (site !== 'generic' || hasReviewElements()) {
            scanReviews();
        } else {
            scanPage();
        }
        
        sendResponse({ status: 'done' });
    }
    if (request.action === 'getCount') {
        sendResponse({ slopCount });
    }
    return true;
});

