import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cutu & Bubu — Happy 1st Anniversary" },
      { name: "description", content: "Our story: from college seniors-and-juniors to forever. Happy first anniversary, Cutu." },
    ],
  }),
  component: Index,
});

// ---------- DATA ----------
const ANNIVERSARY = new Date("2025-05-20T00:00:00");
// You started dating May 20. "12 years over" — friendship started ~2013.
const FRIENDSHIP_START = new Date("2013-08-01T00:00:00");

type TimelineItem = {
  date: string;
  title: string;
  body: string;
  emoji: string;
};

const TIMELINE: TimelineItem[] = [
  {
    date: "College Days",
    title: "Senior meets junior",
    body: "I was your senior. You probably thought I was annoying. (You were right.)",
    emoji: "🎓",
  },
  {
    date: "The In-Between",
    title: "12 years of slow magic",
    body: "Friendship, late-night calls, biriyani runs, dressing up for nothing — laying the foundation of us.",
    emoji: "💌",
  },
  {
    date: "May 20",
    title: "The day everything changed",
    body: "We finally said it out loud. Best decision either of us ever made.",
    emoji: "💍",
  },
  {
    date: "Today",
    title: "Happy 1st Anniversary, Cutu",
    body: "One year as us. A thousand more loading. Always your Bubu.",
    emoji: "💖",
  },
];

