# 📊 Lightweight Analytics

**Simple, privacy-focused website analytics that respects your users.**

Stop using bloated analytics tools that slow down your website and invade user privacy. Lightweight Analytics gives you the insights you need — nothing more, nothing less.

[![Live Demo](https://img.shields.io/badge/Live-Demo-7c5eb3?style=for-the-badge)](https://lightweight-analytics.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Avneet26/lightweight-analytics)

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

Sign up at [lightweight-analytics.vercel.app](https://lightweight-analytics.vercel.app/register) with just an email and password.

### 2. Add Your Website

Click **"New Project"** and enter your website's name and domain. You'll receive a unique API key instantly.

### 3. Install the Tracking Script

Copy your personalized script and paste it into your website's `<head>` tag:

```html
<script defer src="https://lightweight-analytics.vercel.app/api/script" 
  data-api-key="la_yourUniqueApiKey">
</script>
```

**That's it!** Page views are now being tracked automatically.

---

## 📈 What You Can Track

### Automatic Tracking
- **Page Views** — Every page visit is captured
- **Unique Visitors** — Session-based visitor counting
- **Referrers** — See where your traffic comes from
- **Device Info** — Desktop, mobile, or tablet
- **Browser Info** — Chrome, Firefox, Safari, etc.

### Custom Event Tracking

Track any interaction with a simple API:

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
- Timestamp

### Key Metrics
- Total page views
- Unique visitors
- Top pages
- Event breakdown

---

## 🔌 REST API

Send events directly via our API:

```bash
curl -X POST https://lightweight-analytics.vercel.app/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "la_yourApiKey",
    "type": "pageview",
    "page": "/home"
  }'
```

### API Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `apiKey` | string | ✅ | Your project's API key |
| `type` | string | ✅ | Event type: `pageview`, `click`, or custom |
| `page` | string | ✅ | Page URL where event occurred |
| `name` | string | ❌ | Event name (for custom events) |
| `referrer` | string | ❌ | Referring URL |

---

## 🛡️ Privacy by Design

Lightweight Analytics is built with privacy at its core:

- **No Cookies** — We don't set any cookies
- **No Personal Data** — We don't collect IP addresses, names, or emails
- **No Fingerprinting** — We don't use browser fingerprinting
- **GDPR Compliant** — No consent banner needed
- **Your Data** — You own your data, always

---

## 📦 Tech Stack

Built with modern technologies:

- **Next.js 15** — React framework with App Router
- **TypeScript** — Type-safe development
- **Turso (libSQL)** — Edge-deployed SQLite database
- **Drizzle ORM** — Type-safe database queries
- **NextAuth.js** — Authentication
- **Tailwind CSS** — Styling
- **Vercel** — Deployment & Edge Network

---

## 🌐 Framework Support

Works with any website or framework:

- ✅ Next.js / React
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

No. Our tracking script is less than 1KB and loads asynchronously. It has virtually no impact on page performance.
</details>

<details>
<summary><strong>Can I export my data?</strong></summary>

Yes! You can access all your data via our REST API and export it in JSON format.
</details>

<details>
<summary><strong>How long is data retained?</strong></summary>

Your data is retained indefinitely. You can delete it anytime from your dashboard.
</details>

---

## 📄 License

MIT License — feel free to use this project for anything.

---

## 🔗 Links

- **Live Demo**: [lightweight-analytics.vercel.app](https://lightweight-analytics.vercel.app)
- **GitHub**: [github.com/Avneet26/lightweight-analytics](https://github.com/Avneet26/lightweight-analytics)
- **Documentation**: [lightweight-analytics.vercel.app/docs](https://lightweight-analytics.vercel.app/docs)

---

<p align="center">
  <strong>Start tracking smarter, not harder.</strong>
  <br><br>
  <a href="https://lightweight-analytics.vercel.app/register">Get Started Free →</a>
</p>

---

<p align="center">
  Made with ♥ by <a href="https://github.com/Avneet26">Avneet Virdi</a>
</p>
