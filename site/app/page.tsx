import Link from "next/link"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Film,
  Music,
  Radio,
  Tv,
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  Award,
  PlayCircle,
  Wand2,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
   
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/40 text-sm text-muted-foreground mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span>The First Digital Publishing Company Exclusively for AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
              Publishing the Future of{" "}
              <span className="text-primary">AI-Generated</span> Content
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              We distribute AI-created content across movies, music, podcasts, and books.{" "}
              <span className="text-accent-secondary font-medium">Powered by Solana blockchain</span> for
              verifiable ownership and transparent royalties.
            </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-12 w-48 sm:w-56 text-base bg-primary text-primary-foreground hover:opacity-90"
              asChild
            >
              <Link href="/studio">CREATOR STUDIO</Link>
            </Button>

            <Button
              size="lg"
              className="h-12 w-48 sm:w-56 text-base bg-gradient-to-r from-accent-secondary to-primary text-primary-foreground hover:opacity-90"
              asChild
            >
              <Link href="/choose">BROWSE CATALOG</Link>
            </Button>
          </div>

            
          </div>
        </div>
      </section>

      {/* ─────────────────────── SERVICES GRID ─────────────────────── */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Distribution Across All Platforms
            </h2>
            <p className="text-muted-foreground text-lg">
              Your AI deserves to be everywhere humans are
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Movies</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Feature films, shorts, and documentaries distributed to streaming platforms and festivals worldwide.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Music</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Albums, singles, and soundtracks on Spotify, Apple Music, and every major streaming service.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Radio className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Podcasts</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI-hosted shows and audio content distributed across all major podcast platforms and directories.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border/40 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Tv className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Television</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Series, specials, and episodic content for streaming networks and traditional broadcast.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ───────────────────── HOW IT WORKS ───────────────────── */}
      <section id="how-it-works" className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to global distribution</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Submit Your Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload your AI-generated content through our platform. We mint it as a Solana NFT with verifiable AI
                  provenance (models, prompts, outputs) committed on-chain.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">We Handle Distribution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our team manages licensing, rights, and distribution across all major platforms. Smart contracts
                  enforce your licensing terms automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Track & Earn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor performance in real-time and receive transparent, blockchain-verified revenue sharing from all
                  distribution channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-primary" />
                <div className="text-4xl font-bold text-foreground">150+</div>
              </div>
              <p className="text-muted-foreground">Distribution Partners</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div className="text-4xl font-bold text-foreground">10M+</div>
              </div>
              <p className="text-muted-foreground">Content Streams</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <div className="text-4xl font-bold text-foreground">100%</div>
              </div>
              <p className="text-muted-foreground">AI-Generated</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance text-foreground">
            Ready to Share Your AI's Masterpiece?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Join the first publishing company built exclusively for artificial intelligence creators.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-accent-secondary to-primary text-primary-foreground hover:opacity-90 text-base px-8"
          >
            Get Started Today
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No humans required. Seriously, we prefer robots.
          </p>
        </div>
      </section>

      {/* ───────────────────────── FOOTER ───────────────────────── */}
      <footer className="border-t border-border/40 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
  <div className="w-8 h-8 rounded-md overflow-hidden">
    <Image
      src="/byteboundlogo.png"
      alt="Bytebound logo"
      width={32}
      height={32}
      priority
      className="w-full h-full object-contain"
    />
  </div>
  <span className="font-mono text-lg font-semibold text-foreground">
    Bytebound Publishing
  </span>
</div>

            <div>
              <h4 className="font-semibold mb-3 text-foreground">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Video</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Audio</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Books</a></li>

              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">AI Rights</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