// ---------- HELPERS ----------
function useCountup(target: Date) {
  const [t, setT] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setT(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, t - target.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

// ---------- COMPONENTS ----------
function FloatingHearts() {
  const hearts = useMemo(
    () => Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 8,
      size: 14 + Math.random() * 22,
      opacity: 0.25 + Math.random() * 0.4,
    })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-40px]"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            opacity: h.opacity,
            animation: `floatUp ${h.duration}s linear ${h.delay}s infinite`,
          }}
        >
          ♥
        </span>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ImageSlot({ label, ratio = "4/3", hint }: { label: string; ratio?: string; hint?: string }) {
  return (
    <div
      className="group relative w-full overflow-hidden rounded-xl border border-dashed border-primary/30 bg-card/60 shadow-[var(--shadow-soft)] backdrop-blur"
      style={{ aspectRatio: ratio }}
      data-image-slot={label}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
        <span className="text-3xl">📷</span>
        <p className="font-[var(--font-script)] text-2xl text-primary">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

function Countup() {
  const { days, hours, mins, secs } = useCountup(ANNIVERSARY);
  const items = [
    { v: days, l: "Days" },
    { v: hours, l: "Hours" },
    { v: mins, l: "Minutes" },
    { v: secs, l: "Seconds" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {items.map((it) => (
        <div key={it.l} className="rounded-xl bg-card/80 px-2 py-4 text-center shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="font-[var(--font-display)] text-2xl font-bold text-primary sm:text-4xl">{String(it.v).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">{it.l}</div>
        </div>
      ))}
    </div>
  );
}

function EasterEgg({ found, onFind }: { found: Set<string>; onFind: (k: string) => void }) {
  return (
    <button
      onClick={() => onFind("biriyani")}
      className={`group inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition ${
        found.has("biriyani") ? "bg-gold/40" : "hover:bg-gold/20"
      }`}
      title="Psst..."
    >
      kozhikode biriyani 🍛
    </button>
  );
}

// ---------- PAGE ----------
function Index() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [konami, setKonami] = useState<string[]>([]);
  const [showLetter, setShowLetter] = useState(false);
  const [dressClicks, setDressClicks] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const find = (key: string, msg: string) => {
    setFound((s) => {
      if (s.has(key)) return s;
      const n = new Set(s);
      n.add(key);
      showToast(`✨ Easter egg ${n.size}/5 — ${msg}`);
      return n;
    });
  };

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  // Konami code easter egg: ↑↑↓↓←→←→BA
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    const onKey = (e: KeyboardEvent) => {
      setKonami((prev) => {
        const next = [...prev, e.key.toLowerCase()].slice(-seq.length);
        if (next.join(",") === seq.join(",")) find("konami", "secret unlocked 🌹");
        return next;
      });
      // Type "cutu" anywhere
      if (e.key.length === 1) {
        setKonami((prev) => {
          const last = prev.concat(e.key.toLowerCase()).slice(-4).join("");
          if (last === "cutu") find("name", "I love you, Cutu 💞");
          return prev;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleDressClick = () => {
    const n = dressClicks + 1;
    setDressClicks(n);
    if (n === 5) find("dress", "Yes ma'am, wearing the good shirt 👔");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <FloatingHearts />

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-[var(--shadow-glow)]">
          {toast}
        </div>
      )}

      {/* HERO */}
      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="font-[var(--font-script)] text-2xl text-primary/80 sm:text-3xl">happy first anniversary,</p>
        <h1 className="mt-2 font-[var(--font-display)] text-6xl font-bold leading-none tracking-tight text-foreground sm:text-8xl md:text-9xl">
          Cutu <span className="font-[var(--font-script)] italic text-primary">&</span> Bubu
        </h1>
        <p className="mt-6 max-w-xl text-balance text-muted-foreground sm:text-lg">
          12 years of knowing you. 1 year of <em>us</em>. A little website
          for a love that's been a long time coming.
        </p>

        <div className="mt-10 w-full max-w-md">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">together since may 20</p>
          <Countup />
        </div>

        <button
          onClick={() => setShowLetter(true)}
          className="mt-10 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:scale-105 hover:shadow-[var(--shadow-glow)]"
        >
          Open my letter to you 💌
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">↓ scroll</div>
      </section>

      {/* STORY / TIMELINE */}
      <section className="relative mx-auto max-w-5xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="font-[var(--font-script)] text-3xl text-primary">our story</p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">A journey, not a moment</h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-accent to-primary/20 md:left-1/2 md:block" />
          <div className="space-y-12">
            {TIMELINE.map((t, i) => (
              <div key={i} className={`grid items-center gap-6 md:grid-cols-2 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                <div className="md:[direction:ltr]">
                  <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                      <span className="text-xl">{t.emoji}</span>{t.date}
                    </div>
                    <h3 className="font-[var(--font-display)] text-2xl font-semibold">{t.title}</h3>
                    <p className="mt-2 text-muted-foreground">{t.body}</p>
                  </div>
                </div>
                <div className="md:[direction:ltr]">
                  <ImageSlot label={`Memory ${i + 1}`} hint="(I'll add this photo soon)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="font-[var(--font-script)] text-3xl text-primary">us, in pictures</p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">The gallery</h2>
          <p className="mt-3 text-muted-foreground">Drop in photos when you're ready — these slots will hold them.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <ImageSlot label="First photo" />
          <ImageSlot label="That trip" ratio="3/4" />
          <ImageSlot label="Silly one" />
          <ImageSlot label="Dressed up" ratio="3/4" />
          <ImageSlot label="Biriyani date" />
          <ImageSlot label="Just us" />
        </div>
      </section>

      {/* LITTLE THINGS */}
      <section className="relative mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="font-[var(--font-script)] text-3xl text-primary">the little things</p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">Things I love about you</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { e: "🍛", t: "Your love for ", a: <EasterEgg found={found} onFind={(k) => find(k, "the way to your heart 💘")} /> },
            { e: "👗", t: "How you always tell me to ", a: <button onClick={handleDressClick} className="underline decoration-dotted hover:text-primary">wear something nice</button> },
            { e: "📞", t: "Late-night calls that turned into mornings", a: null },
            { e: "😤", t: "The way you fight with me and then feed me", a: null },
            { e: "🌧️", t: "Sharing one umbrella even when there are two", a: null },
            { e: "🫶", t: "Just being you — Cutu", a: null },
          ].map((x, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
              <div className="mb-3 text-3xl">{x.e}</div>
              <p className="text-foreground">{x.t}{x.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EASTER EGG TRACKER */}
      <section className="relative mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="inline-block rounded-2xl border border-dashed border-primary/40 bg-card/60 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">secret hunt</p>
          <p className="mt-2 font-[var(--font-script)] text-3xl text-primary">{found.size} / 5 found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            There are 5 hidden things on this page. Click the heart, click suspicious words, try the Konami code,
            type my name for you, and click the page somewhere… you'll know when you find them.
          </p>
          <button
            onClick={() => find("heart", "you found the heartbeat ♥")}
            className="mt-4 text-4xl"
            style={{ animation: "var(--animate-heart)" }}
            aria-label="heart"
          >
            ❤️
          </button>
        </div>
      </section>

      {/* Hidden corner egg */}
      <button
        onClick={() => find("corner", "sneaky 🌙")}
        aria-label="secret"
        className="fixed bottom-3 right-3 z-40 h-6 w-6 rounded-full bg-primary/10 hover:bg-primary/40"
      />

      {/* FOOTER */}
      <footer className="relative mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="font-[var(--font-script)] text-4xl text-primary">forever your Bubu 💞</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Built with way too much love · {new Date().getFullYear()}
        </p>
      </footer>

      {/* LETTER MODAL */}
      {showLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setShowLetter(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-8 shadow-[var(--shadow-glow)]"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "var(--animate-fade-up)" }}
          >
            <button onClick={() => setShowLetter(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">✕</button>
            <p className="font-[var(--font-script)] text-3xl text-primary">My Cutu,</p>
            <div className="mt-4 space-y-3 text-foreground">
              <p>Twelve years ago I had no idea the junior I kept teasing would one day become my whole world.</p>
              <p>One year ago today, we stopped pretending we were just friends. Best yes I've ever said.</p>
              <p>Thank you for the biriyani arguments, the "go change your shirt" looks, and every single ordinary day that you make extraordinary.</p>
              <p>Here's to the next 12. And the 12 after that.</p>
              <p className="pt-3 font-[var(--font-script)] text-2xl text-primary">— Bubu</p>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} />
    </main>
  );
}
