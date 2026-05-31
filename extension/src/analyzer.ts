/**
 * Information Density Filter — Detection Engine v3 (MVP)
 * Measures information density to identify low-value content.
 * Focus: Compression Ratio, Information Gain, Filler Words
 */

// Stop words for concept extraction
const STOP_WORDS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
]);

/** Tokenize text into lowercase words, stripping punctuation */
export function tokenize(text: string): string[] {
    return text.toLowerCase().match(/[a-z0-9]+/g) || [];
}

/** Split text into sentences */
function splitSentences(text: string): string[] {
    return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
}

/**
 * Metric 1: Jaccard Similarity
 * Measures word overlap between two texts (0.0 to 1.0).
 */
export function jaccardSimilarity(text1: string, text2: string): number {
    const set1 = new Set(tokenize(text1));
    const set2 = new Set(tokenize(text2));
    
    if (set1.size === 0 && set2.size === 0) return 1.0;
    if (set1.size === 0 || set2.size === 0) return 0.0;

    let intersectionCount = 0;
    for (const word of set1) {
        if (set2.has(word)) intersectionCount++;
    }
    
    const unionCount = new Set([...set1, ...set2]).size;
    return intersectionCount / unionCount;
}

/**
 * Metric 2: Shannon Entropy
 * H(X) = -Σ P(x) * log2(P(x))
 * Normalized by log2(uniqueWords) to get a 0-1 scale.
 */
