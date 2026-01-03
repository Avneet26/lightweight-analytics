# 📊 Lightweight Analytics

**Simple, privacy-focused website analytics that respects your users.**

Stop using bloated analytics tools that slow down your website and invade user privacy. Lightweight Analytics gives you the insights you need — nothing more, nothing less.

---

## ✨ Why Lightweight Analytics?

| Feature | Lightweight Analytics | Google Analytics |
|---------|----------------------|------------------|
| **Privacy** | ✅ No cookies, no tracking | ❌ Extensive tracking |
| **GDPR Compliant** | ✅ Built-in | ❌ Requires consent banner |
| **Script Size** | ✅ < 1KB | ❌ ~45KB |
| **Page Speed Impact** | ✅ Negligible | ❌ Noticeable slowdown |
| **Data Ownership** | ✅ You own it | ❌ Google owns it |
| **Setup Time** | ✅ 2 minutes | ❌ Complex configuration |

---

## 🚀 Getting Started

### 1. Create Your Account

Sign up at [your-analytics-domain.com](https://your-analytics-domain.com) with just an email and password. No credit card required.

### 2. Add Your Website

Click **"New Project"** and enter your website's name and domain. You'll receive a unique API key instantly.

### 3. Install the Tracking Script

Copy your personalized script and paste it into your website's `<head>` tag:

```html
<script defer src="https://your-analytics-domain.com/tracker.js" 
  data-api-key="la_yourUniqueApiKey">
</script>
```

**That's it!** Page views are now being tracked automatically.

---

## 📈 What You Can Track

### Automatic Tracking
- **Page Views** — Every page visit is captured
- **Unique Visitors** — Session-based visitor counting
- **Referrers** — Where your traffic comes from
- **Devices** — Desktop, mobile, or tablet
- **Browsers** — Chrome, Firefox, Safari, and more
- **Countries** — Geographic distribution of visitors

### Custom Event Tracking

Track specific user actions with a simple JavaScript call:

```javascript
// Track button clicks
document.querySelector('#signup-btn').addEventListener('click', () => {
  window.la.track('click', 'signup_button');
});

// Track form submissions
document.querySelector('form').addEventListener('submit', () => {
  window.la.track('submit', 'newsletter_form');
});

// Track custom events
window.la.track('download', 'user_guide_pdf');
```

---

## 🖥️ Dashboard Features

### Real-Time Insights
View your analytics as they happen. No waiting for data to process.

### Events Log
See every event in a detailed table with:
- Event type (pageview, click, custom)
- Page URL
- Device & browser info
- Country
- Timestamp

### Key Metrics
- **Total Page Views** — Cumulative page visits
- **Unique Visitors** — Distinct user sessions
- **Event Count** — All tracked interactions
- **Top Pages** — Your most visited content

---

## � Privacy by Design

We believe analytics shouldn't come at the cost of user privacy:

- **No Cookies** — We don't set any cookies
- **No Personal Data** — We never collect names, emails, or IPs
- **No Cross-Site Tracking** — Each site's data is isolated
- **No Data Selling** — Your data is yours, period
- **GDPR Compliant** — No consent banners needed

---

## ⚡ Performance First

Our tracking script is designed for speed:

- **< 1KB** — Smaller than most images
- **Async Loading** — Never blocks page rendering
- **Edge Deployment** — Served from the nearest location
- **No Dependencies** — Pure vanilla JavaScript

---

## 🔑 API Access

Need programmatic access? Use our REST API:

### Track an Event

```bash
curl -X POST https://your-analytics-domain.com/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "la_yourApiKey",
    "type": "pageview",
    "page": "/pricing"
  }'
```

### Event Types

| Type | Description |
|------|-------------|
| `pageview` | Standard page visit |
| `click` | User click event |
| `submit` | Form submission |
| `custom` | Any custom event |

---

## 💡 SPA Support

Building a Single Page Application? We've got you covered.

The tracking script automatically detects route changes in:
- React Router
- Next.js
- Vue Router
- Angular Router
- Any History API-based routing

No additional configuration required.

---

## � Works Everywhere

Lightweight Analytics works with any website or framework:

- ✅ Static HTML sites
- ✅ WordPress
- ✅ Shopify
- ✅ React / Next.js
- ✅ Vue / Nuxt
- ✅ Angular
- ✅ Svelte / SvelteKit
- ✅ Any website with HTML access

---

## 🤔 FAQ

<details>
<summary><strong>Do I need to show a cookie banner?</strong></summary>

No! Since we don't use cookies or collect personal data, you don't need consent banners for Lightweight Analytics.
</details>

<details>
<summary><strong>Will this slow down my website?</strong></summary>

No. Our script is under 1KB and loads asynchronously. It has no measurable impact on page load times.
</details>

<details>
<summary><strong>How do you detect unique visitors without cookies?</strong></summary>

We use session-based identification that resets when the browser is closed. This provides useful metrics while respecting privacy.
</details>

<details>
<summary><strong>Can I export my data?</strong></summary>

Yes! You can export your analytics data in CSV or JSON format from the dashboard.
</details>

<details>
<summary><strong>Is my data secure?</strong></summary>

Absolutely. All data is encrypted in transit and at rest. We use edge databases for security and performance.
</details>

---

## � Support

Need help? We're here for you:

- 📧 **Email**: support@your-analytics-domain.com
- 📖 **Docs**: [docs.your-analytics-domain.com](https://docs.your-analytics-domain.com)
- 💬 **Discord**: [Join our community](https://discord.gg/your-invite)

---

<p align="center">
  <strong>Start tracking smarter, not harder.</strong>
  <br><br>
  <a href="https://your-analytics-domain.com/register">Get Started Free →</a>
</p>

---

<p align="center">
  Built with ❤️ for developers who value privacy
</p>
