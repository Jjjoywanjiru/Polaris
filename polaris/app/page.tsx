import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void text-bone">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-ghost bg-void/90 backdrop-blur-sm">
        <h1 className="font-heading text-xl tracking-widest">POLARIS</h1>
        <div className="flex items-center gap-8">
          <Link href="/shop" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">
            SHOP
          </Link>
          <Link href="/builder" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">
            BUILDER
          </Link>
          <Link href="/cart" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">
            CART
          </Link>
          <Link href="/login" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">
            ACCOUNT
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <p className="text-muted text-xs tracking-[0.4em] mb-6">
          HAND-CRAFTED — NAIROBI
        </p>
        <h2 className="font-heading text-6xl md:text-8xl text-bone mb-6 leading-none tracking-wider">
          POLARIS
        </h2>
        <p className="text-muted text-sm tracking-widest mb-12 max-w-md">
          Clothing forged in darkness. Each piece hand-drawn, each design singular.
        </p>
        <div className="flex gap-4">
          <Link
            href="/shop"
            className="bg-crimson hover:bg-crimson-light text-bone px-8 py-3 text-sm tracking-widest transition-colors font-medium"
          >
            SHOP NOW
          </Link>
          <Link
            href="/builder"
            className="border border-ghost hover:border-bone text-bone px-8 py-3 text-sm tracking-widest transition-colors"
          >
            BUILD YOURS
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <p className="text-muted text-xs tracking-widest">SCROLL</p>
          <div className="w-px h-12 bg-gradient-to-b from-muted to-transparent" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-8 py-24">
        <p className="text-muted text-xs tracking-[0.4em] text-center mb-16">
          THE COLLECTION
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {[
            { name: 'HOODIES', href: '/shop?category=hoodie' },
            { name: 'SWEATSUITS', href: '/shop?category=sweatsuit' },
            { name: 'TEES', href: '/shop?category=tshirt' },
            { name: 'BEANIES', href: '/shop?category=beanie' },
            { name: 'TIES', href: '/shop?category=tie' },
          ].map(cat => (
            <Link
              key={cat.name}
              href={cat.href}
              className="bg-obsidian border border-ghost hover:border-crimson text-center py-8 text-xs tracking-[0.3em] text-muted hover:text-bone transition-all duration-300"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Statement */}
      <section className="px-8 py-24 border-t border-ghost">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-heading text-2xl text-bone leading-relaxed mb-6">
            "Every stitch is intentional. Every design is drawn by hand."
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Polaris was born in Nairobi. Each piece starts as a sketch — 
            dragons, serpents, celestial maps — then becomes something you wear. 
            No two designs are exactly alike.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ghost px-8 py-8 flex items-center justify-between">
        <p className="font-heading text-sm tracking-widest text-muted">POLARIS</p>
        <p className="text-muted text-xs">© 2026 Polaris. Nairobi, Kenya.</p>
        <div className="flex gap-6">
          <Link href="/shop" className="text-muted hover:text-bone text-xs tracking-wide transition-colors">
            Shop
          </Link>
          <Link href="/login" className="text-muted hover:text-bone text-xs tracking-wide transition-colors">
            Account
          </Link>
        </div>
      </footer>

    </main>
  )
}