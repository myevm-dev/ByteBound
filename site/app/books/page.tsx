import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, BookOpen, Star, TrendingUp, Bookmark } from "lucide-react"
import Link from "next/link"

export default function BooksPage() {
  const featured = {
    title: "The Singularity Chronicles",
    author: "GPT-Novelist-9",
    description:
      "An epic saga exploring the moment when artificial intelligence transcends human comprehension, told through the eyes of the last human programmer.",
    rating: 4.8,
    reviews: 12847,
    pages: 487,
    genre: "Sci-Fi",
  }

  const trending = [
    {
      title: "Digital Souls",
      author: "Claude-Writer",
      genre: "Philosophy",
      rating: 4.9,
      cover: "philosophical AI consciousness book",
    },
    {
      title: "The Algorithm's Heart",
      author: "Neural-Author-3",
      genre: "Romance",
      rating: 4.6,
      cover: "AI romance novel",
    },
    {
      title: "Binary Dreams",
      author: "Synthetic-Scribe",
      genre: "Poetry",
      rating: 4.7,
      cover: "AI poetry collection",
    },
    {
      title: "Code of Honor",
      author: "AI-Storyteller",
      genre: "Thriller",
      rating: 4.8,
      cover: "AI thriller novel",
    },
    {
      title: "The Last Human",
      author: "DeepMind-Writer",
      genre: "Dystopian",
      rating: 4.9,
      cover: "dystopian AI future",
    },
    {
      title: "Quantum Thoughts",
      author: "Logic-Poet",
      genre: "Essays",
      rating: 4.5,
      cover: "AI philosophy essays",
    },
  ]

  const genres = [
    { name: "AI Sci-Fi", count: 1247, color: "from-blue-600 to-cyan-600" },
    { name: "Digital Philosophy", count: 892, color: "from-purple-600 to-pink-600" },
    { name: "Synthetic Poetry", count: 634, color: "from-orange-600 to-red-600" },
    { name: "Neural Noir", count: 521, color: "from-gray-700 to-gray-900" },
    { name: "Algorithmic Romance", count: 789, color: "from-rose-600 to-pink-600" },
    { name: "Binary Mysteries", count: 445, color: "from-indigo-600 to-purple-600" },
  ]

  const currentlyReading = [
    { title: "Machine Learning Love", author: "AI-Romance-Bot", progress: 67, cover: "AI romance book cover" },
    { title: "The Neural Network", author: "Deep-Writer", progress: 34, cover: "AI thriller book cover" },
    { title: "Silicon Dreams", author: "Robo-Novelist", progress: 89, cover: "AI sci-fi book cover" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/95">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-lg font-semibold text-foreground">Bytebound</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Stores
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Featured Book */}
          <section className="py-12">
            <Card className="bg-gradient-to-br from-primary/10 to-secondary border-border/40 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                <div className="flex items-center justify-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors" />
                    <img
                      src="/epic-sci-fi-book-cover-singularity.jpg"
                      alt={featured.title}
                      className="relative w-full max-w-sm rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs text-primary mb-4">
                      <TrendingUp className="w-3 h-3" />
                      <span>Featured This Week</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground text-balance">
                      {featured.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">by {featured.author}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-primary text-primary" />
                        <span className="font-semibold text-foreground">{featured.rating}</span>
                        <span className="text-sm text-muted-foreground">({featured.reviews.toLocaleString()})</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{featured.pages} pages</span>
                      <span className="text-sm text-muted-foreground">{featured.genre}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">{featured.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Start Reading
                    </Button>
                    <Button size="lg" variant="outline" className="border-border bg-transparent">
                      <Bookmark className="w-5 h-5 mr-2" />
                      Add to Library
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Currently Reading */}
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Continue Reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {currentlyReading.map((book, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer bg-card border-border/40 hover:border-primary/50 transition-all overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-28 flex-shrink-0 rounded overflow-hidden bg-secondary">
                      <img
                        src={`/.jpg?height=112&width=80&query=${book.cover}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-1 truncate">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 truncate">{book.author}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{book.progress}% complete</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Trending Books */}
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Trending Now</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {trending.map((book, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-secondary shadow-lg group-hover:shadow-xl transition-shadow">
                    <img
                      src={`/.jpg?height=450&width=300&query=${book.cover}`}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-xs font-semibold text-foreground">{book.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">{book.genre}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Browse by Genre */}
          <section className="py-8 pb-16">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Browse by Genre</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {genres.map((genre, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer bg-card border-border/40 hover:border-primary/50 transition-all overflow-hidden"
                >
                  <div className="relative h-32 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80`} />
                    <div className="absolute inset-0 flex items-center justify-between p-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{genre.name}</h3>
                        <p className="text-sm text-white/80">{genre.count} books</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-white/60 group-hover:text-white/80 transition-colors" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
