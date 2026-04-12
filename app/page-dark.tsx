"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// --- SHADER MATERIAL FOR LIQUID BACKGROUND ---
const LiquidBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorBg: { value: new THREE.Color("#3B060A") },
    uColorGold: { value: new THREE.Color("#FEBA17") },
    uColorAccent: { value: new THREE.Color("#8A0000") },
    uScroll: { value: 0 },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime() * 0.4;
      // Smoother lerp for the shader movement
      const targetScroll = typeof window !== "undefined" ? window.scrollY / 2000 : 0;
      uniforms.uScroll.value = THREE.MathUtils.lerp(uniforms.uScroll.value, targetScroll, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 16, 16]} /> 
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uScroll;
          uniform vec3 uColorBg;
          uniform vec3 uColorGold;
          uniform vec3 uColorAccent;
          varying vec2 vUv;

          float noise(vec2 p) {
            return sin(p.x * 10.0 + uTime) * sin(p.y * 10.0 + uTime);
          }

          void main() {
            vec2 p = vUv;
            float movement = sin(uTime * 0.2 + uScroll);
            float n = noise(p + movement);
            n += noise(p * 2.0 - uTime * 0.1);
            vec3 color = mix(uColorBg, uColorGold, n * 0.5);
            color = mix(color, uColorAccent, sin(uScroll * 2.0) * 0.2);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};

// Interfaces
interface Testimonial { id: string; tag: string; text: string; }
interface Service { area: string; title: string; desc: string; items: string[]; badge?: string; }
interface Stat { value: string; label: string; }
interface Principle { num: string; title: string; body: string; }
interface MousePosition { x: number; y: number; }

const TESTIMONIALS: Testimonial[] = [
  { id: "anon_xxxxA", tag: "asset claim, digital trace", text: "Vouch for the 20K easy claim. 100% supportive throughout the whole deal, deadass professional. Digital Threat Trace was spot on too." },
  { id: "client_xxxxM", tag: "username claim, footprint cleanup", text: "Successfully claimed my desired handle — one everyone else failed on — in record time. Efficiency and professionalism was goated. Highly recommend for fast, secure acquisition." },
  { id: "anon_xxxx4", tag: "username claim, profile management", text: "Completed a lot of successful deals lately! Claimed a username and handled my profile management in 12 hours flat. No cap, the fastest in the game." },
  { id: "user_xxxx7", tag: "reputation fix, risk advisory", text: "10/10, goated max. Best for community reputation fixes and social media risk advisory. Claimed a username under an hour. Will definitely come back for more deals!" },
  { id: "crypto_xxxxZ", tag: "blockchain trace, threat elimination", text: "Paid the full advance for a Block Chain Trace and threat elimination. Impressed with constant coordination and results in under 24hrs. An absolute legend." },
  { id: "founder_xxxxK", tag: "dmca takedown, search suppression", text: "Sincere thanks for the DMCA takedowns and search result suppression. A beast in this business — anyone can work with them without any problems." },
  { id: "agency_xxxxP", tag: "premium asset claim", text: "Just closed a $15k IG generic claim that others failed to deliver for months. Top-tier provider, the absolute pinnacle of this industry." },
  { id: "pr_xxxxWQ", tag: "post removal, reputation fix", text: "Handled negative post removals and community reputation fixes in record time. Professionalism was 10/10, definitely the best in the game." },
];

const SERVICES: Service[] = [
  { area: "Core Services", title: "Digital Risk & Reputation Solutions", desc: "Comprehensive reputation management backed by six years of ethical, discreet digital risk consulting.", items: ["Negative & fake post removals, profile clean-ups", "Content moderation, risk advisory, and profile management", "DMCA takedowns & search result suppression", "Digital footprint clean-ups", "Negative review removals"], badge: "● New · Digital Trace" },
  { area: "Social Media Risk Advisory", title: "Platform Management", desc: "Profile management, content moderation, and digital risk guidance across all major platforms.", items: ["Instagram, X, TikTok, YouTube, Reddit, WhatsApp", "Risk profiling and threat identification", "Real-time monitoring and response"] },
  { area: "Legal & Technical", title: "Fraudulent Takedowns", desc: "Enforce your rights with fast, compliant removal of infringing content anywhere online.", items: ["Copyright infringement removals", "Defamation and harassment content", "Impersonation account elimination"] },
  { area: "Search & Visibility", title: "Search Result Suppression", desc: "Strategically suppress harmful or damaging results and reclaim your narrative online.", items: ["Google & Bing result management", "Reputation SEO and counter-content", "Entity knowledge panel corrections"] },
];

const STATS: Stat[] = [
  { value: "$4.5M+", label: "Closed Deals" },
  { value: "6+", label: "Years Active" },
  { value: "All", label: "Major Platforms" },
  { value: "100%", label: "Ethical Practice" },
];

