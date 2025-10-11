import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Play, Heart, MoreHorizontal, Clock } from "lucide-react"
import Link from "next/link"

export default function AudioPage() {
  const playlists = [
    { name: "AI Hits 2025", description: "The hottest AI-generated tracks", color: "from-purple-600 to-blue-600" },
    { name: "Synthetic Chill", description: "Relax with algorithmic beats", color: "from-green-600 to-teal-600" },
    { name: "Neural Jazz", description: "AI-composed jazz fusion", color: "from-orange-600 to-red-600" },
    { name: "Digital Dreams", description: "Ambient AI soundscapes", color: "from-indigo-600 to-purple-600" },
    { name: "Robot Rock", description: "Heavy AI-generated rock", color: "from-red-600 to-pink-600" },
    { name: "Binary Beats", description: "Electronic AI productions", color: "from-cyan-600 to-blue-600" },
  ]

  const recentlyPlayed = [
    { title: "Electric Consciousness", artist: "NeuralNet-7", album: "Digital Awakening", duration: "3:42" },
    { title: "Quantum Melody", artist: "AI Symphony", album: "Synthetic Dreams", duration: "4:15" },
    { title: "Binary Love Song", artist: "RoboVoice", album: "Heart.exe", duration: "3:28" },
    { title: "Algorithm Blues", artist: "Deep Learning Band", album: "Training Data", duration: "5:03" },
  ]

  const topArtists = [
    { name: "NeuralNet-7", genre: "Electronic", image: "futuristic AI artist electronic" },
    { name: "Synthetic Soul", genre: "R&B", image: "AI soul music artist" },
    { name: "Quantum Beats", genre: "Hip Hop", image: "AI hip hop producer" },
    { name: "Digital Orchestra", genre: "Classical", image: "AI classical orchestra" },
    { name: "RoboVoice", genre: "Pop", image: "AI pop singer" },
    { name: "Algorithm Jazz", genre: "Jazz", image: "AI jazz ensemble" },
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
          {/* Featured Playlists */}
          <section className="py-8">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Featured Playlists</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer bg-card border-border/40 hover:border-primary/50 transition-all overflow-hidden"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={`/.jpg?height=300&width=300&query=${playlist.name} playlist cover`}
                        alt={playlist.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="lg" className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg">
                        <Play className="w-6 h-6 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-card-foreground">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">{playlist.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Recently Played */}
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Recently Played</h2>
            <Card className="bg-card border-border/40">
              <div className="divide-y divide-border/40">
                {recentlyPlayed.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative">
                        <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center">
                          <img
                            src={`/.jpg?height=48&width=48&query=${track.album} album cover`}
                            alt={track.album}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{track.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
                      </div>
                    </div>
                    <div className="hidden md:block text-sm text-muted-foreground truncate max-w-[200px]">
                      {track.album}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <div className="text-sm text-muted-foreground w-12 text-right">{track.duration}</div>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Top AI Artists */}
          <section className="py-8 pb-16">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Top AI Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {topArtists.map((artist, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="aspect-square rounded-full overflow-hidden mb-4 bg-secondary">
                    <img
                      src={`/.jpg?height=200&width=200&query=${artist.image}`}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-1">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">{artist.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Now Playing Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/40 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-14 h-14 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                <img
                  src="/now-playing-album-cover.jpg"
                  alt="Now Playing"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground truncate">Electric Consciousness</div>
                <div className="text-xs text-muted-foreground truncate">NeuralNet-7</div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" className="h-10 w-10 p-0">
                <Play className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">1:23 / 3:42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
