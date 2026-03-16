"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Upload Your Plan",
    description: "Upload your goals in .txt, .md, or .pdf format. Our AI extracts actionable daily tasks automatically.",
    image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=800&auto=format&fit=crop"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Daily Checklist",
    description: "See your tasks for today and check them off as you complete them. Stay focused on what matters.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Earn Points",
    description: "Every completed task earns you points based on difficulty. Watch your score grow as you stay consistent.",
    image: ""
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    title: "Build Streaks",
    description: "Complete at least one task daily to keep your streak alive. Track your current and longest streaks.",
    image: ""
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    title: "Redeem Rewards",
    description: "Define your own rewards and redeem them with earned points. Netflix night? New gadget? You decide.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Visual Analytics",
    description: "GitHub-style heatmaps, weekly progress charts, and points growth graphs to visualize your journey.",
    image: ""
  },
];

const steps = [
  { step: "1", title: "Upload", description: "Drop your plan file and AI extracts your tasks", color: "from-blue-500 to-cyan-400" },
  { step: "2", title: "Check Off", description: "Complete daily tasks and earn points", color: "from-violet-500 to-purple-400" },
  { step: "3", title: "Get Rewarded", description: "Redeem points for rewards you define", color: "from-amber-400 to-orange-500" },
];

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">

      {/* Navbar - Fixed and blurred */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-foreground">AccTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/demo"
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full poiter-events-none -z-10"></div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold tracking-wide uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Meet Your New Accountability Partner
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight mb-8 leading-[1.05] text-foreground">
            Turn Your Plans <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">
              Into Daily Wins
            </span>
          </motion.h1>

          <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed">
            Upload your goals, let AI intelligently break them into actionable tasks, and stay motivated to celebrate every step forward.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/demo"
              className="px-8 py-4 bg-foreground text-background rounded-xl font-semibold text-lg hover:bg-foreground/90 transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              Start for free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-secondary/80 transition-all border border-border flex items-center justify-center"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 w-full relative rounded-[2.5rem] p-3 bg-gradient-to-b from-border to-transparent shadow-2xl"
        >
          <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="rounded-[2rem] overflow-hidden bg-muted aspect-video relative group">
            <img
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2940&auto=format&fit=crop"
              alt="App Dashboard Preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay to simulate app UI feeling */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/30 py-32 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Three Steps to Success
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground leading-relaxed">
              We've abstracted the complexity so you can focus strictly on what matters most: doing the work.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 reltative"
          >
            {steps.map((s, i) => (
              <motion.div variants={fadeIn} key={s.step} className="relative group">
                <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6 bg-gradient-to-br ${s.color} shadow-lg shadow-primary/20`}>
                    {s.step}
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features bento grid */}
      <section id="features" className="py-32 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Everything You Need
          </motion.h2>
          <motion.p variants={fadeIn} className="text-xl text-muted-foreground">
            A complete ecosystem to ensure your goals turn into daily realities.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              variants={fadeIn}
              key={feature.title}
              className={`group p-8 bg-card rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${feature.image ? 'md:col-span-2 lg:col-span-2 row-span-2' : ''}`}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 flex-grow">{feature.description}</p>

              {feature.image && (
                <div className="mt-auto w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 border border-black/5 rounded-2xl"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-32 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative bg-foreground text-background rounded-[3rem] p-16 overflow-hidden shadow-2xl"
        >
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
              Ready to Crush Your Goals?
            </h2>
            <p className="text-background/80 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of people who have significantly increased their daily output by rewarding themselves deliberately.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-10 py-5 bg-background text-foreground rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Start For Free Today
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/20 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">AccTracker</span>
          </div>
          <p className="text-muted-foreground font-medium text-sm">
            © {new Date().getFullYear()} Accountability Reward Tracker. Built with consistency in mind.
          </p>
        </div>
      </footer>
    </div>
  );
}
