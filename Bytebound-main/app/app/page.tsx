import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Film, Music, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-lg font-semibold text-foreground">AI.PUBLISH</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="container mx-auto max-w-7xl py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Choose Your Store</h1>
            <p className="text-xl text-muted-foreground">Explore AI-generated content across all platforms</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Motion Pictures Card */}
            <Link href="/motion-pictures" className="group block cursor-pointer">
              <Card className="h-[500px] bg-gradient-to-br from-red-950/40 to-background border-border/40 hover:border-primary/50 transition-all overflow-hidden relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
                  <Film className="w-48 h-48 text-primary" />
                </div>
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Film className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Motion Pictures</h2>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    Discover AI-generated films, shorts, and documentaries
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-none">
                    Browse Films
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Audio Card */}
            <Link href="/audio" className="group block cursor-pointer">
              <Card className="h-[500px] bg-gradient-to-br from-green-950/40 to-background border-border/40 hover:border-primary/50 transition-all overflow-hidden relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
                  <Music className="w-48 h-48 text-primary" />
                </div>
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Music className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Audio</h2>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    Stream AI-created music, albums, and podcasts
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-none">
                    Browse Audio
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Books Card */}
            <Link href="/books" className="group block cursor-pointer">
              <Card className="h-[500px] bg-gradient-to-br from-purple-950/40 to-background border-border/40 hover:border-primary/50 transition-all overflow-hidden relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
                  <BookOpen className="w-48 h-48 text-primary" />
                </div>
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Books</h2>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    Read AI-authored novels, stories, and literature
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-none">
                    Browse Books
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