const PRINCIPLES: Principle[] = [
  { num: "01", title: "Ethics.", body: "Clear, lawful, and client-first decisions in every engagement." },
  { num: "02", title: "Confidentiality.", body: "Private process with strictly controlled access and absolute discretion." },
  { num: "03", title: "Precision.", body: "Fast actions, measurable outcomes, zero ambiguity." },
];

export default function DominateSite(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const [showWaitlist, setShowWaitlist] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      // Use requestAnimationFrame for smoother cursor updates
      window.requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation
      if (heroTitleRef.current) {
        gsap.from(heroTitleRef.current.querySelectorAll('.hero-line'), {
          y: 100,
          opacity: 0,
          rotateX: -30,
          stagger: 0.1,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.2
        });
      }

      // Float animations
      gsap.to(".float-1", { y: -30, x: 20, rotate: 5, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".float-2", { y: 20, x: -15, rotate: -5, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });

      // Theme morphing
      const sections = gsap.utils.toArray<HTMLElement>(".story-section");
      sections.forEach((section) => {
        const isYellowTheme = section.classList.contains("theme-yellow");
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => gsap.to("body", { backgroundColor: isYellowTheme ? "#4E1F00" : "#3B060A", duration: 0.8 }),
          onEnterBack: () => gsap.to("body", { backgroundColor: isYellowTheme ? "#4E1F00" : "#3B060A", duration: 0.8 }),
        });
      });

      // Parallax - Optimized
      gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((elem) => {
        gsap.to(elem, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: elem, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      // Staggered Reveals
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { 
            trigger: el, 
            start: "top 90%", 
            toggleActions: "play none none reverse",
            fastScrollEnd: true 
          },
        });
      });

      // Ticker animation
      const track = document.querySelector<HTMLElement>(".testimonial-track");
      if (track) {
        gsap.to(track, {
          xPercent: -50,
          duration: 50,
          repeat: -1,
          ease: "none",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#3B060A] transition-colors duration-700 overflow-x-hidden font-sans selection:bg-[#F5AD18] selection:text-[#3B060A]">
      
      {/* THREE.JS BACKGROUND LAYER - Optimized for smoothness */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 2]} 
        >
          <LiquidBackground />
        </Canvas>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,173,24,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,173,24,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#3B060A_95%)]" />
      </div>
      
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-[100] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'5\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')]" />

      {/* Custom Cursor - Using Transform for GPU acceleration */}
      <div 
        className="fixed w-8 h-8 border border-[#F5AD18]/30 rounded-full pointer-events-none z-[110] hidden md:block mix-blend-difference will-change-transform"
        style={{ 
          transform: `translate3d(${mousePos.x - 16}px, ${mousePos.y - 16}px, 0)`,
          transition: 'transform 0.15s ease-out'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[90] h-20 flex items-center justify-between px-6 md:px-12 backdrop-blur-sm">
        <div className="font-serif text-2xl font-bold text-[#F5AD18] hover:scale-105 transition-transform cursor-pointer">
          Dominate.
        </div>
        <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] text-[#F5AD18]">
          {['About', 'Services', 'Vouches'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:opacity-60 transition-opacity relative group">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F5AD18] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
      </nav>

      <main className="relative z-10">
        {/* SECTION 1: HERO */}
        <section className="story-section min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20">
          <div className="max-w-7xl">
            <h1 ref={heroTitleRef} className="font-serif text-[12vw] md:text-[10vw] font-bold leading-[0.8] uppercase tracking-tighter">
              <div className="hero-line block overflow-hidden">Results</div>
              <div className="hero-line block overflow-hidden italic text-[#FEBA17]">That Truly</div>
              <div className="hero-line block overflow-hidden">Dominate.</div>
            </h1>
            <div className="mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <p className="font-serif italic text-lg md:text-2xl text-[#F5AD18]/60 max-w-xl">
                Elite digital protection for high-profile entities. We resolve vulnerabilities and actively defend your online presence.
              </p>
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 border border-[#F5AD18]/30 rounded-full flex items-center justify-center animate-spin-slow">
                    <svg className="w-6 h-6 text-[#FEBA17]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
                 <p className="text-[10px] uppercase font-bold tracking-widest leading-tight">Protocol Active <br/> Since 2019</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PRINCIPLES */}
        <section id="about" className="story-section theme-yellow min-h-screen bg-[#4E1F00] text-[#F5AD18] py-24 px-6 md:px-12 flex items-center">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8 ">
              <div className="reveal">
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold mb-6 opacity-60 flex items-center gap-4">
                  <span className="w-8 h-px bg-[#F5AD18]/40"></span> The Standard
                </p>
                <h2 className="font-serif text-6xl md:text-6xl lg:text-6xl font-medium leading-none">
                  Built on <em className="italic opacity-70 font-serif">trust.</em>
                </h2>
              </div>
              <div className="reveal md:max-w-xs pt-8">
                <p className="text-sm md:text-base leading-relaxed opacity-60 text-right md:text-left">
                  We operate in the shadows, delivering outcomes with absolute precision and unyielding confidentiality.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2 ">
              {PRINCIPLES.map((p) => (
                <div key={p.num} className="principle-card reveal p-8 md:p-12 bg-[#3B060A]/20 border border-[#F5AD18]/10 rounded-sm hover:bg-[#3B060A]/40 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute -bottom-4 -right-4 text-9xl font-serif opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">{p.num}</div>
                  <div className="flex items-center gap-4 mb-12">
                    <span className="font-serif text-sm opacity-50">[{p.num}]</span>
                    <div className="h-px w-12 bg-[#F5AD18]/20 group-hover:w-20 transition-all duration-700"></div>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl mb-6">{p.title}</h3>
                  <p className="text-sm md:text-base leading-relaxed opacity-60 group-hover:opacity-90 transition-opacity">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: STATS & SERVICES */}
        <section className="story-section py-22 px-6 md:px-12 ">
          <div className="lg:mx-50 grid grid-cols-1 lg:grid-cols-2 gap-16 bg-[#3B060A] lg:gap-4 border border-[#F5AD18]/10 items-start">
            <div className="reveal space-y-16 p-4">
              <div className="relative text-[#F5AD18]/80 leading-relaxed text-lg font-serif italic max-w-xl">
                <span className="float-left text-7xl font-serif font-bold text-[#F5AD18] leading-[0.8] mr-4 mt-4">S</span>
                ince 2019, Dominate has empowered influencers, entrepreneurs, and businesses to strengthen their online presence through premium social media solutions...
                <br /><br />
                With seven figures in closed deals, we are a trusted partner focused on protecting brand reputation.
              </div>
              <div className="grid grid-cols-2 border border-[#F5AD18]/10 rounded-sm overflow-hidden">
                {STATS.map((s, i) => (
                  <div key={s.label} className={`p-10 border-[#F5AD18]/10 ${i === 0 ? "border-r border-b" : ""} ${i === 1 ? "border-b" : ""} ${i === 2 ? "border-r" : ""} hover:bg-[#F5AD18]/5 transition-colors`}>
                    <div className="font-serif text-4xl text-[#FEBA17] font-bold mb-2">{s.value}</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#F5AD18]/40 font-bold">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal relative p-4 border-l border-[#F5AD18]/10">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 text-[#F5AD18]/60 flex items-center gap-4">
                <span className="w-8 h-px bg-[#F5AD18]/40"></span> Since 2019 · Dominate
              </p>
              <h2 className="font-serif text-6xl md:text-8xl font-medium leading-[1.1] text-[#F5AD18]">
                We <br /> <em className="italic opacity-80 font-serif">Dominate</em> <br /> the Digital Arena.
              </h2>
              <div className="mt-12 text-9xl font-serif font-bold opacity-[0.05] select-none pointer-events-none" style={{ WebkitTextStroke: '1px #F5AD18' }}>2019</div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SERVICES */}
        <section id="services" className="story-section theme-yellow bg-[#4E1F00] text-[#F5AD18] py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="reveal font-serif text-4xl md:text-6xl lg:text-8xl font-semibold leading-none mb-20">
              Reputation <br/> <em className="italic opacity-60">Management.</em>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#F5AD18]/10 rounded-sm overflow-hidden bg-[#3B060A]/20">
              <div className="lg:col-span-5 p-4 md:p-8 bg-[#F8F4E1]/90 text-[#3B060A] border-r border-[#F5AD18]/10 relative group">
                <div className="absolute top-0 left-0 w-1 h-20 bg-[#C83F12]"></div>
                <div className="reveal">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 opacity-60">{SERVICES[0].area}</p>
                  <h3 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-8">Digital Risk <br /> & Reputation <br /> Solutions</h3>
                  <p className="text-sm md:text-base opacity-80 leading-relaxed mb-12">{SERVICES[0].desc}</p>
                  <ul className="space-y-2">
                    {SERVICES[0].items.map((item) => (
                      <li key={item} className="text-xs md:text-sm flex gap-4 items-start group-hover:translate-x-1 transition-transform">
                        <span className="text-[#C83F12]">→</span><span className="opacity-90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="reveal mt-10 space-y-2">
                  <div className="inline-flex items-center gap-3 bg-[#3B060A] text-[#F5AD18] px-4 py-2 text-[9px] uppercase tracking-widest font-bold rounded-sm">
                    <span className="w-1.5 h-1.5 bg-[#FEBA17] rounded-full animate-pulse"></span>{SERVICES[0].badge}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col divide-y divide-[#F5AD18]/10">
                {SERVICES.slice(1).map((s) => (
                  <div key={s.title} className="reveal p-8 hover:bg-[#F5AD18]/5 transition-all duration-500 group cursor-default">
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold mb-2 text-[#F5AD18]/40 group-hover:text-[#F5AD18] transition-colors">{s.area}</p>
                    <h4 className="font-serif text-2xl md:text-3xl text-[#F5AD18] mb-4 group-hover:translate-x-2 transition-transform duration-500">{s.title}</h4>
                    <p className="text-sm text-[#F5AD18]/50 leading-relaxed max-w-lg">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: VOUCHES */}
        <section id="vouches" className="story-section theme-yellow bg-[#4E1F00] py-20 md:py-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <h2 className="reveal font-serif text-4xl md:text-6xl text-[#F5AD18]"><em>Vouches.</em></h2>
          </div>
          <div className="testimonial-track flex gap-8 whitespace-nowrap will-change-transform">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[320px] md:w-[400px] p-8 md:p-10 bg-[#3B060A] text-[#F5AD18] rounded-3xl hover:scale-105 transition-transform duration-300 whitespace-normal">
                <div className="text-[10px] uppercase tracking-[0.2em] mb-4 opacity-50">{t.tag}</div>
                <p className="font-serif italic text-lg md:text-xl mb-8 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold">
                  <span>{t.id}</span><span className="text-[#FEBA17]">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: CONTACT */}
        <section id="contact" className="story-section theme-brown min-h-screen bg-[#3B060A] flex items-center justify-center px-6 py-20 relative border-t border-[#F5AD18]/10">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-end border border-[#F5AD18]/10 rounded-sm p-8 md:p-12 ">
            <div className="text-left">
              <p className="reveal text-[10px] uppercase tracking-[0.5em] font-bold text-[#F5AD18]/40 mb-8 flex items-center gap-4">
                <span className="w-8 h-px bg-[#F5AD18]/40"></span> [ Initiate Contact ]
              </p>
              <h2 className="reveal font-serif text-5xl md:text-7xl lg:text-9xl text-[#F5AD18] font-bold leading-[0.9] mb-8">Need <br/> discreet <br/> support?</h2>
              <p className="reveal text-lg md:text-xl text-[#F5AD18]/60 font-serif italic max-w-md">We assess risk, align strategy, and move fast.</p>
            </div>
            <div className="reveal flex flex-col md:flex-row gap-4 lg:justify-end">
              <button onClick={() => setShowWaitlist(true)} className="group bg-[#F5AD18] text-[#3B060A] px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-[11px] hover:shadow-[0_0_30px_rgba(245,173,24,0.3)] transition-all flex items-center justify-center gap-3">
                Schedule Call <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="border border-[#F5AD18]/20 text-[#F5AD18] px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-[11px] hover:bg-[#F5AD18]/5 transition-all">View Services</button>
            </div>
          </div>
          <footer className="absolute bottom-10 left-0 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-[0.4em] text-[#F5AD18]/20">
            <p>&copy; 2026 Dominate & Co. &bull; Premium Risk Consulting</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-[#F5AD18]/50 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#F5AD18]/50 transition-colors">Terms of Service</a>
            </div>
          </footer>
        </section>
      </main>

      {/* WAITLIST MODAL */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-[#3B060A]/90 backdrop-blur-md z-[200] flex items-center justify-center p-6" onClick={() => setShowWaitlist(false)}>
          <div className="relative bg-[#3B060A] border-4 border-[#F5AD18]/10 rounded-lg p-10 md:p-14 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-6 right-6 text-[#F5AD18]/40 hover:text-[#F5AD18]" onClick={() => setShowWaitlist(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#F5AD18] mb-2">Join the Waitlist</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#F5AD18]/40 mb-10 italic">Secure your spot early.</p>
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setShowWaitlist(false); }}>
              <div className="group">
                <label className="block text-[9px] uppercase font-bold text-[#F5AD18]/30 mb-3 tracking-widest">Name / Company</label>
                <input type="text" placeholder="Acme Corp" className="w-full bg-black/20 border-2 border-[#F5AD18]/10 rounded-sm p-4 text-[#FEBA17] focus:border-[#F5AD18]/40 outline-none" required />
              </div>
              <div className="group">
                <label className="block text-[9px] uppercase font-bold text-[#F5AD18]/30 mb-3 tracking-widest">Gmail / Email</label>
                <input type="email" placeholder="your@gmail.com" className="w-full bg-black/20 border-2 border-[#F5AD18]/10 rounded-sm p-4 text-[#FEBA17] focus:border-[#F5AD18]/40 outline-none" required />
              </div>
              <button type="submit" className="w-full bg-[#F8F4E1]/90 text-[#3B060A] py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#F8F4E1] transition-all">Join Now</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}