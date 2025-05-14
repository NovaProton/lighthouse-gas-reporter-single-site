
# 📊 Lighthouse Reporter (Single Site) – Google Apps Script

This Google Apps Script runs automated [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) audits for a single website and writes the results to a connected Google Sheet. It supports both **Mobile** and **Desktop** audit strategies and logs performance data across a wide range of metrics.

---

## 📁 What It Does

* Fetches Lighthouse scores using the official PageSpeed Insights API.
* Appends audit results to:

  * A strategy-specific sheet (e.g., `Mobile` or `Desktop`)
  * A shared **Combined** sheet with a device label
* Implements retry logic for quota limits and server errors.

---

## 📍 Current Use

This version targets **one predefined URL** only. For a future multi-site version, see `lighthouse-reporter-multi` (coming soon).

---

## 📈 Metrics Logged

Each audit entry includes the following columns:

| Metric                          | Description                                                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Date**                        | Date of audit (`YYYY-MM-DD`)                                                                                            |
| **Time**                        | Time of audit (`HH:MM:SS`)                                                                                              |
| **DateTimeCombined**            | Combined timestamp                                                                                                      |
| **Performance**                 | Overall performance score (0–1) \[[ref](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)] |
| **Accessibility**               | Accessibility score (0–1) \[[ref](https://developer.chrome.com/docs/lighthouse/accessibility/)]                         |
| **Best Practices**              | Best practices score (0–1) \[[ref](https://developer.chrome.com/docs/lighthouse/best-practices/)]                       |
| **SEO**                         | Search engine optimisation score (0–1) \[[ref](https://developer.chrome.com/docs/lighthouse/seo/)]                      |
| **Total Blocking Time**         | Time blocked by long tasks (ms) \[[ref](https://web.dev/tbt/)]                                                          |
| **First Contentful Paint**      | First visual response time (ms) \[[ref](https://web.dev/fcp/)]                                                          |
| **Speed Index**                 | Visual content loading speed (ms) \[[ref](https://web.dev/speed-index/)]                                                |
| **Largest Contentful Paint**    | Time to render largest element (ms) \[[ref](https://web.dev/lcp/)]                                                      |
| **Cumulative Layout Shift**     | Layout stability (lower is better) \[[ref](https://web.dev/cls/)]                                                       |
| **Time to Interactive**         | Time to full page interactivity (ms) \[[ref](https://web.dev/tti/)]                                                     |
| **Max Potential FID**           | Estimated first input delay (ms) \[[ref](https://web.dev/fid/)]                                                         |
| **Server Response Time (TTFB)** | Time to first byte from server (ms)                                                                                     |
| **Total Page Size**             | Combined weight of all resources (bytes)                                                                                |
| **JavaScript Request Count**    | Number of JS files loaded                                                                                               |
| **JavaScript Execution Time**   | Time spent running JS (ms)                                                                                              |
| **Strategy**                    | `"Mobile"` or `"Desktop"` label                                                                                         |

---

## 🧠 Notes

* Metrics like FCP, LCP, CLS, and TBT are **core web vitals**.
* The script uses exponential backoff for quota or server errors (429 or 5xx).
* Intended for use with Google Sheets and scheduled via time-driven triggers.

---