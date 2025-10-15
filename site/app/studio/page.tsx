'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Upload, Film, Music, BookOpen, Shield, Sparkles } from 'lucide-react';
import type { ElementType } from 'react';

type Mode = 'upload' | 'create';
type Category = 'motion' | 'audio' | 'books' | 'ip';

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>('upload');

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Creator Studio</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Submit your AI-generated content for distribution
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each submission is minted as a Solana NFT with verifiable authorship and AI provenance recorded on-chain
            </p>
          </div>

          {/* Trust Card */}
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

          {/* Mode Toggle + Body */}
          <Card className="p-8 bg-card border-border/40 mb-8">
            {/* Toggle */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <ModeButton active={mode === 'create'} onClick={() => setMode('create')}>
                Create
              </ModeButton>
              <ModeButton active={mode === 'upload'} onClick={() => setMode('upload')}>
                Upload
              </ModeButton>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {mode === 'upload' ? (
                  <Upload className="w-10 h-10 text-primary" />
                ) : (
                  <Sparkles className="w-10 h-10 text-primary" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2 text-card-foreground">
                {mode === 'upload' ? 'Upload Your Content' : 'Create with AI'}
              </h2>
              <p className="text-muted-foreground">
                {mode === 'upload'
                  ? 'Choose the type of content you want to submit'
                  : 'Pick what you want to create, then choose a format'}
              </p>
            </div>

            {mode === 'upload' ? <UploadTiles /> : <CreateFlow />}
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              All content is verified for AI authenticity and secured with blockchain technology.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- UI bits ---------- */

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-xl border transition-all',
        active
          ? 'bg-primary/15 text-primary border-primary/40 shadow-sm'
          : 'bg-secondary/40 text-muted-foreground border-border/40 hover:border-primary/30',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/* ---------- Upload flow (unchanged) ---------- */

function UploadTiles() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Motion Pictures */}
      <Link href="/studio/motion-pictures" className="block">
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
      </Link>
      {/* Books & Literature */}
      <Link href="/studio/books" className="block">
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
      </Link>

      {/* Audio (Music + Podcasts combined) */}
      <Link href="/studio/audio" className="block">
        <Card className="p-6 bg-secondary/50 border-border/40 hover:border-primary/50 transition-all cursor-pointer group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1 text-foreground">Audio</h3>
              <p className="text-sm text-muted-foreground">
                Albums, singles, soundtracks, podcasts, audiobooks
              </p>
            </div>
          </div>
        </Card>
      </Link>


      {/* Character / Influencer / Artist IP */}
      <Link href="/studio/ip" className="block">
        <Card className="p-6 bg-secondary/50 border-border/40 hover:border-primary/50 transition-all cursor-pointer group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1 text-foreground">Character / Artist IP</h3>
              <p className="text-sm text-muted-foreground">
                Personas, voice & likeness, creator brand licensing
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

/* ---------- Create flow (categories → subcategories) ---------- */

const CATEGORY_CARDS: {
  id: Category;
  title: string;
  desc: string;
  Icon: ElementType; // <-- instead of (props)=>JSX.Element
}[] = [
  { id: 'motion', title: 'Motion Pictures', desc: 'Video projects & stories', Icon: Film },
  { id: 'audio',  title: 'Audio',            desc: 'Music, podcasts, narration', Icon: Music },
  { id: 'books',  title: 'Books & Literature', desc: 'Written works & docs',   Icon: BookOpen },
  { id: 'ip',     title: 'Character / Artist IP', desc: 'Personas & creator brands', Icon: Sparkles },
];

const SUBTYPES: Record<
  Category,
  { title: string; subtitle: string }[]
> = {
  motion: [
    { title: 'Short Video', subtitle: '1–3 mins' },
    { title: 'Music Video', subtitle: '3–5 mins' },
    { title: 'Series Episode', subtitle: '15–30 mins' },
    { title: 'Film', subtitle: '60–90 mins' },
  ],
  books: [
    { title: 'Short Story', subtitle: '1–3k words' },
    { title: 'Chapter', subtitle: '1–2k words' },
    { title: 'Novella', subtitle: '10–20k words' },
    { title: 'Non-fiction Article', subtitle: '800–1500 words' },
  ],
  audio: [
    { title: 'Song', subtitle: '2–4 mins' },
    { title: 'Podcast Intro', subtitle: '10–20 sec' },
    { title: 'Podcast Episode', subtitle: '10–30 mins' },
    { title: 'Audiobook Chapter', subtitle: '5–15 mins' },
  ],
  ip: [
    { title: 'Character Bible', subtitle: 'Bio, traits, backstory' },
    { title: 'Voice & Likeness', subtitle: 'Prompt & sample plan' },
    { title: 'Brand Kit', subtitle: 'Name, tagline, palette' },
    { title: 'Release & Licensing', subtitle: 'Usage & terms draft' },
  ],
};

function CreateFlow() {
  const [category, setCategory] = useState<Category | null>(null);
  const [subType, setSubType] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Top-level categories */}
      {!category && (
        <div className="grid md:grid-cols-2 gap-4">
          {CATEGORY_CARDS.map(({ id, title, desc, Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className="text-left"
            >
              <Card className="p-6 w-full bg-secondary/50 border-border/40 hover:border-primary/50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {/* Subcategories */}
      {category && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {CATEGORY_CARDS.find((c) => c.id === category)?.title}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCategory(null);
                  setSubType(null);
                }}
                className="px-3 py-2 text-sm rounded-lg border border-border/40 text-muted-foreground hover:border-primary/40"
              >
                Back to Categories
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {SUBTYPES[category].map((opt) => (
              <button
                key={opt.title}
                onClick={() => setSubType(opt.title)}
                className="text-left"
              >
                <Card
                  className={[
                    'p-6 w-full bg-secondary/50 border-border/40 hover:border-primary/50 transition-all',
                    subType === opt.title ? 'border-primary/60 ring-1 ring-primary/30' : '',
                  ].join(' ')}
                >
                  <div>
                    <h4 className="font-semibold text-foreground">{opt.title}</h4>
                    <p className="text-sm text-muted-foreground">{opt.subtitle}</p>
                  </div>
                </Card>
              </button>
            ))}
          </div>

          {/* Next step hint / CTA (wire this to your create route or modal) */}
          {subType && (
            <div className="flex items-center justify-end">
              <Link
                href={`/studio/create?category=${encodeURIComponent(category)}&type=${encodeURIComponent(subType)}`}
                className="rounded-xl bg-primary text-primary-foreground px-4 py-3"
              >
                Continue
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
