import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { Card, CardContent } from "@/components/ui/Card";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
            </span>
            Track your developer journey
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight animate-fade-in animation-delay-100">
            Master <span className="text-zinc-500">DSA</span> &{" "}
            <span className="text-white">Backend</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
            A minimalist tracker for your coding practice. Monitor your daily progress,
            build consistency, and visualize your growth with beautiful insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base">
                  Go to Dashboard
                  <Icons.ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Start Tracking
                    <Icons.ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg" className="h-12 px-8 text-base">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="glass" className="p-6 group hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Icons.Analytics className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Progress Dashboard
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Visualize your streak, weekly problem solving stats, and identify weak areas at a glance.
              </p>
            </Card>

            <Card variant="glass" className="p-6 group hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Icons.Topics className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Custom Topics
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Create and organize tracking for DSA patterns, system design concepts, or any custom category.
              </p>
            </Card>

            <Card variant="glass" className="p-6 group hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Icons.Skills className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Skill Tracking
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Rate your confidence in specific backend technologies and track your mastery over time.
              </p>
            </Card>

            <Card variant="glass" className="p-6 group hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Icons.Trending className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Analytics
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Beautiful, interactive charts that help you understand your learning velocity and patterns.
              </p>
            </Card>

            <Card variant="glass" className="p-6 group hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Icons.Feed className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Social Feed
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Stay motivated by seeing what others are learning and sharing with the community.
              </p>
            </Card>

            <Card variant="glass" className="p-6 group hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Icons.Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Privacy First
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                You control your data. Choose exactly what you want to share publicly and what stays private.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to commit to consistency?
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are building better habits and tracking their growth.
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg">Open Dashboard</Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" className="h-14 px-10 text-lg">Get Started for Free</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <Icons.Trending className="w-5 h-5" />
            <span className="font-semibold text-white">Tracker</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
