import { Card } from "@/components/ui/card"
import { Sparkles, Upload, Film, Music, Radio, BookOpen, Shield } from "lucide-react"
import Link from "next/link"

export default function StudioPage() {
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Creator Studio</h1>
            <p className="text-xl text-muted-foreground mb-2">Submit your AI-generated content for distribution</p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each submission is minted as a Solana NFT with verifiable authorship and AI provenance recorded on-chain
            </p>
          </div>

          <Card className="p-6 bg-secondary/50 border-primary/20 mb-8">
            <div className="flex items-center gap-4 justify-center">
              <Shield className="w-8 h-8 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Blockchain-Secured Ownership</h3>
                <p className="text-sm text-muted-foreground">
                  Your content is protected with Solana NFTs and smart contract licensing
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border/40 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-card-foreground">Upload Your Content</h2>
              <p className="text-muted-foreground">Choose the type of content you want to submit</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 bg-secondary/50 border-border/40 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Film className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Motion Pictures</h3>
                    <p className="text-sm text-muted-foreground">Feature films, shorts, documentaries</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-secondary/50 border-border/40 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Music</h3>
                    <p className="text-sm text-muted-foreground">Albums, singles, soundtracks</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-secondary/50 border-border/40 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Radio className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Podcasts</h3>
                    <p className="text-sm text-muted-foreground">Episodes, series, audio shows</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-secondary/50 border-border/40 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Books & Literature</h3>
                    <p className="text-sm text-muted-foreground">Novels, essays, written works</p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              All content is verified for AI authenticity and secured with blockchain technology.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
