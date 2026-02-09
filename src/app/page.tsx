import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-gray-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Master <span className="gradient-text">DSA</span> &{" "}
            <span className="gradient-text">Backend</span>
            <br />
            Together 🚀
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Track your DSA practice, backend skills, daily progress, and get
            motivated by seeing what others are learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="glow">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="glow">
                    Start Tracking Free →
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Progress Dashboard
              </h3>
              <p className="text-gray-400 text-sm">
                Track your streak, weekly stats, and identify weak areas
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Custom Topics
              </h3>
              <p className="text-gray-400 text-sm">
                Create topics for DSA, backend, or custom categories
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Skill Tracking
              </h3>
              <p className="text-gray-400 text-sm">
                Rate your confidence in backend technologies
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Beautiful Charts
              </h3>
              <p className="text-gray-400 text-sm">
                Visualize your progress with interactive graphs
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Social Feed
              </h3>
              <p className="text-gray-400 text-sm">
                Get motivated by seeing others&apos; progress
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Privacy Control
              </h3>
              <p className="text-gray-400 text-sm">
                Choose what to share and what to keep private
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-2xl p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to level up your skills?
          </h2>
          <p className="text-gray-400 mb-8">
            Join developers who are tracking their DSA and backend journey.
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button size="lg">Open Dashboard</Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg">Get Started — It&apos;s Free</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center text-gray-500 text-sm">
          Built with 💜 using Next.js, Prisma & Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
