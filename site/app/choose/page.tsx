import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Film, Music, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 px-6 pt-16"> {/* was flex + items-center + justify-center + pt-20 */}
        <div className="container mx-auto max-w-7xl pt-0 pb-12">
          <div className="text-center mb-7">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">Explore Catalogs</h1>
            <p className="text-xl text-muted-foreground">
            Discover the next wave of AI creators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Motion Pictures */}
            <Link href="/motion-pictures" className="group block cursor-pointer">
              <Card className="h-[260px] md:h-[320px] bg-gradient-to-br from-red-950/40 to-background border-border/40 hover:border-primary/50 transition-all overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

                <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Motion Pictures</h2>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
                    Discover AI-generated films, shorts, and documentaries
                  </p>
                  <Button className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90">
                    Browse Films
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Audio */}
            <Link href="/audio" className="group block cursor-pointer">
              <Card className="h-[260px] md:h-[320px] bg-gradient-to-br from-green-950/40 to-background border-border/40 hover:border-primary/50 transition-all overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

                <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Audio</h2>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
                    Stream AI-created music, albums, and podcasts
                  </p>
                  <Button className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90">
                    Browse Audio
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Books */}
            <Link href="/books" className="group block cursor-pointer">
              <Card className="h-[260px] md:h-[320px] bg-gradient-to-br from-purple-950/40 to-background border-border/40 hover:border-primary/50 transition-all overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Books</h2>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
                    Read AI-authored novels, stories, and literature
                  </p>
                  <Button className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90">
                    Browse Books
                  </Button>
                </div>
              </Card>
            </Link>

{/* Wide Studio CTA — balanced brightness */}
<Link href="/studio" className="group block md:col-span-3">
  <Card className="relative h-[170px] md:h-[190px] overflow-hidden border-border/40 hover:border-primary/50 transition-colors">
    {/* soft color wash */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-accent-secondary/12 to-transparent" />
    {/* gentle glows */}
    <div className="absolute -top-24 right-20 w-72 h-72 rounded-full bg-primary/14 blur-[72px] group-hover:bg-primary/18" />
    <div className="absolute -bottom-28 left-16 w-80 h-80 rounded-full bg-accent-secondary/14 blur-[80px] group-hover:bg-accent-secondary/18" />
    {/* light dim so text stays crisp */}
    <div className="absolute inset-0 bg-background/30" />

    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
      <h3 className="text-2xl md:text-3xl font-semibold mb-2 text-foreground">Want to Create?</h3>
      <p className="text-base md:text-lg text-muted-foreground mb-4">
        Try the Studio and submit your AI-generated work for distribution
      </p>
      <Button variant="outline" className="h-10 px-5 border-border hover:bg-secondary">Open Studio</Button>
    </div>
  </Card>
</Link>


          </div>
        </div>
      </main>
    </div>
  )
}
