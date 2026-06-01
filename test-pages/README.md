# Test Pages for Information Density Filter

This folder contains 6 HTML test pages to validate the extension's detection accuracy.

---

## 🔴 Should Flag (Low Information Density)

### 1. `ai-generated-productivity.html`
**Topic:** Productivity tips  
**Expected:** Heavy flagging (70-90% of paragraphs)  
**Why:** Classic AI slop with:
- High filler word density ("comprehensive", "leverage", "optimize", "empower")
- Low compression ratio (most text is removable)
- Repetitive sentence structures
- No concrete examples or data

**Key phrases to watch:**
- "In today's fast-paced world"
- "This comprehensive approach"
- "Furthermore, it's important to recognize"
- "By leveraging cutting-edge"

---

### 2. `ai-generated-meditation.html`
**Topic:** Benefits of meditation  
**Expected:** Heavy flagging (70-85% of paragraphs)  
**Why:**
- Extremely low information gain (repeats same concepts)
- High filler density ("transformative", "holistic", "profound")
- Template structure (Introduction → Benefits → Getting Started → Conclusion)
- No specific techniques, studies, or data

**Key phrases to watch:**
- "This transformative practice"
- "Furthermore, it's essential"
- "Moreover, it's important"
- "By embracing this"

---

### 3. `ai-generated-social-media.html`
**Topic:** Social media marketing guide  
**Expected:** Heavy flagging (75-90% of paragraphs)  
**Why:**
- Marketing buzzword overload ("leverage", "robust", "cutting-edge", "comprehensive")
- Zero concrete examples (no specific platforms, metrics, or case studies)
- Extremely low compression ratio
- Generic advice with no actionable steps

**Key phrases to watch:**
- "In today's digital landscape"
- "This innovative strategy"
- "By leveraging the power of"
- "Unlock unprecedented growth"

---

## ✅ Should NOT Flag (High Information Density)

### 4. `quality-blog-post.html`
**Topic:** Why startups fail (analysis of 200 companies)  
**Expected:** Clean (0-10% flagged)  
**Why:**
- High information density (specific data, numbers, examples)
- Concrete examples (TechFlow, DataSync, HealthTrack)
- Real statistics (42%, 29%, 18%, 11%)
- Specific dollar amounts ($3M, $180K/month, $50/month)
- Named people and quotes

**Key data points:**
- 200 startups analyzed
- $500K-$10M funding range
- 42% ran out of money
- TechFlow: 15 engineers, 47 customers, $180K burn
- 300 customer interviews

---

### 5. `quality-technical-guide.html`
**Topic:** Binary search algorithm  
**Expected:** Clean (0-5% flagged)  
**Why:**
- Extremely high information density
- Code examples (concrete, specific)
- Mathematical notation (O(log n), log₂(1,000,000) ≈ 19.93)
- Specific numbers (1,000,000 elements → 20 comparisons)
- Technical terminology (appropriate, not filler)

**Key data points:**
- O(log n) time complexity
- O(1) space complexity
- 1,000,000 elements = 20 comparisons max
- Code examples in Python

---

### 6. `quality-news-article.html`
**Topic:** OpenAI GPT-5 release (fictional)  
**Expected:** Clean (0-10% flagged)  
**Why:**
- High information density (dates, names, numbers)
- Specific facts (94% accuracy, 15 trillion parameters)
- Named sources (Dr. Emily Rodriguez, Senator Maria Gonzalez)
- Concrete details ($0.15 per 1,000 tokens)
- Dates and locations (March 15, 2026, San Francisco)

**Key data points:**
- 94% accuracy (vs 67% for GPT-4)
- 15 trillion parameters
- $800 million training cost
- 89% MMLU benchmark score
- $0.15/$0.60 per 1,000 tokens pricing

---

## How to Test

### Quick Test (5 minutes)
1. Build the extension: `cd extension && npm run build`
2. Load in Chrome: `chrome://extensions/` → Load unpacked → select `extension/dist`
3. Open each test page in Chrome
4. Check the extension icon for flagged count
5. Hover over faded paragraphs to see breakdown

### Detailed Test (20 minutes)
1. Create a spreadsheet with columns:
   - Filename
   - Expected Result
   - Actual Flagged Count
   - False Positives?
   - Notes

2. For each page:
   - Open in Chrome
   - Click extension icon
   - Record flagged count
   - Read flagged paragraphs
   - Verify they should/shouldn't be flagged
   - Note any issues

3. Calculate metrics:
   ```
   False Positive Rate = (Incorrectly Flagged / Total Flagged) × 100%
   Target: < 15%
   ```

---

## Expected Results Summary

| File | Category | Expected Flagged % | Key Metric |
|------|----------|-------------------|------------|
| ai-generated-productivity.html | AI Slop | 70-90% | Low compression ratio |
| ai-generated-meditation.html | AI Slop | 70-85% | Low information gain |
| ai-generated-social-media.html | AI Slop | 75-90% | High filler words |
| quality-blog-post.html | Quality | 0-10% | Concrete examples |
| quality-technical-guide.html | Quality | 0-5% | Code + data |
| quality-news-article.html | Quality | 0-10% | Facts + sources |

---

## What to Look For

### In AI-Generated Pages (Should Flag):
- ✅ Paragraphs starting with "Furthermore", "Moreover", "Additionally"
- ✅ Phrases like "comprehensive approach", "cutting-edge", "leverage"
- ✅ Vague statements with no specifics
- ✅ Repetitive sentence structures
- ✅ No numbers, dates, or concrete examples

### In Quality Pages (Should NOT Flag):
- ✅ Specific numbers and statistics
- ✅ Named people and companies
- ✅ Code examples
- ✅ Dates and locations
- ✅ Concrete examples and case studies
- ✅ Direct quotes

---

## Troubleshooting

### If AI pages aren't flagged enough:
- Check compression ratio threshold (should catch <0.40)
- Verify filler word detection is working
- Check information gain calculation

### If quality pages are flagged:
- Check if technical terms are in filler word list (remove them)
- Verify concrete example detection is working
- Check if contribution capping is active

### If nothing is flagged:
- Open DevTools Console
- Look for errors in content script
- Verify extension is loaded correctly
- Check if threshold is too high (should be 0.55)

---

## Next Steps After Testing

1. **Record results** in a spreadsheet
2. **Identify patterns** - Which metrics cause false positives?
3. **Adjust weights** - Reduce contribution of problematic metrics
4. **Re-test** - Verify improvements
5. **Iterate** - Repeat until FPR < 15%

---

## Opening Test Pages

### Windows:
```bash
cd test-pages
start ai-generated-productivity.html
start quality-blog-post.html
```

### Mac:
```bash
cd test-pages
open ai-generated-productivity.html
open quality-blog-post.html
```

### Linux:
```bash
cd test-pages
xdg-open ai-generated-productivity.html
xdg-open quality-blog-post.html
```

Or simply drag the HTML files into Chrome.

---

## Success Criteria

✅ **AI pages:** 70%+ paragraphs flagged  
✅ **Quality pages:** <15% paragraphs flagged  
✅ **False positive rate:** <15%  
✅ **Tooltips:** Show clear, accurate breakdowns  

If you meet these criteria, the MVP is working! 🎉

---

## Feedback

After testing, note:
- Which pages worked well?
- Which had false positives/negatives?
- What metrics caused issues?
- Any unexpected behavior?

This feedback is critical for tuning the weights and improving accuracy.
