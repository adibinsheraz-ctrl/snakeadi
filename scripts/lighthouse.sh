#!/bin/bash
# Lighthouse CI configuration and runner

set -e

echo "🚀 Running Lighthouse CI..."

# Install lighthouse-cli if not present
if ! command -v lighthouse &> /dev/null; then
  npm install -g lighthouse
fi

# Run Lighthouse audit
lighthouse http://localhost:3000 \
  --output-path=./lighthouse/report.html \
  --output=html,json \
  --chrome-flags="--headless" \
  --emulated-form-factor=mobile \
  --throttling-method=simulate \
  --only-categories=performance,accessibility,best-practices,seo

# Extract scores
REPORT_PATH="./lighthouse/report.json"

if [ -f "$REPORT_PATH" ]; then
  echo ""
  echo "📊 Lighthouse Scores:"
  echo "===================="

  PERFORMANCE=$(jq '.categories.performance.score * 100' "$REPORT_PATH")
  ACCESSIBILITY=$(jq '.categories.accessibility.score * 100' "$REPORT_PATH")
  BEST_PRACTICES=$(jq '.categories["best-practices"].score * 100' "$REPORT_PATH")
  SEO=$(jq '.categories.seo.score * 100' "$REPORT_PATH")

  echo "Performance:     $PERFORMANCE"
  echo "Accessibility:   $ACCESSIBILITY"
  echo "Best Practices:  $BEST_PRACTICES"
  echo "SEO:             $SEO"
  echo ""

  # Check if scores meet minimum threshold (80)
  if (( $(echo "$PERFORMANCE < 80" | bc -l) )); then
    echo "⚠️  Performance score below 80"
    exit 1
  fi

  if (( $(echo "$ACCESSIBILITY < 80" | bc -l) )); then
    echo "⚠️  Accessibility score below 80"
    exit 1
  fi

  echo "✅ Lighthouse audit passed!"
else
  echo "❌ Lighthouse report not found"
  exit 1
fi