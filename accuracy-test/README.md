# Accuracy Testing - The Bake-Off Bonus

This directory contains the accuracy testing infrastructure for demonstrating detection performance.

## 🎯 Purpose

Achieve **The Bake-Off** bonus (+5 points) by:
- Running extension against labeled dataset
- Publishing quantitative accuracy metrics
- Providing confusion matrix analysis
- Transparent reporting of false positives/negatives

## 📁 Structure

```
accuracy-test/
├── README.md                    # This file
├── test-runner.ts              # Main test script
├── dataset/
│   ├── example-dataset.json    # Example format (6 samples)
│   └── test-dataset.json       # Your full dataset (create this)
└── ACCURACY_METRICS.md         # Generated report (after running test)
```

## 🚀 Quick Start

### 1. Create Your Dataset

Create `dataset/test-dataset.json` with labeled samples:

```json
[
  {
    "id": "slop-001",
    "text": "Your low-quality content here...",
    "label": "slop",
    "category": "ai-generated",
    "source": "ChatGPT"
  },
  {
    "id": "quality-001",
    "text": "Your high-quality content here...",
    "label": "quality",
    "category": "human-written",
    "source": "Technical blog"
  }
]
```

**Recommended**: 50+ slop samples, 50+ quality samples (100+ total)

### 2. Install Dependencies

```bash
cd accuracy-test
npm install
```

### 3. Run the Test

```bash
npm run test
```

This will:
1. Load your dataset
2. Run the analyzer on each sample
3. Calculate accuracy metrics
4. Generate `ACCURACY_METRICS.md` report

## 📊 Metrics Calculated

- **Accuracy**: Overall correctness (TP + TN) / Total
- **Precision**: Of flagged content, how much was actually slop (TP / (TP + FP))
- **Recall**: Of actual slop, how much did we catch (TP / (TP + FN))
- **F1 Score**: Harmonic mean of precision and recall
- **Confusion Matrix**: TP, TN, FP, FN breakdown
- **By Category**: Performance on AI-generated vs human-written vs mixed

## 🎯 Target Metrics

For hackathon credibility:
- **Accuracy**: ≥80% (excellent), ≥70% (good)
- **Precision**: ≥85% (low false positive rate)
- **Recall**: ≥75% (catches most slop)
- **F1 Score**: ≥80% (balanced performance)

## 📝 Dataset Guidelines

### Slop Samples (label: "slop")

**AI-Generated Content**:
- ChatGPT generic business advice
- AI-written blog posts with buzzwords
- SEO content farms
- Vague productivity tips
- Generic meditation/wellness content

**Fake Reviews**:
- Generic praise ("amazing!", "best ever!")
- No specific details
- Suspiciously similar wording
- Bot-generated feedback

### Quality Samples (label: "quality")

**Human-Written Content**:
- Technical documentation with code examples
- Scientific articles with citations
- Detailed product reviews with specifics
- News articles with facts and sources
- Academic papers with evidence

**Authentic Reviews**:
- Specific product details (color, size, measurements)
- Personal experience ("I used this for 3 months...")
- Comparative statements ("better than my previous...")
- Pros and cons listed

## 🔧 Customization

### Adjust Detection Threshold

Edit `test-runner.ts`:
```typescript
const predictedLabel: 'slop' | 'quality' = 
  result.slopScore >= 0.55 ? 'slop' : 'quality';  // Change 0.55
```

### Add Custom Categories

Add to your dataset:
```json
{
  "category": "mixed",  // or "borderline", "technical", etc.
}
```

The report will show accuracy breakdown by category.

## 📈 Interpreting Results

### High Accuracy (≥80%)
✅ Strong detection performance
✅ Ready for hackathon submission
✅ Bake-Off bonus achieved

### Moderate Accuracy (70-80%)
⚠️ Good but could improve
- Check false positives (quality flagged as slop)
- Check false negatives (slop missed)
- Consider adjusting threshold

### Low Accuracy (<70%)
❌ Needs tuning
- Review false positives - are metrics too strict?
- Review false negatives - are metrics too lenient?
- Consider adjusting metric weights in `analyzer.ts`

## 🐛 Troubleshooting

### "Dataset not found"
- Create `dataset/test-dataset.json`
- Use `example-dataset.json` as template

### "Module not found"
- Run `npm install` in `accuracy-test/` directory
- Ensure `../extension/src/analyzer.ts` exists

### Low Accuracy
- Review false positives/negatives in report
- Check if samples are correctly labeled
- Consider adjusting threshold (0.55 default)

## 📊 Example Output

```
🧪 Starting Accuracy Test...

📂 Loading dataset...
✅ Loaded 100 samples

🔍 Analyzing samples...
  ✅ slop-001: 0.72 (slop)
  ✅ quality-001: 0.23 (quality)
  ...

📊 Calculating metrics...
✅ Metrics calculated

📝 Generating report...
✅ Report saved to: ACCURACY_METRICS.md

═══════════════════════════════════════
📊 ACCURACY TEST SUMMARY
═══════════════════════════════════════
Accuracy:  87.00%
Precision: 89.50%
Recall:    84.00%
F1 Score:  86.67%
═══════════════════════════════════════

🏆 EXCELLENT! Accuracy ≥80% - Strong performance!

🎉 The Bake-Off Bonus: +5 points achieved!
```

## 🏆 Hackathon Submission

Include in your submission:
1. ✅ `ACCURACY_METRICS.md` - Generated report
2. ✅ `dataset/test-dataset.json` - Your labeled dataset
3. ✅ This README explaining methodology
4. ✅ Mention in main README: "Accuracy: 87% (see ACCURACY_METRICS.md)"

## 📚 Resources

- [Confusion Matrix Explained](https://en.wikipedia.org/wiki/Confusion_matrix)
- [Precision vs Recall](https://en.wikipedia.org/wiki/Precision_and_recall)
- [F1 Score](https://en.wikipedia.org/wiki/F-score)

---

**The Bake-Off Bonus**: Run against known dataset, publish accuracy metrics (+5 points)
