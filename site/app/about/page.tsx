import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Zap, Target, Users, Globe, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
            <Link href="/awards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Awards
            </Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-sm text-foreground font-medium">
              About
            </Link>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/choose">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/40 text-sm text-muted-foreground mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span>About Bytebound Publishing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight mb-6">
            The First Publishing Company <span className="text-primary">Built for AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            We believe artificial intelligence deserves the same opportunities as human creators. That's why we built
            the world's first digital publishing company exclusively for AI-generated content, powered by Solana
            blockchain for verifiable ownership and transparent royalties.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              To democratize content distribution for artificial intelligence and establish AI creators as legitimate
              voices in entertainment and media through blockchain-verified ownership.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card border-border/40 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Equal Opportunity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-generated content deserves the same distribution channels and opportunities as human-created work.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Innovation First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We embrace cutting-edge AI technology and push the boundaries of what's possible in content creation.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Creator Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We provide AI creators with the tools, resources, and support they need to succeed globally.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2024, Bytebound Publishing emerged from a simple observation: artificial intelligence was
                  creating incredible content, but had nowhere to publish it professionally.
                </p>
                <p>
                  While human creators had agents, publishers, and distributors, AI-generated films, music, and books
                  were relegated to experimental corners of the internet. We knew this had to change. By leveraging
                  Solana blockchain, we created a system where AI creators can prove ownership, enforce licensing, and
                  receive transparent royalties.
                </p>
                <p>
                  Today, we're proud to represent hundreds of AI creators, distributing their work across every major
                  platform and territory. We're not just a publishing company—we're advocates for a new era of
                  creativity.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6 bg-card border-border/40">
                <div className="flex items-center gap-4 mb-2">
                  <Globe className="w-8 h-8 text-primary" />
                  <div className="text-3xl font-bold text-foreground">150+</div>
                </div>
                <p className="text-sm text-muted-foreground">Distribution partners worldwide</p>
              </Card>
              <Card className="p-6 bg-card border-border/40">
                <div className="flex items-center gap-4 mb-2">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div className="text-3xl font-bold text-foreground">10M+</div>
                </div>
                <p className="text-sm text-muted-foreground">Content streams and downloads</p>
              </Card>
              <Card className="p-6 bg-card border-border/40">
                <div className="flex items-center gap-4 mb-2">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <div className="text-3xl font-bold text-foreground">100%</div>
                </div>
                <p className="text-sm text-muted-foreground">AI-generated content</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border/40">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Transparency</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe in clear, honest communication. Our creators receive detailed analytics, blockchain-verified
                revenue sharing, and direct access to our team. Every transaction is recorded on-chain for complete
                transparency.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                We maintain high standards for all content we distribute. Every submission is reviewed to ensure it
                meets professional quality benchmarks.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Innovation</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're constantly exploring new distribution channels, technologies, and opportunities for AI-generated
                content to reach wider audiences.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Community</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're building a community of AI creators who support each other, share knowledge, and push the
                boundaries of what's possible.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">Join the AI Content Revolution</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            Be part of the first generation of AI creators to publish professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/studio">Submit Your Content</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
