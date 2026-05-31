// content.ts — The Information Density Filter content script
// Scans page paragraphs, analyzes information density, and fades out low-value content.

import { analyzeText, extractConcepts } from './analyzer';

const SLOP_THRESHOLD = 0.55;  // Lowered from 0.60 for better detection
let slopCount = 0;

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
    });

    console.log(`[Information Density Filter] Scan complete: ${slopCount} low-density paragraphs found.`);
}

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
    `;
    document.head.appendChild(style);
}

// Auto-scan on page load
injectStyles();
scanPage();

// Listen for manual scan trigger from popup
chrome.runtime.onMessage.addListener((request: any, _sender: any, sendResponse: any) => {
    if (request.action === 'scan') {
        // Reset any existing fades first
        document.querySelectorAll('.slop-lens-flagged').forEach((el) => {
            const p = el as HTMLElement;
            p.style.opacity = '';
            p.style.borderLeft = '';
            p.style.paddingLeft = '';
            p.classList.remove('slop-lens-flagged');
            delete p.dataset.slopScore;
        });
        scanPage();
        sendResponse({ status: 'done', slopCount });
    }
    if (request.action === 'getCount') {
        sendResponse({ slopCount });
    }
    return true;
});
