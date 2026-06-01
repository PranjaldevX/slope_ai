# Accuracy Test Results - The Bake-Off

**Test Date**: 2026-06-01
**Total Samples**: 20
**Detection Threshold**: 0.55

---

## 📊 Overall Metrics

| Metric       | Value  | Description |
|--------------|-------|-------------|
| **Accuracy** | **65.00%** | Overall correctness |
| **Precision** | **100.00%** | Of flagged content, how much was actually slop |
| **Recall** | **30.00%** | Of actual slop, how much did we catch |
| **F1 Score** | **46.15%** | Harmonic mean of precision and recall |

---

## 🎯 Confusion Matrix

|                    | **Actual: Slop** | **Actual: Quality** |
|--------------------|------------------|---------------------|
| **Predicted: Slop** | 3 (TP) | 0 (FP) |
| **Predicted: Quality** | 7 (FN) | 10 (TN) |

- **True Positives (TP)**: 3 - Correctly identified slop
- **True Negatives (TN)**: 10 - Correctly identified quality
- **False Positives (FP)**: 0 - Quality content flagged as slop
- **False Negatives (FN)**: 7 - Slop content missed

---

## 📈 Performance by Category

- **ai-generated**: 30.00% accuracy (10 samples)
- **human-written**: 100.00% accuracy (10 samples)

---

## ❌ False Positives (Quality flagged as Slop)

*None - Perfect precision!*

---

## ⚠️ False Negatives (Slop missed)

### slop-003 (Score: 0.35)
- **Category**: ai-generated
- **Source**: Fake review
- **Text**: "Amazing product! Highly recommend! Best purchase ever! Exceeded all my expectations! Five stars! Eve..."

### slop-004 (Score: 0.47)
- **Category**: ai-generated
- **Source**: Corporate buzzwords
- **Text**: "It is important to note that effective communication plays a vital role in organizational success. B..."

### slop-005 (Score: 0.50)
- **Category**: ai-generated
- **Source**: Generic wellness
- **Text**: "Meditation is a powerful tool for personal growth. It helps you find inner peace and balance. By pra..."

### slop-006 (Score: 0.50)
- **Category**: ai-generated
- **Source**: SEO content farm
- **Text**: "Social media marketing is essential for modern businesses. It allows you to reach your target audien..."

### slop-007 (Score: 0.47)
- **Category**: ai-generated
- **Source**: Bot review
- **Text**: "This product is absolutely fantastic! I love it so much! Best thing I ever bought! Highly recommend ..."

### slop-009 (Score: 0.35)
- **Category**: ai-generated
- **Source**: Generic advice
- **Text**: "Productivity is key to success. By implementing effective strategies and maintaining focus, you can ..."

### slop-010 (Score: 0.35)
- **Category**: ai-generated
- **Source**: Generic review
- **Text**: "Great product! Works as described! Very happy with purchase! Would buy again! Excellent quality! Fas..."


---

## 🎯 Score Distribution

### Slop Samples (should be ≥0.55)
- slop-001: 0.64 ✅
- slop-002: 0.55 ✅
- slop-003: 0.35 ❌
- slop-004: 0.47 ❌
- slop-005: 0.50 ❌
- slop-006: 0.50 ❌
- slop-007: 0.47 ❌
- slop-008: 0.64 ✅
- slop-009: 0.35 ❌
- slop-010: 0.35 ❌

### Quality Samples (should be <0.55)
- quality-001: 0.00 ✅
- quality-002: 0.35 ✅
- quality-003: 0.00 ✅
- quality-004: 0.00 ✅
- quality-005: 0.20 ✅
- quality-006: 0.20 ✅
- quality-007: 0.15 ✅
- quality-008: 0.15 ✅
- quality-009: 0.20 ✅
- quality-010: 0.20 ✅

---

## 💡 Insights

### Strengths
- ✅ High precision - low false positive rate



### Areas for Improvement

- ⚠️ 7 false negatives - some slop is getting through
- ⚠️ Accuracy below 80% - consider tuning metrics

---

## 🏆 Hackathon Bonus Achievement

This test demonstrates:
- ✅ Quantitative accuracy metrics
- ✅ Confusion matrix analysis
- ✅ Performance breakdown by category
- ✅ Transparent reporting of false positives/negatives

**The Bake-Off Bonus**: +5 points 🎉
