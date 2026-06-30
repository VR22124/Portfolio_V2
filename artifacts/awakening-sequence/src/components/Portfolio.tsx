import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Portfolio() {
  const projects = [
    {
      id: 1,
      title: 'Neon Nexus',
      desc: 'Generative art engine built with WebGL and Rust.',
      tags: ['WebGL', 'Rust', 'Creative Coding']
    },
    {
      id: 2,
      title: 'SynthOS',
      desc: 'Minimalist operating system interface concept.',
      tags: ['React', 'Framer Motion', 'UI/UX']
    },
    {
      id: 3,
      title: 'Void Tracker',
      desc: 'Dark-mode financial tracker for freelancers.',
      tags: ['Next.js', 'Tailwind', 'PostgreSQL']
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <main className="container mx-auto px-6 py-24 max-w-5xl">
        
        <header className="mb-32 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          <h1 className="font-serif text-5xl md:text-7xl font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200/50 mb-6">
            ALEX CHEN
          </h1>
          <p className="text-cyan-500/80 tracking-[0.2em] text-sm md:text-base font-light">
            CREATIVE DEVELOPER & VISUAL DESIGNER
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-4">
            <h2 className="font-serif text-2xl tracking-widest text-white/90">Selected Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Card 
                key={p.id} 
                className="bg-zinc-950/50 border-white/5 hover:border-cyan-500/30 transition-all duration-500 group"
                data-testid={`card-project-${p.id}`}
              >
                <CardHeader>
                  <CardTitle className="font-serif tracking-wider text-xl group-hover:text-cyan-400 transition-colors">
                    {p.title}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 font-light mt-2 leading-relaxed">
                    {p.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-xs tracking-wider text-zinc-500 bg-white/5 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
