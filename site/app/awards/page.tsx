import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Award, Film, Music, BookOpen, Trophy, Star, Zap, Calendar } from "lucide-react"
import Link from "next/link"

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-lg font-semibold text-foreground">Bytebound Publishing</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/awards" className="text-sm text-foreground font-medium">
              Awards
            </Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Button
              size="sm"
              className="bg-accent-secondary text-accent-secondary-foreground hover:bg-accent-secondary/90"
              asChild
            >
              <Link href="/choose">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Sparkle Effect */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-secondary/5 to-transparent" />
        <div className="container mx-auto max-w-5xl text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-sm text-accent-secondary mb-6 animate-pulse">
            <Award className="w-4 h-4" />
            <span className="font-semibold">Coming 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight mb-6 relative">
            <span className="relative inline-block">
              AI Content Awards
              <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-accent-secondary animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-6 w-6 h-6 text-accent-secondary animate-pulse delay-75" />
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8">
            Celebrating excellence in AI-generated content across motion pictures, music, and literature.{" "}
            <span className="text-accent-secondary font-medium">Platform credits and cash prizes</span> for the best
            creators, with <span className="text-primary font-medium">NFT-based recognition</span> and on-chain
            achievement records.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent-secondary text-accent-secondary-foreground hover:bg-accent-secondary/90 relative group"
            >
              <span className="relative z-10">Submit Your Work</span>
              <div className="absolute inset-0 bg-accent-secondary/20 rounded-md blur-xl group-hover:blur-2xl transition-all" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/studio">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Award Categories */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Award Categories</h2>
            <p className="text-lg text-muted-foreground">
              Recognizing the best AI-generated content across all formats
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Film Awards */}
            <Card className="p-8 bg-card border-border/40 hover:border-accent-secondary/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/5 rounded-full blur-3xl group-hover:bg-accent-secondary/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-accent-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Film className="w-8 h-8 text-accent-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">AI Film Festival</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Celebrating groundbreaking AI-generated motion pictures, from shorts to feature-length films.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Feature Film
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Short Film
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Documentary
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Visual Effects
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Audience Choice
                  </li>
                </ul>
              </div>
            </Card>

            {/* Music Awards */}
            <Card className="p-8 bg-card border-border/40 hover:border-primary/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Music className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">AI Music Awards</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Honoring exceptional AI-composed music across all genres and formats.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Album of the Year
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Best Single
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Best Soundtrack
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Genre Innovation
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Most Streamed
                  </li>
                </ul>
              </div>
            </Card>

            {/* Literature Awards */}
            <Card className="p-8 bg-card border-border/40 hover:border-accent-secondary/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/5 rounded-full blur-3xl group-hover:bg-accent-secondary/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-accent-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-accent-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">Best Reading List</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Recognizing outstanding AI-written literature and storytelling excellence.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Novel
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Short Story Collection
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Non-Fiction
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Best Poetry
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-secondary" />
                    Reader's Choice
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prizes & Recognition</h2>
            <p className="text-lg text-muted-foreground">
              Winners receive platform credits, cash prizes, and blockchain-verified achievement NFTs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border/40">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Platform Credits</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Winners receive substantial platform credits for enhanced distribution, marketing support, and premium
                features across all Bytebound Publishing services.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Cash Prizes</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Monetary awards for top winners in each category, with grand prizes for overall excellence across all
                content types.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Global Recognition</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Featured placement across our platform, press coverage, and promotion to our network of 150+
                distribution partners worldwide.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Festival Invitations</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Exclusive invitations to premiere events, industry showcases, and networking opportunities with leading
                AI content creators.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">2026 Event Timeline</h2>
            <p className="text-lg text-muted-foreground">Mark your calendars for these exciting events</p>
          </div>
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border/40 border-l-4 border-l-accent-secondary">
              <div className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0">
                  <div className="text-sm font-mono text-accent-secondary">Q1 2026</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">Submissions Open</h3>
                  <p className="text-sm text-muted-foreground">Begin accepting entries for all award categories</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border/40 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0">
                  <div className="text-sm font-mono text-primary">Q2 2026</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">AI Film Festival</h3>
                  <p className="text-sm text-muted-foreground">Virtual and in-person screenings of nominated films</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border/40 border-l-4 border-l-accent-secondary">
              <div className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0">
                  <div className="text-sm font-mono text-accent-secondary">Q3 2026</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">Music Awards Ceremony</h3>
                  <p className="text-sm text-muted-foreground">Live-streamed event celebrating AI music excellence</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border/40 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0">
                  <div className="text-sm font-mono text-primary">Q4 2026</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">Best Reading List Announcement</h3>
                  <p className="text-sm text-muted-foreground">Revealing the year's best AI-written literature</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="relative inline-block mb-6">
            <Award className="w-16 h-16 text-accent-secondary mx-auto" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent-secondary animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-balance">Ready to Compete?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            Start publishing your AI content today and be ready for the 2026 awards season.
          </p>
          <Button
            size="lg"
            className="bg-accent-secondary text-accent-secondary-foreground hover:bg-accent-secondary/90 relative group"
          >
            <span className="relative z-10">Submit Your Content</span>
            <div className="absolute inset-0 bg-accent-secondary/20 rounded-md blur-xl group-hover:blur-2xl transition-all" />
          </Button>
        </div>
      </section>
    </div>
  )
}
