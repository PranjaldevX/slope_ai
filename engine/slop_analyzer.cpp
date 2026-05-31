#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <string>
#include <vector>
#include <map>
#include <cmath>
#include <algorithm>
#include <sstream>
#include <cctype>
#include <iostream>

using namespace emscripten;
using namespace std;

// Helper: Convert string to lowercase
string toLower(const string& str) {
    string lowerStr = str;
    transform(lowerStr.begin(), lowerStr.end(), lowerStr.begin(),
              [](unsigned char c){ return std::tolower(c); });
    return lowerStr;
}

// Helper: Tokenize a string into words (punctuation stripped)
vector<string> tokenize(const string& text) {
    vector<string> words;
    string currentWord;
    
    for (char c : text) {
        if (std::isalnum(c)) {
            currentWord += std::tolower(c);
        } else if (!currentWord.empty()) {
            words.push_back(currentWord);
            currentWord.clear();
        }
    }
    if (!currentWord.empty()) {
        words.push_back(currentWord);
    }
    return words;
}

// Metric 1: Jaccard Similarity (Semantic Overlap)
// Returns overlap ratio between two strings (0.0 to 1.0)
float calculateJaccardSimilarity(const string& text1, const string& text2) {
    vector<string> tokens1 = tokenize(text1);
    vector<string> tokens2 = tokenize(text2);
    
    if (tokens1.empty() && tokens2.empty()) return 1.0f;
    if (tokens1.empty() || tokens2.empty()) return 0.0f;

    sort(tokens1.begin(), tokens1.end());
    tokens1.erase(unique(tokens1.begin(), tokens1.end()), tokens1.end());
    
    sort(tokens2.begin(), tokens2.end());
    tokens2.erase(unique(tokens2.begin(), tokens2.end()), tokens2.end());

    vector<string> intersection;
    set_intersection(tokens1.begin(), tokens1.end(),
                     tokens2.begin(), tokens2.end(),
                     back_inserter(intersection));

    vector<string> union_set;
    set_union(tokens1.begin(), tokens1.end(),
              tokens2.begin(), tokens2.end(),
              back_inserter(union_set));

    if (union_set.empty()) return 0.0f;
    return static_cast<float>(intersection.size()) / static_cast<float>(union_set.size());
}

// Metric 2: Linguistic Entropy (Shannon Entropy)
// H(X) = -Sum(P(x) * log2(P(x)))
float calculateShannonEntropy(const string& text) {
    vector<string> tokens = tokenize(text);
    if (tokens.empty()) return 0.0f;

    map<string, int> frequency;
    for (const string& word : tokens) {
        frequency[word]++;
    }

    float entropy = 0.0f;
    float totalWords = static_cast<float>(tokens.size());

    for (const auto& pair : frequency) {
        float probability = pair.second / totalWords;
        entropy -= probability * log2(probability);
    }
    
    return entropy;
}

// Main API exposed to JavaScript
// Returns a JSON string with the analysis results
string analyzeText(const string& targetText, const string& previousText, const string& headingText) {
    float overlapPrev = calculateJaccardSimilarity(targetText, previousText);
    float overlapHeading = calculateJaccardSimilarity(targetText, headingText);
    float entropy = calculateShannonEntropy(targetText);
    
    // Slop Score Heuristic (0.0 to 1.0)
    // High overlap + low entropy = highly likely to be slop
    float slopScore = 0.0f;
    
    // If entropy is suspiciously low (repetitive words)
    if (entropy < 3.5f && entropy > 0.01f) {
        slopScore += 0.4f;
    }
    
    // If it heavily overlaps with previous sentence
    if (overlapPrev > 0.4f) {
        slopScore += 0.4f;
    }
    
    // If it heavily overlaps with the heading
    if (overlapHeading > 0.3f) {
        slopScore += 0.2f;
    }

    // Clamp score
    slopScore = min(1.0f, max(0.0f, slopScore));

    // Construct simple JSON string manually
    stringstream json;
    json << "{";
    json << "\"jaccardPrevious\":" << overlapPrev << ",";
    json << "\"jaccardHeading\":" << overlapHeading << ",";
    json << "\"shannonEntropy\":" << entropy << ",";
    json << "\"slopScore\":" << slopScore;
    json << "}";

    return json.str();
}

// Expose bindings to JavaScript via Emscripten
EMSCRIPTEN_BINDINGS(slop_analyzer) {
    emscripten::function("analyzeText", &analyzeText);
    emscripten::function("calculateJaccardSimilarity", &calculateJaccardSimilarity);
    emscripten::function("calculateShannonEntropy", &calculateShannonEntropy);
}
