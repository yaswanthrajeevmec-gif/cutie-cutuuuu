import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Cutu 🎂" },
      { name: "description", content: "A little website for my Cutu — a journey through everything that makes you, you. Happy birthday." },
    ],
  }),
  component: Index,
});

// ---------- DATA ----------
type Stop = {
  year: string;
  title: string;
  body: string;
  emoji: string;
};

// Journey OF HER — birthday is about her
const JOURNEY: Stop[] = [
  {
    year: "Day 1",
    title: "The world got luckier",
    body: "Somewhere, someone whispered 'she's here' — and the rest of us were just waiting to meet you.",
    emoji: "👶",
  },
  {
    year: "Growing up",
    title: "Little Cutu",
    body: "Stubborn, sweet, sharp. The same things I love about you now, just smaller.",
    emoji: "🌷",
  },
  {
    year: "2013",
    title: "College — our paths crossed",
    body: "I was your senior. You were the junior who never let me win an argument. I never stood a chance.",
    emoji: "🎓",
  },
  {
    year: "12 years",
    title: "The long friendship",
    body: "Late-night calls, biriyani plans, you yelling at me to change my shirt. The slow magic of becoming everything to each other.",
    emoji: "💌",
  },
  {
    year: "May 20",
    title: "Us, officially",
    body: "We finally said it. Best decision either of us ever made.",
    emoji: "💞",
  },
  {
    year: "Today",
    title: "Happy Birthday, Cutu",
    body: "Another year of you in the world. There is no better gift than that. I love you.",
    emoji: "🎂",
  },
];

