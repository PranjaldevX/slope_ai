import { useState, useEffect } from 'react'
import './App.css'

interface Snippet {
  text: string;
  score: number;
  breakdown?: Array<{
    component: string;
    contribution: number;
    percentage: number;
    description: string;
  }>;
}

interface BreakdownStats {
  avgScore: number;
  topIssues: Array<{
    issue: string;
    count: number;
    avgPercentage: number;
  }>;
}

interface ReviewStats {
  reviewCount: number;
  suspiciousReviews: number;
  reviewClusters: number;
  avgSimilarity: number;
  scanType?: 'content' | 'reviews';
}

function App() {
  const [slopCount, setSlopCount] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [lastUrl, setLastUrl] = useState('')
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [breakdownStats, setBreakdownStats] = useState<BreakdownStats | null>(null)
  const [expandedSnippet, setExpandedSnippet] = useState<number | null>(null)
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)

  useEffect(() => {
    // Read stored count from last scan
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get([
        'slopCount', 'lastScanUrl', 'flaggedSnippets', 'scanType',
        'reviewCount', 'suspiciousReviews', 'reviewClusters', 'avgSimilarity', 'flaggedReviews'
      ], (data) => {
        const anyData = data as any;
        const scanType = anyData.scanType || 'content';
        
        if (scanType === 'reviews') {
          // Review scan data
          setReviewStats({
            reviewCount: anyData.reviewCount || 0,
            suspiciousReviews: anyData.suspiciousReviews || 0,
            reviewClusters: anyData.reviewClusters || 0,
            avgSimilarity: anyData.avgSimilarity || 0,
            scanType: 'reviews'
          });
          setSlopCount(anyData.suspiciousReviews || 0);
          const reviewSnippets = anyData.flaggedReviews || [];
          setSnippets(reviewSnippets);
          if (reviewSnippets.length > 0) {
            calculateBreakdownStats(reviewSnippets);
          }
        } else {
          // Content scan data
          setSlopCount(anyData.slopCount || 0);
          const snippetsData = anyData.flaggedSnippets || [];
          setSnippets(snippetsData);
          if (snippetsData.length > 0) {
            calculateBreakdownStats(snippetsData);
          }
          setReviewStats(null);
        }
        
        setLastUrl(anyData.lastScanUrl || '');
      })
    }
  }, [])

  const calculateBreakdownStats = (snippetsData: Snippet[]) => {
    const issueMap = new Map<string, { count: number; totalPercentage: number }>()
    let totalScore = 0

    snippetsData.forEach(snippet => {
      totalScore += snippet.score
      
      if (snippet.breakdown) {
        snippet.breakdown
          .filter(b => b.contribution > 0)
          .forEach(b => {
            const existing = issueMap.get(b.component) || { count: 0, totalPercentage: 0 }
            issueMap.set(b.component, {
              count: existing.count + 1,
              totalPercentage: existing.totalPercentage + b.percentage
            })
          })
      }
    })

    const topIssues = Array.from(issueMap.entries())
      .map(([issue, data]) => ({
        issue,
        count: data.count,
        avgPercentage: Math.round(data.totalPercentage / data.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    setBreakdownStats({
      avgScore: totalScore / snippetsData.length,
      topIssues
    })
  }

  const handleScan = async () => {
    setScanning(true)
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'scan' }, () => {
            // After scanning, the content script updates storage, so we fetch it again
            chrome.storage.local.get([
              'slopCount', 'flaggedSnippets', 'scanType',
              'reviewCount', 'suspiciousReviews', 'reviewClusters', 'avgSimilarity', 'flaggedReviews'
            ], (data) => {
                const anyData = data as any;
                const scanType = anyData.scanType || 'content';
                
                if (scanType === 'reviews') {
                  setReviewStats({
                    reviewCount: anyData.reviewCount || 0,
                    suspiciousReviews: anyData.suspiciousReviews || 0,
                    reviewClusters: anyData.reviewClusters || 0,
                    avgSimilarity: anyData.avgSimilarity || 0,
                    scanType: 'reviews'
                  });
                  setSlopCount(anyData.suspiciousReviews || 0);
                  const reviewSnippets = anyData.flaggedReviews || [];
                  setSnippets(reviewSnippets);
                  if (reviewSnippets.length > 0) {
                    calculateBreakdownStats(reviewSnippets);
                  }
                } else {
                  setSlopCount(anyData.slopCount || 0);
                  const snippetsData = anyData.flaggedSnippets || [];
                  setSnippets(snippetsData);
                  if (snippetsData.length > 0) {
                    calculateBreakdownStats(snippetsData);
                  }
                  setReviewStats(null);
                }
                
                setScanning(false);
            });
          })
        }
      }
    } catch {
      setScanning(false)
    }
  }

  const scoreColor = slopCount === 0 ? '#22c55e' : slopCount < 5 ? '#f59e0b' : '#ef4444'

  return (
    <div className="glass-container">
      <header className="header">
        <h1>🔍 Information Density Filter</h1>
        <p className="subtitle">Surface What Matters</p>
      </header>

      <main>
        <div className="stat-card">
          <div className="stat-number" style={{ color: scoreColor }}>{slopCount}</div>
          <div className="stat-label">Low-Density Paragraphs Hidden</div>
        </div>

        {lastUrl && (
          <div className="url-label">
            Last scanned: {new URL(lastUrl).hostname}
          </div>
        )}

        <button 
          className="primary-btn" 
          onClick={handleScan}
          disabled={scanning}
        >
          {scanning ? '⏳ Scanning...' : '⚡ Re-scan Current Page'}
        </button>

        {reviewStats && reviewStats.scanType === 'reviews' && (
          <div className="review-stats-section">
            <div className="stats-title">🛒 Review Analysis</div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{reviewStats.reviewCount}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
              <div className="stat-item">
                <div className="stat-value" style={{ color: '#ef4444' }}>
                  {reviewStats.suspiciousReviews}
                </div>
                <div className="stat-label">Suspicious</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{reviewStats.reviewClusters}</div>
                <div className="stat-label">Clusters</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {(reviewStats.avgSimilarity * 100).toFixed(0)}%
                </div>
                <div className="stat-label">Avg Similarity</div>
              </div>
            </div>
            {reviewStats.reviewClusters > 0 && (
              <div className="cluster-warning">
                ⚠️ {reviewStats.reviewClusters} suspicious review clusters detected
              </div>
            )}
          </div>
        )}

        {breakdownStats && slopCount > 0 && (
          <div className="breakdown-section">
            <div className="breakdown-title">📊 Analysis Breakdown</div>
            <div className="avg-score">
              Average Score: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                {breakdownStats.avgScore.toFixed(2)}
              </span>
            </div>
            <div className="top-issues">
              <div className="issues-title">Top Issues Detected:</div>
              {breakdownStats.topIssues.map((issue, i) => (
                <div key={i} className="issue-item">
                  <div className="issue-label">
                    {issue.issue} ({issue.avgPercentage}%)
                  </div>
                  <div className="issue-bar-container">
                    <div 
                      className="issue-bar" 
                      style={{ 
                        width: `${(issue.count / slopCount) * 100}%`,
                        backgroundColor: '#ef4444'
                      }}
                    />
                  </div>
                  <div className="issue-count">
                    {issue.count}/{slopCount} paragraphs
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {snippets.length > 0 && (
          <div className="snippets-section">
            <div className="snippets-title">Flagged Content</div>
            <div className="snippets-list">
                {snippets.map((s, i) => (
                    <div key={i} className="snippet-item">
                        <div 
                          className="snippet-score clickable" 
                          onClick={() => setExpandedSnippet(expandedSnippet === i ? null : i)}
                          title="Click to see breakdown"
                        >
                          Score: {s.score.toFixed(2)} {expandedSnippet === i ? '▼' : '▶'}
                        </div>
                        
                        {expandedSnippet === i && s.breakdown && (
                          <div className="snippet-breakdown">
                            <div className="snippet-breakdown-title">📊 Score Breakdown:</div>
                            {s.breakdown
                              .filter(b => Math.abs(b.contribution) > 0.01)
                              .map((b, idx) => (
                                <div key={idx} className="breakdown-metric">
                                  <div className="metric-header">
                                    <span className={b.contribution > 0 ? 'metric-negative' : 'metric-positive'}>
                                      {b.contribution > 0 ? '⚠️' : '✅'} {b.component}
                                    </span>
                                    <span className="metric-value">
                                      {b.contribution > 0 ? '+' : ''}{(b.contribution * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="metric-description">{b.description}</div>
                                </div>
                              ))}
                          </div>
                        )}
                        
                        <div className="snippet-text">"{s.text}"</div>
                    </div>
                ))}
            </div>
          </div>
        )}

        <div className="info-section">
          <p className="info-text">
            Low-density paragraphs are faded out. Hover to reveal.
          </p>
          <div className="metric-row">
            <span className="dot dot-red"></span> Low compression ratio (high fluff)
          </div>
          <div className="metric-row">
            <span className="dot dot-red"></span> Low information gain (repetitive)
          </div>
          <div className="metric-row">
            <span className="dot dot-red"></span> High filler word density
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>Track E + G · Slop Scan Hackathon 2026</span>
      </footer>
    </div>
  )
}

export default App
