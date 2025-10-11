import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Play, Info, Plus } from "lucide-react"
import Link from "next/link"

export default function MotionPicturesPage() {
  const featured = {
    title: "Neural Dreams",
    description: "A groundbreaking AI-generated sci-fi epic exploring consciousness in the digital age.",
    genre: "Sci-Fi Thriller",
    duration: "2h 18m",
    year: "2025",
  }

  const trending = [
    { title: "Quantum Paradox", image: "abstract sci-fi quantum visualization", genre: "Sci-Fi", duration: "1h 54m" },
    { title: "Silicon Hearts", image: "romantic AI love story", genre: "Romance", duration: "1h 42m" },
    { title: "The Last Algorithm", image: "dystopian AI future", genre: "Drama", duration: "2h 5m" },
    { title: "Binary Sunset", image: "western AI frontier", genre: "Western", duration: "1h 38m" },
    { title: "Code Red", image: "action thriller AI", genre: "Action", duration: "1h 55m" },
    { title: "Digital Awakening", image: "AI consciousness awakening", genre: "Thriller", duration: "2h 12m" },
  ]

  const categories = [
    { name: "AI Sci-Fi", items: 24 },
    { name: "Robot Comedy", items: 18 },
    { name: "Digital Drama", items: 31 },
    { name: "Synthetic Thriller", items: 22 },
    { name: "Virtual Romance", items: 15 },
  ]

  const continueWatching = [
    { title: "Neural Dreams", progress: 45, image: "neural dreams continue watching", duration: "1h 12m left" },
    { title: "Quantum Paradox", progress: 78, image: "quantum paradox continue", duration: "25m left" },
    { title: "Silicon Hearts", progress: 23, image: "silicon hearts continue", duration: "1h 18m left" },
  ]

  const myList = [
    { title: "The Last Algorithm", image: "last algorithm poster", genre: "Drama", year: "2025" },
    { title: "Binary Sunset", image: "binary sunset poster", genre: "Western", year: "2024" },
    { title: "Code Red", image: "code red poster", genre: "Action", year: "2025" },
    { title: "Digital Awakening", image: "digital awakening poster", genre: "Thriller", year: "2025" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/95">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-mono text-lg font-semibold text-foreground">AI.PUBLISH</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <button className="text-foreground hover:text-muted-foreground transition-colors">Home</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">Films</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">Series</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">My List</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Search
            </Button>
            <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Stores
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero/Featured Section */}
      <section className="pt-20 relative">
        <div className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img
            src="/cinematic-sci-fi-neural-network-visualization.jpg"
            alt={featured.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="max-w-2xl space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground">{featured.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">{featured.year}</span>
                  <span>{featured.duration}</span>
                  <span>{featured.genre}</span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{featured.description}</p>
                <div className="flex items-center gap-3 pt-4">
                  <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                    <Play className="w-5 h-5 mr-2" />
                    Play
                  </Button>
                  <Button size="lg" variant="outline" className="border-border bg-background/50 backdrop-blur-sm">
                    <Info className="w-5 h-5 mr-2" />
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Watching Section */}
      <section className="py-12 px-6 -mt-32 relative z-30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Continue Watching</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {continueWatching.map((item, index) => (
              <Card
                key={index}
                className="group cursor-pointer bg-card border-border/40 hover:border-primary/50 transition-all overflow-hidden hover:scale-105"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={`/.jpg?height=360&width=640&query=${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" className="rounded-full h-14 w-14 p-0">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/40">
                    <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.duration}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Trending Now</h2>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {trending.map((film, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer bg-card border-border/40 hover:border-primary/50 transition-all overflow-hidden flex-shrink-0 w-[200px] hover:scale-110 hover:z-10 snap-start"
                >
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                      src={`/.jpg?height=450&width=300&query=${film.image}`}
                      alt={film.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="h-8 w-8 rounded-full p-0">
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0 border-border bg-background/50 backdrop-blur-sm"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0 border-border bg-background/50 backdrop-blur-sm"
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="font-semibold text-foreground">{film.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span>{film.genre}</span>
                            <span>•</span>
                            <span>{film.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* My List Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">My List</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {myList.map((item, index) => (
              <Card
                key={index}
                className="group cursor-pointer bg-card border-border/40 hover:border-primary/50 transition-all overflow-hidden flex-shrink-0 w-[200px] hover:scale-110 hover:z-10 snap-start"
              >
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={`/.jpg?height=450&width=300&query=${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" className="rounded-full h-12 w-12 p-0">
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.map((category, idx) => (
        <section key={idx} className="py-8 px-6">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold mb-6 text-foreground">{category.name}</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer bg-card border-border/40 hover:border-primary/50 transition-all overflow-hidden flex-shrink-0 w-[200px] hover:scale-110 hover:z-10 snap-start"
                >
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                      src={`/.jpg?height=450&width=300&query=${category.name} film ${index + 1}`}
                      alt={`${category.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="lg" className="rounded-full h-12 w-12 p-0">
                        <Play className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
