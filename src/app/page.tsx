import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-base">fitness_center</span>
            </div>
            <span className="font-bold tracking-tight text-lg">HUNDEE</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8 font-semibold text-sm">
            <a href="#features" className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</a>
            <Link 
              href="/signup" 
              className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-xs md:text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden z-10">
        <div className="max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic mb-6 leading-tight">
            Elevate Your <span className="text-primary italic">Fitness</span> <br />
            With Mindful Precision
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience a new era of wellness tracking. Intelligent workout planning, 
            social integration, and precise nutrition monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-center"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-muted border border-border text-foreground px-8 py-4 rounded-full font-bold text-sm hover:bg-accent transition-all text-center"
            >
              Member Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-24 border-t border-border relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic mb-4">Functional Aesthetics</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base">Designed for the modern athlete</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Intelligent Planning",
                desc: "Custom workout schedules based on your available equipment and goals.",
                icon: "fitness_center",
                color: "text-primary bg-primary/10 border-primary/20"
              },
              {
                title: "Social Sync",
                desc: "Seamless integration with LINE chatbot for effortless logging and status tracking.",
                icon: "sync_alt",
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              },
              {
                title: "Nutrition Focus",
                desc: "Track your intake and performance with clear, minimalist visualizations.",
                icon: "restaurant_menu",
                color: "text-sky-400 bg-sky-500/10 border-sky-500/20"
              }
            ].map((f) => (
              <div key={f.title} className="glass-card p-8 rounded-3xl border border-border hover:border-primary/20 transition-all group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${f.color}`}>
                  <span className="material-symbols-outlined text-xl">{f.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">
              <span className="material-symbols-outlined text-sm">fitness_center</span>
            </div>
            <span className="font-bold tracking-tight uppercase text-xs">HUNDEE</span>
          </div>
          <p className="text-muted-foreground text-center text-xs">
            © 2026 Hundee. All rights reserved.
          </p>
          <div className="flex gap-6 text-muted-foreground">
            <Link href="/terms-of-service" className="hover:text-primary transition-colors text-xs">Terms of Service</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors text-xs">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