// ---------- COMPONENTS ----------
function FloatingHearts() {
  const hearts = useMemo(
    () => Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 9 + Math.random() * 9,
      size: 14 + Math.random() * 22,
      opacity: 0.25 + Math.random() * 0.4,
      char: ["♥","🎈","🌸","✨","🎂"][Math.floor(Math.random()*5)],
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
          {h.char}
        </span>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ImageSlot({ label, ratio = "4/3", hint }: { label: string; ratio?: string; hint?: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-dashed border-primary/30 bg-card/60 shadow-[var(--shadow-soft)] backdrop-blur"
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

// The road / journey component — winding SVG path with stops
function RoadJourney({ onMilestone }: { onMilestone: () => void }) {
  // Generate winding path
  const stops = JOURNEY.length;
  const segmentH = 320; // px per stop
  const totalH = segmentH * stops;
  const width = 600;
  const centerX = width / 2;

  // Build a smooth zig-zag path
  const points = JOURNEY.map((_, i) => {
    const y = i * segmentH + 140;
    const x = centerX + (i % 2 === 0 ? -160 : 160);
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${centerX} 40 Q ${centerX} 90 ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + p.y) / 2;
    return `${acc} C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <svg
        viewBox={`0 0 ${width} ${totalH + 80}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.14 80)" />
            <stop offset="50%" stopColor="oklch(0.65 0.18 15)" />
            <stop offset="100%" stopColor="oklch(0.55 0.19 15)" />
          </linearGradient>
        </defs>
        {/* Road shadow */}
        <path d={pathD} fill="none" stroke="oklch(0.55 0.19 15 / 0.15)" strokeWidth="38" strokeLinecap="round" />
        {/* Road */}
        <path d={pathD} fill="none" stroke="url(#road)" strokeWidth="22" strokeLinecap="round" />
        {/* Dashed center line */}
        <path
          d={pathD}
          fill="none"
          stroke="oklch(0.99 0.005 30)"
          strokeWidth="2"
          strokeDasharray="10 14"
          strokeLinecap="round"
        />
      </svg>

      {/* Stops positioned over the road */}
      <div className="relative" style={{ height: totalH + 80 }}>
        {JOURNEY.map((stop, i) => {
          const p = points[i];
          const leftSide = i % 2 === 0; // card goes on opposite side of dot
          return (
            <div key={i}>
              {/* Pin/dot on the road */}
              <button
                onClick={i === JOURNEY.length - 1 ? onMilestone : undefined}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(p.x / width) * 100}%`,
                  top: p.y,
                }}
                aria-label={stop.title}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-2xl shadow-[var(--shadow-glow)] ring-4 ring-primary transition hover:scale-110">
                  {stop.emoji}
                </span>
              </button>

              {/* Card on the opposite side */}
              <div
                className="absolute w-[44%] max-w-xs"
                style={{
                  top: p.y - 60,
                  [leftSide ? "right" : "left"]: "4%",
                }}
              >
                <div className="rounded-2xl border border-border bg-card/85 p-4 shadow-[var(--shadow-soft)] backdrop-blur sm:p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{stop.year}</div>
                  <h3 className="mt-1 font-[var(--font-display)] text-lg font-semibold leading-tight sm:text-xl">{stop.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{stop.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Start flag */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-3xl">🚩</div>
        {/* Finish */}
        <div className="absolute left-1/2 -translate-x-1/2 text-4xl" style={{ top: totalH + 30 }}>
          🎉
        </div>
      </div>
    </div>
  );
}

// Special: an elegant "reasons I love you" letter with a reveal-on-demand centerpiece
const REASONS: Array<{ n: string; text: ReactNode }> = [
  { n: "i.", text: <>The way you walk into a room and somehow rearrange the air in it.</> },
  { n: "ii.", text: <>How you argue like a lawyer over the smallest things — and how you're almost always right.</> },
  { n: "iii.", text: <>That you've kept me honest for twelve years, and gentle for one.</> },
  { n: "iv.", text: <>Your laugh. The real one. The one you try to hide in restaurants.</> },
  { n: "v.", text: <>The way you remember everything — every date, every promise, every shirt I shouldn't have worn.</> },
  { n: "vi.", text: <>How you love loudly and forgive quietly.</> },
  { n: "vii.", text: <>That you are, without trying, the most home thing I have ever known.</> },
];

const WHISPERS = [
  "you make ordinary tuesdays feel like something worth writing about.",
  "i'd recognize your footsteps before your voice.",
  "every good day of mine has you somewhere in it.",
  "you're the only person i tell things to twice — once to share, once to keep.",
  "if there's a next life, i'm finding you in college again.",
  "you make me want to be the version of me you already see.",
  "i love you in the way that doesn't get loud — it just stays.",
];

function ReasonsSection({ onBiriyani, onDress }: { onBiriyani: () => void; onDress: () => void }) {
  const [whisperIdx, setWhisperIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const nextWhisper = () => {
    setRevealed(true);
    setWhisperIdx((i) => (i + 1) % WHISPERS.length);
  };

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-28">
      <div className="mb-14 text-center">
        <p className="font-[var(--font-script)] text-3xl text-primary">a small love letter</p>
        <h2 className="mt-2 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">
          Reasons, in no particular order
        </h2>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-primary/40" />
          <span className="text-primary">✦</span>
          <span className="h-px w-12 bg-primary/40" />
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Letter / list */}
        <article className="relative rounded-2xl border border-border bg-[oklch(0.99_0.01_60)] p-8 shadow-[var(--shadow-soft)] sm:p-12">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/10" />
          <ol className="space-y-5">
            {REASONS.map((r, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-1 w-8 shrink-0 font-[var(--font-display)] text-sm italic text-primary">
                  {r.n}
                </span>
                <p className="font-[var(--font-display)] text-lg italic leading-relaxed text-foreground sm:text-xl">
                  {r.text}
                </p>
              </li>
            ))}
            <li className="flex gap-4">
              <span className="mt-1 w-8 shrink-0 font-[var(--font-display)] text-sm italic text-primary">viii.</span>
              <p className="font-[var(--font-display)] text-lg italic leading-relaxed text-foreground sm:text-xl">
                Your devotion to{" "}
                <button onClick={onBiriyani} className="underline decoration-dotted underline-offset-4 hover:text-primary">
                  kozhikode biriyani
                </button>
                {" "}— sacred, non-negotiable, and frankly, inspiring.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="mt-1 w-8 shrink-0 font-[var(--font-display)] text-sm italic text-primary">ix.</span>
              <p className="font-[var(--font-display)] text-lg italic leading-relaxed text-foreground sm:text-xl">
                The way you always tell me to{" "}
                <button onClick={onDress} className="underline decoration-dotted underline-offset-4 hover:text-primary">
                  wear something nice
                </button>
                {" "}— and how somehow, with you, I want to.
              </p>
            </li>
          </ol>

          <div className="mt-10 flex items-end justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">a partial list</p>
            <p className="font-[var(--font-script)] text-3xl text-primary">— Bubu</p>
          </div>
        </article>

        {/* The special thing: a whisper box */}
        <aside className="lg:sticky lg:top-8">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-[oklch(0.96_0.04_30)] to-[oklch(0.92_0.06_20)] p-8 shadow-[var(--shadow-glow)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />

            <p className="relative text-xs uppercase tracking-[0.3em] text-primary">a private line, for you</p>
            <h3 className="relative mt-2 font-[var(--font-display)] text-2xl font-semibold">
              Whisper of the moment
            </h3>

            <div className="relative mt-6 min-h-[140px] rounded-xl bg-card/80 p-5 backdrop-blur">
              {!revealed ? (
                <p className="font-[var(--font-script)] text-2xl text-muted-foreground">
                  press the button. i wrote some things only you should hear.
                </p>
              ) : (
                <p
                  key={whisperIdx}
                  className="font-[var(--font-script)] text-2xl text-foreground"
                  style={{ animation: "var(--animate-fade-up)" }}
                >
                  “{WHISPERS[whisperIdx]}”
                </p>
              )}
            </div>

            <button
              onClick={nextWhisper}
              className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
            >
              {revealed ? "another one →" : "whisper to me 🤍"}
            </button>

            <p className="relative mt-4 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
              {revealed ? `${whisperIdx + 1} / ${WHISPERS.length}` : `${WHISPERS.length} hidden inside`}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


function Index() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [showLetter, setShowLetter] = useState(false);
  const [dressClicks, setDressClicks] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  const find = (key: string, msg: string) => {
    setFound((s) => {
      if (s.has(key)) return s;
      const n = new Set(s);
      n.add(key);
      showToast(`✨ Secret ${n.size}/5 — ${msg}`);
      return n;
    });
  };

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  // Konami + type "cutu"
  useEffect(() => {
    const seq = ["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"];
    let buf: string[] = [];
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      buf = [...buf, e.key.toLowerCase()].slice(-seq.length);
      if (buf.join(",") === seq.join(",")) find("konami", "secret unlocked 🌹");
      if (e.key.length === 1) {
        typed = (typed + e.key.toLowerCase()).slice(-4);
        if (typed === "cutu") find("name", "I love you, Cutu 💞");
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

  const blowCandle = () => {
    setConfetti(true);
    find("cake", "make a wish 🕯️");
    setTimeout(() => setConfetti(false), 4000);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <FloatingHearts />

      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-[var(--shadow-glow)]">
          {toast}
        </div>
      )}

      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-40" aria-hidden>
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `confetti ${2 + Math.random() * 2}s linear ${Math.random()}s forwards`,
              }}
            >
              {["🎉","🎊","🌸","✨","💖"][i % 5]}
            </span>
          ))}
          <style>{`@keyframes confetti { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
        </div>
      )}

      {/* HERO */}
      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="font-[var(--font-script)] text-2xl text-primary/80 sm:text-3xl">happy birthday,</p>
        <h1 className="mt-2 font-[var(--font-display)] text-7xl font-bold leading-none tracking-tight text-foreground sm:text-9xl">
          Cutu
        </h1>
        <p className="mt-6 max-w-xl text-balance text-muted-foreground sm:text-lg">
          Another year of the most stubborn, beautiful, biriyani-loving human I know.
          This little corner of the internet is for you — a journey through everything that makes you, <em>you</em>.
        </p>

        {/* Cake */}
        <button
          onClick={blowCandle}
          className="mt-12 flex flex-col items-center transition hover:scale-105"
          aria-label="Blow the candle"
        >
          <span className="text-7xl drop-shadow-[0_8px_20px_rgba(255,100,100,0.4)]">🎂</span>
          <span className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">tap to blow the candle</span>
        </button>

        <button
          onClick={() => setShowLetter(true)}
          className="mt-10 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:scale-105 hover:shadow-[var(--shadow-glow)]"
        >
          Open my letter to you 💌
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-sm text-muted-foreground">↓ take the journey</div>
      </section>

      {/* JOURNEY ROAD */}
      <section className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="mb-16 text-center">
          <p className="font-[var(--font-script)] text-3xl text-primary">the road so far</p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">Your journey</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Every turn led to today. Follow the road — it's all the way to you.
          </p>
        </div>

        <RoadJourney onMilestone={() => find("road", "you reached the finish line 🎉")} />
      </section>

      {/* GALLERY */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="font-[var(--font-script)] text-3xl text-primary">you, in pictures</p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">The gallery</h2>
          <p className="mt-3 text-muted-foreground">I'll drop your photos into these slots.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <ImageSlot label="Little you" />
          <ImageSlot label="College days" ratio="3/4" />
          <ImageSlot label="That smile" />
          <ImageSlot label="All dressed up" ratio="3/4" />
          <ImageSlot label="Biriyani date" />
          <ImageSlot label="My favourite" />
        </div>
      </section>

      {/* REASONS — elegant letter style */}
      <ReasonsSection
        onBiriyani={() => find("biriyani", "the way to your heart 💘")}
        onDress={handleDressClick}
      />

      {/* SECRET HUNT */}
      <section className="relative mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="inline-block rounded-2xl border border-dashed border-primary/40 bg-card/60 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">birthday secret hunt</p>
          <p className="mt-2 font-[var(--font-script)] text-3xl text-primary">{found.size} / 5 found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            There are little secrets hiding on this page. Blow the candle, click suspicious words,
            reach the end of the road, type your nickname, try the Konami code… you'll know when you find them.
          </p>
        </div>
      </section>

      {/* hidden corner */}
      <button
        onClick={() => find("corner", "sneaky 🌙")}
        aria-label="secret"
        className="fixed bottom-3 right-3 z-40 h-6 w-6 rounded-full bg-primary/10 hover:bg-primary/40"
      />

      {/* FOOTER */}
      <footer className="relative mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="font-[var(--font-script)] text-4xl text-primary">forever your Bubu 💞</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Made with way too much love · happy birthday Cutu
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
              <p>Happy birthday, my love.</p>
              <p>Twelve years ago I had no idea the junior I kept teasing would one day become my whole world. And yet here we are — me, still trying to keep up with you.</p>
              <p>Thank you for the biriyani arguments, the "go change your shirt" looks, and every ordinary day you turn into something I'll remember forever.</p>
              <p>I hope this year is loud, full, soft where it needs to be, and exactly the kind of beautiful you deserve.</p>
              <p className="pt-3 font-[var(--font-script)] text-2xl text-primary">— Bubu</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
