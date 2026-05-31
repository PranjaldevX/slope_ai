import createSlopAnalyzer from './engine/slop_analyzer.js';

let analyzeText: ((t: string, p: string, h: string) => string) | null = null;

async function initEngine() {
    try {
        const engine = await createSlopAnalyzer();
        analyzeText = engine.analyzeText;
        console.log('[Slop Lens] WASM engine ready in background worker');
    } catch (e) {
        console.error('[Slop Lens] Failed to load WASM engine', e);
    }
}

initEngine();

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === 'ANALYZE') {
        if (!analyzeText) {
            sendResponse({ slopScore: 0, error: 'Engine not ready' });
            return true;
        }
        try {
            const result = analyzeText(request.text, request.prevText, request.heading);
            sendResponse(JSON.parse(result));
        } catch (e) {
            sendResponse({ slopScore: 0, error: String(e) });
        }
        return true; // keep message channel open for async
    }

    if (request.type === 'SLOP_FOUND') {
        // Forward to popup if open
        chrome.runtime.sendMessage(request).catch(() => {});
        return false;
    }
});