export function shannonEntropy(text: string): number {
    const tokens = tokenize(text);
    if (tokens.length < 2) return 0;

    const freq: Record<string, number> = {};
    for (const t of tokens) {
        freq[t] = (freq[t] || 0) + 1;
    }

    let entropy = 0;
    const total = tokens.length;
    for (const count of Object.values(freq)) {
        const p = count / total;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

/**
 * Metric 3: Filler/Buzzword Ratio
 * Measures density of vague, non-specific words commonly found in AI slop.
 * NOTE: Reduced weight to avoid penalizing academic/scientific writing.
 */
const FILLER_WORDS = new Set([
    // Intensifiers that add nothing
    'very', 'really', 'just', 'quite', 'rather', 'somewhat', 'highly',
    'extremely', 'incredibly', 'absolutely', 'definitely', 'certainly',
    'actually', 'basically', 'literally', 'essentially', 'truly',
    // Transitional filler
    'furthermore', 'moreover', 'however', 'therefore', 'additionally',
    'consequently', 'nevertheless', 'nonetheless', 'accordingly',
    // Corporate/AI buzzwords
    'comprehensive', 'robust', 'leverage', 'utilize', 'facilitate',
    'implement', 'optimize', 'streamline', 'enhance', 'ensure',
    'innovative', 'dynamic', 'empower', 'synergy', 'paradigm',
    'holistic', 'seamless', 'cutting-edge', 'world-class',
    'best-in-class', 'state-of-the-art',
    // ChatGPT-isms
    'delve', 'tapestry', 'bustling', 'underpins', 'multifaceted',
    'nuanced', 'pivotal', 'realm', 'landscape', 'foster',
    'harness', 'navigate', 'underscore', 'unravel', 'testament',
    'beacon', 'commendable', 'meticulous', 'intricate',
    // Vague qualifiers (removed legitimate academic words)
    'various', 'numerous', 'overall', 'overarching', 'aforementioned',
    'amazing', 'wonderful', 'fantastic', 'incredible',
    'remarkable', 'outstanding', 'exceptional', 'excellent',
]);

export function fillerWordRatio(text: string): number {
    const tokens = tokenize(text);
    if (tokens.length === 0) return 0;
    let fillerCount = 0;
    for (const t of tokens) {
        if (FILLER_WORDS.has(t)) fillerCount++;
    }
    return fillerCount / tokens.length;
}

/**
 * Metric 4: Sentence Length Variance
 * AI slop tends to have uniform sentence lengths.
 * Returns coefficient of variation (0 = identical lengths, higher = more varied).
 */
export function sentenceLengthVariance(text: string): number {
    const sentences = splitSentences(text);
    if (sentences.length < 2) return 0;

    const lengths = sentences.map(s => tokenize(s).length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + (len - mean) ** 2, 0) / lengths.length;
    
    return mean > 0 ? Math.sqrt(variance) / mean : 0;
}

/**
 * Metric 5: Specificity Score (Enhanced)
 * Measures the presence of concrete, specific details vs. vague claims.
 * Numbers, proper nouns, quoted text, measurements, technical terms = specific.
 */

// Technical terms and domain-specific vocabulary
const TECHNICAL_INDICATORS = new Set([
    // Programming
    'api', 'tcp', 'http', 'sql', 'json', 'xml', 'css', 'html', 'gpu', 'cpu',
    'algorithm', 'function', 'class', 'method', 'variable', 'array', 'object',
    'database', 'server', 'client', 'protocol', 'encryption', 'authentication',
    // Data structures
    'tree', 'graph', 'heap', 'stack', 'queue', 'hash', 'linked', 'binary',
    // Frameworks/Tools
    'react', 'angular', 'vue', 'node', 'python', 'java', 'rust', 'kubernetes',
    'docker', 'aws', 'azure', 'tensorflow', 'pytorch',
    // Math/Science
    'theorem', 'hypothesis', 'coefficient', 'derivative', 'integral', 'matrix',
    'vector', 'scalar', 'logarithm', 'exponential', 'polynomial',
    // Academic
    'methodology', 'empirical', 'quantitative', 'qualitative', 'correlation',
    'regression', 'variance', 'deviation', 'sample', 'population',
]);

export function specificityScore(text: string): number {
    const words = tokenize(text);
    if (words.length === 0) return 0;

    let specificCount = 0;

    // Count numbers and measurements
    const numberMatches = text.match(/\d+(\.\d+)?(%|px|kg|lb|mm|cm|m|km|gb|mb|tb|mph|fps|ms|hr|min|sec)?/gi);
    specificCount += (numberMatches?.length || 0) * 2;

    // Count proper nouns (capitalized words not at start of sentence)
    const properNouns = text.match(/(?<=[.!?]\s+\w+\s+|,\s+)[A-Z][a-z]+/g);
    specificCount += (properNouns?.length || 0) * 2;

    // Count quoted text
    const quotes = text.match(/["'].+?["']/g);
    specificCount += (quotes?.length || 0) * 3;

    // Count technical terms
    let techTermCount = 0;
    for (const word of words) {
        if (TECHNICAL_INDICATORS.has(word)) {
            techTermCount++;
        }
    }
    specificCount += techTermCount * 2;

    // Count acronyms (2+ uppercase letters)
    const acronyms = text.match(/\b[A-Z]{2,}\b/g);
    specificCount += (acronyms?.length || 0) * 2;

    // Count code-like patterns
    const codePatterns = text.match(/[a-z]+\([^)]*\)|[a-z]+\.[a-z]+|[a-z]+_[a-z]+/g);
    specificCount += (codePatterns?.length || 0) * 2;

    return Math.min(1.0, specificCount / words.length);
}

/**
 * Metric 6: Repetitive Sentence Starters (Enhanced)
 * AI text often starts consecutive sentences with similar patterns.
 * Now categorizes starters instead of just matching first words.
 */

const STARTER_CATEGORIES: Record<string, string[]> = {
    transition: ['furthermore', 'moreover', 'additionally', 'however', 'therefore', 'consequently', 'nevertheless'],
    example: ['for', 'consider', 'suppose', 'imagine', 'example'],
    conclusion: ['thus', 'hence', 'finally', 'ultimately', 'conclusion'],
    explanation: ['this', 'that', 'these', 'those', 'such'],
    emphasis: ['indeed', 'certainly', 'clearly', 'obviously', 'undoubtedly'],
};

export function repetitiveStarters(text: string): number {
    const sentences = splitSentences(text);
    if (sentences.length < 2) return 0;

    const categories: string[] = [];
    
    for (const sentence of sentences) {
        const words = tokenize(sentence);
        if (words.length === 0) continue;
        
        const firstWord = words[0];
        let category = 'other';
        
        // Categorize the starter
        for (const [cat, keywords] of Object.entries(STARTER_CATEGORIES)) {
            if (keywords.includes(firstWord)) {
                category = cat;
                break;
            }
        }
        
        categories.push(category);
    }

    // Count repeated categories
    const freq: Record<string, number> = {};
    for (const cat of categories) {
        freq[cat] = (freq[cat] || 0) + 1;
    }

    const maxRepeat = Math.max(...Object.values(freq));
    return maxRepeat / sentences.length;
}

/**
 * MVP Metric 1: Compression Ratio (STRONGEST SIGNAL)
 * Measures how much information remains after removing filler.
 * Low ratio = high fluff content.
 */
export function compressionRatio(text: string): number {
    const coreInfo = extractCoreInformation(text);
    const originalLength = tokenize(text).length;
    const compressedLength = tokenize(coreInfo).length;
    
    return originalLength > 0 ? compressedLength / originalLength : 0;
}

function extractCoreInformation(text: string): string {
    let core = text;
    
    // Remove common filler phrases
    const fillerPhrases = [
        /it is (?:important|crucial|vital|essential) to (?:note|understand|recognize) that/gi,
        /in (?:today's|the modern|this) (?:world|landscape|environment|era)/gi,
        /as (?:we|you) (?:can see|know|understand)/gi,
        /(?:furthermore|moreover|additionally|in addition),?\s*/gi,
        /this (?:comprehensive|innovative|cutting-edge) (?:solution|approach|method)/gi,
        /helps? (?:to )?(?:ensure|facilitate|enable|empower)/gi,
        /(?:allows?|enables?) (?:you|us|organizations) to/gi,
    ];
    
    fillerPhrases.forEach(pattern => {
        core = core.replace(pattern, ' ');
    });
    
    // Keep only meaningful tokens
    const tokens = tokenize(core);
    const coreTokens = tokens.filter(t => 
        !FILLER_WORDS.has(t) && 
        !STOP_WORDS.has(t) &&
        t.length > 2
    );
    
    return coreTokens.join(' ');
}

/**
 * MVP Metric 2: Information Gain (Simple Version)
 * Measures novelty - how many new concepts are introduced.
 * MVP: Just track concepts, not relationships (relationships in v1.1)
 */
export function extractConcepts(text: string): Set<string> {
    const tokens = tokenize(text);
    return new Set(
        tokens.filter(t => !STOP_WORDS.has(t) && !FILLER_WORDS.has(t) && t.length > 2)
    );
}

export function calculateInformationGain(
    text: string,
    previousConcepts: Set<string>
): number {
    const currentConcepts = extractConcepts(text);
    
    if (currentConcepts.size === 0) return 0;
    
    // Count new concepts
    let newConceptCount = 0;
    for (const concept of currentConcepts) {
        if (!previousConcepts.has(concept)) {
            newConceptCount++;
        }
    }
    
    return newConceptCount / currentConcepts.size;
}

/**
 * MVP Metric 3: Concrete Examples Score
 * Rewards specific, grounded content.
 */
export function concreteExampleScore(text: string): number {
    let score = 0;
    
    // Detect example phrases
    const examplePhrases = [
        /for example/gi,
        /for instance/gi,
        /consider\s+(?:a|the|this)/gi,
        /suppose\s+(?:you|we|that)/gi,
        /let's\s+say/gi,
        /imagine\s+(?:a|that)/gi,
        /in\s+\d{4}/gi, // "in 2024"
    ];
    
    examplePhrases.forEach(pattern => {
        const matches = text.match(pattern);
        score += (matches?.length || 0) * 0.1;
    });
    
    // Detect code blocks
    if (/```[\s\S]*?```|`[^`]+`/.test(text)) {
        score += 0.3;
    }
    
    // Detect citations [1], (Smith 2020)
    const citations = text.match(/\[\d+\]|\([A-Z][a-z]+\s+\d{4}\)/g);
    score += (citations?.length || 0) * 0.15;
    
    return Math.min(1.0, score);
}

/**
 * HACKATHON FEATURE: Claim-to-Evidence Ratio
 * Detects unsupported claims vs. evidence-backed statements.
 * This is the differentiator from simple AI detectors.
 */

const CLAIM_PATTERNS = [
    /(?:can|will|should|must)\s+(?:improve|increase|enhance|boost|reduce|decrease)/gi,
    /(?:is|are)\s+(?:essential|crucial|vital|important|necessary|critical)/gi,
    /(?:helps?|enables?|allows?)\s+(?:you|us|organizations|companies)/gi,
    /(?:significantly|dramatically|substantially)\s+(?:improves?|increases?|reduces?)/gi,
];

const EVIDENCE_PATTERNS = [
    /\d+%/g, // percentages
    /\d+\s+(?:times|fold|percent)/gi, // "3 times faster"
    /(?:study|research|experiment|survey|analysis)\s+(?:shows?|found|revealed|demonstrated)/gi,
    /according\s+to/gi,
    /\([A-Z][a-z]+\s+\d{4}\)/g, // citations
    /\[\d+\]/g, // reference numbers
];

export function claimToEvidenceRatio(text: string): number {
    let claimCount = 0;
    let evidenceCount = 0;
    
    // Count claims
    CLAIM_PATTERNS.forEach(pattern => {
        const matches = text.match(pattern);
        claimCount += matches?.length || 0;
    });
    
    // Count evidence
    EVIDENCE_PATTERNS.forEach(pattern => {
        const matches = text.match(pattern);
        evidenceCount += matches?.length || 0;
    });
    
    if (claimCount === 0) return 0; // No claims = no problem
    
    // High ratio = many claims, little evidence = bad
    // Low ratio = claims backed by evidence = good
    const ratio = claimCount / (evidenceCount + 1); // +1 to avoid division by zero
    
    return Math.min(1.0, ratio / 3); // Normalize to 0-1
}


/**
 * Score Breakdown for Explainability
 */
export interface ScoreBreakdown {
    component: string;
    contribution: number;
    percentage: number;
    description: string;
}

/**
 * Main Analysis Function
 * Combines all metrics into a single information density score (0.0 to 1.0).
 */
export interface AnalysisResult {
    slopScore: number;
    compressionRatio: number;
    informationGain: number;
    concreteExamples: number;
    claimToEvidence: number;
    jaccardPrevious: number;
    jaccardHeading: number;
    entropy: number;
    fillerRatio: number;
    sentenceVariance: number;
    specificity: number;
    repetitiveStarters: number;
    verdict: 'clean' | 'suspicious' | 'slop';
    breakdown: ScoreBreakdown[];
}

export function analyzeText(
    text: string,
    previousText: string,
    headingText: string,
    previousConcepts: Set<string> = new Set()
): AnalysisResult {
    // Calculate all metrics
    const compression = compressionRatio(text);
    const infoGain = calculateInformationGain(text, previousConcepts);
    const concreteEx = concreteExampleScore(text);
    const claimEvidence = claimToEvidenceRatio(text);
    const overlapPrev = jaccardSimilarity(text, previousText);
    const overlapHeading = jaccardSimilarity(text, headingText);
    const entropy = shannonEntropy(text);
    const filler = fillerWordRatio(text);
    const sentenceVar = sentenceLengthVariance(text);
    const specificity = specificityScore(text);
    const repStarters = repetitiveStarters(text);

    // === HACKATHON-TUNED Weighted Scoring ===
    const contributions: ScoreBreakdown[] = [];
    const MAX_CONTRIBUTION = 0.40;
    
    // --- Compression Ratio (STRONGEST SIGNAL) ---
    if (compression < 0.35) {
        contributions.push({
            component: 'Very low information density',
            contribution: 0.40,
            percentage: Math.round((1 - compression) * 100),
            description: `${Math.round((1 - compression) * 100)}% of text is removable filler`,
        });
    } else if (compression < 0.50) {
        contributions.push({
            component: 'Low information density',
            contribution: 0.30,
            percentage: Math.round((1 - compression) * 100),
            description: `${Math.round((1 - compression) * 100)}% of text is removable filler`,
        });
    } else if (compression < 0.65) {
        contributions.push({
            component: 'Moderate information density',
            contribution: 0.20,
            percentage: Math.round((1 - compression) * 100),
            description: `${Math.round((1 - compression) * 100)}% of text is removable filler`,
        });
    }
    
    // --- HACKATHON FEATURE: Claim-to-Evidence Ratio ---
    if (claimEvidence > 0.5) {
        contributions.push({
            component: 'Unsupported claims',
            contribution: 0.35,
            percentage: Math.round(claimEvidence * 100),
            description: 'Makes claims without evidence or citations',
        });
    } else if (claimEvidence > 0.3) {
        contributions.push({
            component: 'Weak evidence',
            contribution: 0.20,
            percentage: Math.round(claimEvidence * 100),
            description: 'Some claims lack supporting evidence',
        });
    }
    
    // --- Information Gain ---
    if (infoGain < 0.20) {
        contributions.push({
            component: 'Highly repetitive content',
            contribution: 0.30,
            percentage: Math.round((1 - infoGain) * 100),
            description: `${Math.round((1 - infoGain) * 100)}% of concepts already mentioned`,
        });
    } else if (infoGain < 0.40) {
        contributions.push({
            component: 'Some repetition',
            contribution: 0.20,
            percentage: Math.round((1 - infoGain) * 100),
            description: `${Math.round((1 - infoGain) * 100)}% of concepts already mentioned`,
        });
    }
    
    // --- Filler Words (REDUCED WEIGHT) ---
    if (filler >= 0.10) {
        contributions.push({
            component: 'High filler word density',
            contribution: 0.20,  // Reduced from 0.35
            percentage: Math.round(filler * 100),
            description: `${Math.round(filler * 100)}% filler words (e.g., "leverage", "comprehensive")`,
        });
    } else if (filler >= 0.05) {
        contributions.push({
            component: 'Moderate filler words',
            contribution: 0.15,  // Reduced from 0.25
            percentage: Math.round(filler * 100),
            description: `${Math.round(filler * 100)}% filler words`,
        });
    }
    
    // --- Concrete Examples (REWARD) ---
    if (concreteEx > 0.5) {
        contributions.push({
            component: 'Rich in examples',
            contribution: -0.30,
            percentage: Math.round(concreteEx * 100),
            description: 'Contains many specific examples and citations',
        });
    } else if (concreteEx > 0.3) {
        contributions.push({
            component: 'Has concrete examples',
            contribution: -0.20,
            percentage: Math.round(concreteEx * 100),
            description: 'Contains specific examples, citations, or code',
        });
    }
    
    // --- High Specificity (REWARD) ---
    if (specificity > 0.15) {
        contributions.push({
            component: 'High technical specificity',
            contribution: -0.15,
            percentage: Math.round(specificity * 100),
            description: 'Contains technical terms, numbers, or domain vocabulary',
        });
    }
    
    // --- High overlap with previous paragraph ---
    if (overlapPrev > 0.5) {
        contributions.push({
            component: 'Repeats previous paragraph',
            contribution: 0.20,
            percentage: Math.round(overlapPrev * 100),
            description: `${Math.round(overlapPrev * 100)}% word overlap with previous text`,
        });
    } else if (overlapPrev > 0.3) {
        contributions.push({
            component: 'Some overlap with previous',
            contribution: 0.10,
            percentage: Math.round(overlapPrev * 100),
            description: `${Math.round(overlapPrev * 100)}% word overlap with previous text`,
        });
    }
    
    // --- High overlap with heading ---
    if (overlapHeading > 0.3) {
        contributions.push({
            component: 'Just restates heading',
            contribution: 0.15,
            percentage: Math.round(overlapHeading * 100),
            description: `${Math.round(overlapHeading * 100)}% overlap with heading`,
        });
    }
    
    // --- Repetitive sentence starters ---
    if (repStarters > 0.5) {
        contributions.push({
            component: 'Repetitive sentence structure',
            contribution: 0.15,
            percentage: Math.round(repStarters * 100),
            description: `${Math.round(repStarters * 100)}% of sentences start with same category`,
        });
    }
    
    // Apply contribution capping and calculate final score
    let score = 0;
    contributions.forEach(c => {
        const cappedContribution = Math.min(Math.abs(c.contribution), MAX_CONTRIBUTION) * Math.sign(c.contribution);
        score += cappedContribution;
    });
    
    // Multi-metric penalty reduction (protect good writers)
    const negativeContributions = contributions.filter(c => c.contribution > 0);
    if (negativeContributions.length >= 3) {
        score *= 0.85; // 15% reduction if 3+ metrics fire
    }
    
    score = Math.min(1.0, Math.max(0.0, score));
    
    // Sort breakdown by absolute contribution
    const sortedBreakdown = contributions.sort((a, b) => 
        Math.abs(b.contribution) - Math.abs(a.contribution)
    );

    // HACKATHON-TUNED THRESHOLDS
    let verdict: 'clean' | 'suspicious' | 'slop' = 'clean';
    if (score >= 0.55) verdict = 'slop';  // Balanced threshold
    else if (score >= 0.35) verdict = 'suspicious';

    return {
        slopScore: score,
        compressionRatio: compression,
        informationGain: infoGain,
        concreteExamples: concreteEx,
        claimToEvidence: claimEvidence,
        jaccardPrevious: overlapPrev,
        jaccardHeading: overlapHeading,
        entropy,
        fillerRatio: filler,
        sentenceVariance: sentenceVar,
        specificity,
        repetitiveStarters: repStarters,
        verdict,
        breakdown: sortedBreakdown,
    };
}
