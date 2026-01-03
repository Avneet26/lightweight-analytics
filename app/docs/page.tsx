import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    ArrowLeft,
    Code2,
    Zap,
    MousePointerClick,
    Globe,
    ExternalLink,
    Book,
    Terminal,
    Layers,
    FileCode,
} from "lucide-react";

export const metadata = {
    title: "Documentation | Lightweight Analytics",
    description: "Learn how to integrate Lightweight Analytics into your website with our comprehensive documentation.",
};

// Sidebar navigation items
const sidebarItems = [
    {
        title: "Getting Started",
        items: [
            { id: "quick-start", label: "Quick Start", icon: Zap },
            { id: "installation", label: "Installation", icon: Code2 },
        ],
    },
    {
        title: "Tracking",
        items: [
            { id: "pageviews", label: "Page Views", icon: Book },
            { id: "custom-events", label: "Custom Events", icon: MousePointerClick },
        ],
    },
    {
        title: "Integration",
        items: [
            { id: "api", label: "REST API", icon: Terminal },
            { id: "frameworks", label: "Framework Guides", icon: Layers },
        ],
    },
    {
        title: "Reference",
        items: [
            { id: "api-reference", label: "API Reference", icon: FileCode },
        ],
    },
];

function CodeBlock({ code, language = "javascript" }: { code: string; language?: string }) {
    return (
        <div className="relative group">
            <pre className="bg-[#0c0c10] border border-[#1e1e24] rounded-lg p-4 overflow-x-auto text-sm text-[#e4e4e7] font-mono">
                <code>{code}</code>
            </pre>
        </div>
    );
}

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-[#0c0c10]">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e24] bg-[#0c0c10]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base font-semibold text-[#e4e4e7]">Analytics</span>
                        </Link>
                        <span className="text-[#4a4a54]">/</span>
                        <span className="text-sm text-[#8a8a94]">Documentation</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/Avneet26/lightweight-analytics"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="ghost" size="sm">
                                GitHub
                                <ExternalLink className="w-3 h-3" />
                            </Button>
                        </a>
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Sign in</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content with Sidebar */}
            <div className="pt-14 flex max-w-7xl mx-auto min-h-screen">
                {/* Sidebar - Fixed on the left */}
                <div className="hidden lg:block w-64 shrink-0 border-r border-[#1e1e24]">
                    <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-6 pr-4">
                        <nav className="space-y-6">
                            {sidebarItems.map((section) => (
                                <div key={section.title}>
                                    <h3 className="text-xs font-semibold text-[#6b6b75] uppercase tracking-wider mb-3">
                                        {section.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {section.items.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] rounded-lg transition-colors"
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* Help Box */}
                        <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-4 mt-8">
                            <h4 className="text-sm font-semibold text-[#e4e4e7] mb-2">Need Help?</h4>
                            <p className="text-xs text-[#6b6b75] mb-3">
                                Can&apos;t find what you&apos;re looking for?
                            </p>
                            <a
                                href="https://github.com/Avneet26/lightweight-analytics/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#b39ddb] hover:text-[#e4e4e7] transition-colors flex items-center gap-1"
                            >
                                Open an issue on GitHub
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 py-8 px-8 min-w-0">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-[#6b6b75] hover:text-[#e4e4e7] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#e4e4e7] mb-4">
                            Documentation
                        </h1>
                        <p className="text-lg text-[#8a8a94]">
                            Everything you need to integrate Lightweight Analytics into your website.
                        </p>
                    </div>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-16 scroll-mt-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-[#b39ddb]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#e4e4e7]">Quick Start</h2>
                        </div>
                        <p className="text-[#8a8a94] mb-6">
                            Get up and running in less than 2 minutes.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-2">
                                    1. Create an Account
                                </h3>
                                <p className="text-sm text-[#6b6b75] mb-4">
                                    Sign up for free at our platform. No credit card required.
                                </p>
                                <Link href="/register">
                                    <Button size="sm">
                                        Create Account
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-2">
                                    2. Create a Project
                                </h3>
                                <p className="text-sm text-[#6b6b75]">
                                    Click &quot;New Project&quot; in your dashboard and enter your website&apos;s name and domain.
                                    You&apos;ll receive a unique API key for your project.
                                </p>
                            </div>

                            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-2">
                                    3. Add the Tracking Script
                                </h3>
                                <p className="text-sm text-[#6b6b75] mb-4">
                                    Copy your tracking script from the project settings and paste it into your website&apos;s{" "}
                                    <code className="text-[#b39ddb]">&lt;head&gt;</code> tag.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-16 scroll-mt-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-[#b39ddb]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#e4e4e7]">Installation</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-3">
                                    Basic Installation
                                </h3>
                                <p className="text-sm text-[#6b6b75] mb-4">
                                    Add this script to your website&apos;s <code className="text-[#b39ddb]">&lt;head&gt;</code> tag:
                                </p>
                                <CodeBlock
                                    language="html"
                                    code={`<script defer src="https://lightweight-analytics.vercel.app/api/script" 
  data-api-key="YOUR_API_KEY">
</script>`}
                                />
                            </div>

                            <div className="bg-[#1a3a2a] border border-[#2a4a3a] rounded-lg p-4">
                                <p className="text-sm text-[#6fcf97]">
                                    <strong>Tip:</strong> The <code>defer</code> attribute ensures the script
                                    doesn&apos;t block page rendering.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Page Views */}
                    <section id="pageviews" className="mb-16 scroll-mt-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                <Book className="w-5 h-5 text-[#b39ddb]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#e4e4e7]">Page Views</h2>
                        </div>

                        <p className="text-[#8a8a94] mb-6">
                            Page views are tracked automatically when you add the script. No additional configuration needed.
                        </p>

                        <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-[#e4e4e7] mb-3">What&apos;s Tracked</h3>
                            <ul className="space-y-2 text-sm text-[#8a8a94]">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fcf97]" />
                                    Page URL and path
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fcf97]" />
                                    Referrer (where visitors came from)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fcf97]" />
                                    Device type (desktop, mobile, tablet)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fcf97]" />
                                    Browser information
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fcf97]" />
                                    Session ID (for unique visitor counting)
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Custom Events */}
                    <section id="custom-events" className="mb-16 scroll-mt-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                <MousePointerClick className="w-5 h-5 text-[#b39ddb]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#e4e4e7]">Custom Event Tracking</h2>
                        </div>

                        <p className="text-[#8a8a94] mb-6">
                            Track any interaction on your website with the global <code className="text-[#b39ddb]">window.la</code> object.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-3">
                                    Track a Custom Event
                                </h3>
                                <CodeBlock
                                    code={`// Basic syntax
window.la.track('event_type', 'event_name');

// Examples
window.la.track('click', 'signup_button');
window.la.track('submit', 'contact_form');
window.la.track('download', 'pricing_pdf');`}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-3">
                                    Button Click Tracking
                                </h3>
                                <CodeBlock
                                    code={`document.querySelector('#my-button').addEventListener('click', () => {
  window.la.track('click', 'my_button');
});`}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-3">
                                    Form Submission Tracking
                                </h3>
                                <CodeBlock
                                    code={`document.querySelector('form').addEventListener('submit', (e) => {
  window.la.track('submit', 'newsletter_form');
});`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* REST API */}
                    <section id="api" className="mb-16 scroll-mt-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                <Terminal className="w-5 h-5 text-[#b39ddb]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#e4e4e7]">REST API</h2>
                        </div>

                        <p className="text-[#8a8a94] mb-6">
                            Send events directly to our API from any server or client.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-[#e4e4e7] mb-3">
                                    Track Event Endpoint
                                </h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-1 bg-[#1a3a2a] text-[#6fcf97] text-xs font-mono rounded">
                                        POST
                                    </span>
                                    <code className="text-sm text-[#8a8a94]">
                                        /api/track
                                    </code>
                                </div>
                                <CodeBlock
                                    language="bash"
                                    code={`curl -X POST https://lightweight-analytics.vercel.app/api/track \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "YOUR_API_KEY",
    "type": "pageview",
    "page": "/pricing"
  }'`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Frameworks */}
                    <section id="frameworks" className="mb-16 scroll-mt-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-[#b39ddb]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#e4e4e7]">Framework Guides</h2>
                        </div>

                        <div className="grid gap-4">
                            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                                <h3 className="text-base font-semibold text-[#e4e4e7] mb-3">Next.js / React</h3>
                                <CodeBlock code={`// In your _app.js or layout.js
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <>
      <Script 
        src="https://lightweight-analytics.vercel.app/api/script"
        data-api-key="YOUR_API_KEY"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}`} />
                            </div>

                            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                                <h3 className="text-base font-semibold text-[#e4e4e7] mb-3">Vue / Nuxt</h3>
                                <CodeBlock code={`// In nuxt.config.js
export default {
  head: {
    script: [
      {
        src: 'https://lightweight-analytics.vercel.app/api/script',
        'data-api-key': 'YOUR_API_KEY',
        defer: true
      }
    ]
  }
}`} />
                            </div>

                            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                                <h3 className="text-base font-semibold text-[#e4e4e7] mb-3">HTML / Static Sites</h3>
                                <CodeBlock code={`<!-- Add to your <head> tag -->
<script defer 
  src="https://lightweight-analytics.vercel.app/api/script" 
  data-api-key="YOUR_API_KEY">
</script>`} />
                            </div>
                        </div>
                    </section>

                    {/* API Reference */}
                    <section id="api-reference" className="mb-16 scroll-mt-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                <FileCode className="w-5 h-5 text-[#b39ddb]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#e4e4e7]">API Reference</h2>
                        </div>

                        <div className="bg-[#101014] border border-[#1e1e24] rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-[#1e1e24]">
                                <h3 className="text-sm font-semibold text-[#e4e4e7]">POST /api/track - Request Body</h3>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#1e1e24]">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase">Field</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase">Required</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e1e24]">
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-[#b39ddb] font-mono">apiKey</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">string</td>
                                        <td className="px-4 py-3 text-sm text-[#6fcf97]">Yes</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">Your project&apos;s API key</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-[#b39ddb] font-mono">type</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">string</td>
                                        <td className="px-4 py-3 text-sm text-[#6fcf97]">Yes</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">Event type (pageview, click, custom)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-[#b39ddb] font-mono">page</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">string</td>
                                        <td className="px-4 py-3 text-sm text-[#6fcf97]">Yes</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">Page URL where event occurred</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-[#b39ddb] font-mono">name</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">string</td>
                                        <td className="px-4 py-3 text-sm text-[#6b6b75]">No</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">Event name for custom events</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-[#b39ddb] font-mono">referrer</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">string</td>
                                        <td className="px-4 py-3 text-sm text-[#6b6b75]">No</td>
                                        <td className="px-4 py-3 text-sm text-[#8a8a94]">Referring URL</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-8 text-center">
                        <h2 className="text-xl font-bold text-[#e4e4e7] mb-3">
                            Ready to get started?
                        </h2>
                        <p className="text-[#6b6b75] mb-6">
                            Create your free account and start tracking in minutes.
                        </p>
                        <Link href="/register">
                            <Button size="lg">
                                Create Free Account
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-[#1e1e24] py-8 px-6 bg-[#0c0c10] mt-12">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center">
                                <BarChart3 className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs text-[#4a4a54]">
                                Lightweight Analytics © {new Date().getFullYear()}
                            </span>
                        </div>
                        <div className="text-xs text-[#6b6b75]">
                            Made with <span className="text-[#f87171]">♥</span> by{" "}
                            <a
                                href="https://github.com/Avneet26"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#b39ddb] hover:text-[#e4e4e7] transition-colors"
                            >
                                Avneet Virdi
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
