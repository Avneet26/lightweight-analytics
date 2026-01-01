import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  BarChart3,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Code2,
  LineChart,
  MousePointerClick
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0c10] relative">
      {/* Animated Canvas Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e24] bg-[#0c0c10]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-[#e4e4e7]">Analytics</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 text-[#b39ddb] text-xs font-medium mb-8 backdrop-blur-sm">
            <Zap className="w-3 h-3" />
            Lightweight & Privacy-Focused
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-[#e4e4e7] leading-tight mb-6">
            Simple analytics for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b7ed9] to-[#b39ddb]">
              modern web
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-[#8a8a94] max-w-xl mx-auto mb-10">
            Track your website&apos;s performance without the complexity.
            No cookies, no personal data — just the metrics that matter.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg">
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-20 relative z-10">
          <div className="rounded-xl border border-[#1e1e24] bg-[#101014]/90 backdrop-blur-sm p-1 shadow-2xl shadow-[#7c5eb3]/5">
            <div className="rounded-lg bg-[#14141a]/95 p-6">
              {/* Window controls */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#2a2a32]" />
                <div className="w-3 h-3 rounded-full bg-[#2a2a32]" />
                <div className="w-3 h-3 rounded-full bg-[#2a2a32]" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Page Views", value: "12,847", change: "+12.5%", positive: true },
                  { label: "Unique Visitors", value: "3,249", change: "+8.2%", positive: true },
                  { label: "Avg. Duration", value: "2m 34s", change: "+5.1%", positive: true },
                  { label: "Bounce Rate", value: "42.3%", change: "-3.4%", positive: true },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#101014] rounded-lg p-4 border border-[#1e1e24]">
                    <p className="text-xs text-[#6b6b75] mb-1">{stat.label}</p>
                    <p className="text-xl font-semibold text-[#e4e4e7]">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.positive ? 'text-[#6fcf97]' : 'text-[#f87171]'}`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="bg-[#101014] rounded-lg p-8 border border-[#1e1e24] flex items-center justify-center h-48">
                <div className="text-[#4a4a54] flex items-center gap-2 text-sm">
                  <LineChart className="w-4 h-4" />
                  <span>Analytics Chart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-[#1e1e24] relative z-10 bg-[#0c0c10]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#e4e4e7] mb-3">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-[#6b6b75]">
              Built for developers who want insights without the bloat
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: "Lightweight Script",
                description: "Less than 1KB tracking script that won't slow down your site."
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "No cookies, no personal data, no IP tracking. GDPR compliant."
              },
              {
                icon: Globe,
                title: "Global Edge",
                description: "Deployed on the edge for lightning-fast tracking worldwide."
              },
              {
                icon: Code2,
                title: "Simple Integration",
                description: "One script tag is all you need. Works with any framework."
              },
              {
                icon: MousePointerClick,
                title: "Event Tracking",
                description: "Track custom events, button clicks, and form submissions."
              },
              {
                icon: LineChart,
                title: "Real-time Dashboard",
                description: "See your analytics update in real-time with beautiful charts."
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-lg bg-[#101014]/90 backdrop-blur-sm border border-[#1e1e24] hover:border-[#2a2a32] transition-all duration-150"
              >
                <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#b39ddb]" />
                </div>
                <h3 className="text-base font-semibold text-[#e4e4e7] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6b6b75]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-[#1e1e24] relative z-10 bg-[#0c0c10]/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#e4e4e7] mb-3">
            Ready to get started?
          </h2>
          <p className="text-[#6b6b75] mb-8">
            Start tracking your analytics in minutes. No credit card required.
          </p>
          <Link href="/register">
            <Button size="lg">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e24] py-8 px-6 relative z-10 bg-[#0c0c10]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-[#4a4a54]">
              Lightweight Analytics © 2024
            </span>
          </div>
          <div className="text-xs text-[#4a4a54]">
            Built with ♥ for developers
          </div>
        </div>
      </footer>
    </div>
  );
}
