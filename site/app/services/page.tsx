import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Film,
  Music,
  Radio,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
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
            <Link href="/services" className="text-sm text-foreground font-medium">
              Services
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/app">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/40 text-sm text-muted-foreground mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span>Comprehensive Distribution Services</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight mb-6">
            Everything Your AI Content Needs to <span className="text-primary">Reach the World</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            From submission to global distribution, we handle every aspect of publishing your AI-generated content. Each
            work is minted as a Solana NFT with verifiable ownership, programmable licensing, and automated royalties.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Solana Blockchain</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Every piece of content on Bytebound is secured by blockchain technology, ensuring trust and transparency
              for creators, collectors, and partners.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border/40">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">On-Chain Provenance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI provenance (models, prompts, and outputs) is committed on-chain so everyone can trust what they're
                reading and paying for.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <CheckCircle2 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Verifiable Authorship</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each work mints an NFT with immutable proof of creation, protecting your intellectual property rights
                forever.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Enforced Royalties</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Smart contracts automatically enforce royalty payments, ensuring you get paid fairly for every use of
                your content.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Motion Pictures */}
            <Card className="p-8 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Film className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Motion Pictures</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Feature films, short films, and documentaries distributed to streaming platforms, film festivals, and
                theatrical releases worldwide.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Festival submissions and representation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Streaming platform distribution (Netflix, Prime, etc.)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">International licensing and rights management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Marketing and promotional support</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                asChild
              >
                <Link href="/motion-pictures">
                  Explore Films <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Card>

            {/* Audio/Music */}
            <Card className="p-8 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Music className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Audio & Music</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Albums, singles, soundtracks, and audio content distributed to all major music streaming services and
                digital stores.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Spotify, Apple Music, YouTube Music distribution
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Playlist pitching and curation support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Royalty collection and transparent reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Cover art and metadata optimization</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                asChild
              >
                <Link href="/audio">
                  Browse Music <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Card>

            {/* Podcasts */}
            <Card className="p-8 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Radio className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Podcasts</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                AI-hosted shows and audio content distributed across all major podcast platforms and directories.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Apple Podcasts, Spotify, Google Podcasts distribution
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">RSS feed management and hosting</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Analytics and audience insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Monetization and sponsorship opportunities</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
              >
                Coming Soon <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Books & Literature */}
            <Card className="p-8 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Books & Literature</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Novels, essays, and written works distributed to digital bookstores and reading platforms worldwide.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Amazon Kindle, Apple Books, Google Play Books</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Print-on-demand services</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">ISBN assignment and copyright registration</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Editorial and formatting support</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                asChild
              >
                <Link href="/books">
                  Discover Books <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border/40">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Global Rights Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We handle licensing, territorial rights, and legal compliance across 150+ countries. Smart contracts
                enforce your terms automatically.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Analytics & Reporting</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Real-time dashboards showing performance metrics, revenue, and audience insights with
                blockchain-verified transaction history.
              </p>
            </Card>
            <Card className="p-6 bg-card border-border/40">
              <Sparkles className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Marketing Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Promotional campaigns, press releases, and social media strategy for your content.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">Ready to Distribute Your AI Content?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            Join hundreds of AI creators who trust us with their content distribution.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/studio">Submit Your Content</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
