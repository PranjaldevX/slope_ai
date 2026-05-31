# 🔍 Information Density Filter

A browser extension that detects and fades out low-information-density content on web pages. Built for the Slop Scan Hackathon 2026.

## 🎯 What It Does

Instead of trying to detect "AI-generated" content, this extension measures **information density** using linguistic analysis. Low-density paragraphs are automatically faded out, with hover-to-reveal functionality.

### Key Features

- **7 Linguistic Metrics**: Compression ratio, information gain, filler words, concrete examples, specificity, claim-to-evidence ratio, and more
- **Smart Detection**: Flags content with low information value, regardless of whether it's AI or human-written
- **Visual Feedback**: Faded paragraphs with red border indicators
- **Detailed Breakdown**: Click any score to see exactly which metrics triggered the flag
- **Hover to Reveal**: Faded content becomes visible on hover
- **Dashboard**: Popup shows statistics and flagged content analysis

## 🚀 Quick Start

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/information-density-filter.git
cd information-density-filter
```

2. Install dependencies:
```bash
cd extension
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/dist` folder

### Testing

Open any of the test pages in `test-pages/` directory:
- `ai-generated-productivity.html` - Should flag heavily
- `ai-generated-meditation.html` - Should flag heavily
- `ai-generated-social-media.html` - Should flag heavily
- `quality-blog-post.html` - Should NOT flag
- `quality-technical-guide.html` - Should NOT flag
- `quality-news-article.html` - Should NOT flag

## 📊 How It Works

### Detection Metrics

1. **Compression Ratio** (Strongest Signal)
   - Measures how much text remains after removing filler
   - Low ratio = high fluff content

2. **Information Gain**
   - Tracks concept novelty across paragraphs
   - Detects repetitive content with different wording

3. **Claim-to-Evidence Ratio** (Killer Feature)
   - Detects unsupported claims vs. evidence-backed statements
   - Looks for citations, data, examples backing up claims

4. **Filler Word Density**
   - Identifies buzzwords and vague language
   - Examples: "leverage", "robust", "comprehensive", "delve"

5. **Concrete Examples Score**
   - Rewards specific, grounded content
   - Detects code blocks, citations, measurements, examples

6. **Specificity Score**
   - Measures presence of technical terms, numbers, proper nouns
   - Rewards domain-specific vocabulary

7. **Repetitive Sentence Starters**
   - Detects repeated sentence patterns
   - Categories: transitions, examples, conclusions, explanations

### Scoring System

- **Score Range**: 0.0 (high density) to 1.0 (low density)
- **Threshold**: ≥0.55 = flagged as low-density
- **Contribution Capping**: Max 40% per metric to prevent false positives
- **Multi-metric Penalty Reduction**: 15% reduction if 3+ metrics fire

## 🎨 UI Features

### Content Script
- Fades low-density paragraphs to 15% opacity
- Red left border indicator
- Score badge appears on hover
- Detailed tooltip with top issues

### Popup Dashboard
- Total count of flagged paragraphs
- Average slop score
- Top issues detected across the page
- Visual bar charts showing issue frequency
- Clickable score breakdown for each flagged paragraph

## 📁 Project Structure

```
information-density-filter/
├── engine/                      # Original C++ WASM engine (not used in MVP)
│   ├── slop_analyzer.cpp
│   ├── slop_analyzer.js
│   └── slop_analyzer.wasm
├── extension/                   # Main extension code
│   ├── src/
│   │   ├── analyzer.ts         # Core detection engine
│   │   ├── content.ts          # Content script (page scanning)
│   │   ├── background.ts       # Background service worker
│   │   ├── App.tsx             # Popup dashboard UI
│   │   ├── App.css             # Popup styles
│   │   └── main.tsx            # Popup entry point
│   ├── public/
│   │   └── engine/             # WASM files (for future use)
│   ├── package.json
│   ├── vite.config.ts
│   └── manifest.json           # Extension manifest
├── test-pages/                  # Test HTML files
│   ├── ai-generated-*.html     # Should flag
│   └── quality-*.html          # Should NOT flag
├── HACKATHON_READY.md          # Feature documentation
├── QUICK_START.md              # Setup guide
└── README.md                   # This file
```

## 🛠️ Development

### Build Commands

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Tech Stack

- **TypeScript** - Type-safe code
- **React** - Popup UI
- **Vite** - Build tool
- **Chrome Extension Manifest V3** - Latest extension API
- **CSS3** - Styling with animations

## 🎯 Why This Approach Works

Unlike AI detectors that look for perplexity or try to guess if content is AI-generated, this extension:

1. **Measures actual information value** - Works on both AI and human content
2. **Focuses on substance** - Detects claims without evidence
3. **Rewards quality** - Technical terms and examples reduce score
4. **Transparent** - Shows exactly why content was flagged
5. **Defensible** - Based on linguistic analysis, not guessing

## 📈 Future Enhancements

- [ ] Relationship-based information gain (track concept connections)
- [ ] Customizable thresholds per website
- [ ] Whitelist/blacklist functionality
- [ ] Export analysis reports
- [ ] Browser compatibility (Firefox, Edge)
- [ ] Machine learning integration for improved accuracy

## 🏆 Hackathon Features

### What Makes This Special

1. **Claim-to-Evidence Ratio** - Novel metric that judges will appreciate
2. **Explainability** - Detailed breakdowns build trust
3. **No False Positives on Technical Content** - Rewards specificity
4. **Visual Polish** - Smooth animations and professional UI
5. **Comprehensive Testing** - 6 test pages covering different content types

## 📝 License

MIT License - See LICENSE file for details

## 👥 Authors

Track E + G - Slop Scan Hackathon 2026

## 🙏 Acknowledgments

Built for the Slop Scan Hackathon 2026 to combat low-information-density content on the web.

---

**Note**: This is an MVP implementation focusing on core functionality. The C++ WASM engine exists but is not currently used - the TypeScript implementation in `analyzer.ts` is the active detection engine.
