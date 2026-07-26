import { useState, useEffect, useRef } from "react";
import { Bookmark, Heart, Share, Info, LayoutGrid, BarChart2, GraduationCap, ChevronLeft, ChevronRight, X, Download, Upload } from "lucide-react";

// ---- MOCK DATA (this is the shape real notes will be converted into) ----
const MOCK_CARDS = [
  {
    id: "c1",
    topic: "What is Product Management",
    mnemonic: "BTC",
    answer:
      "A PM's job is to bring out business impact while utilizing all available resources in the best way possible, to outline and deliver the most impactful consumer problem.",
    framework: [
      "Business → viability",
      "Technology → feasibility",
      "Consumer → usability",
    ],
    tags: ["PM Basics"],
    color: "#E8C4C4",
  },
  {
    id: "c2",
    topic: "What is a PRD",
    mnemonic: "WWH",
    answer:
      "A PRD aligns everyone on what we're building, why it matters, and how success is measured, before a single line of code is written.",
    framework: [
      "What → problem statement + scope",
      "Why → user/business justification",
      "How → success metrics + requirements",
    ],
    tags: ["PM Basics"],
    color: "#D8C4E8",
  },
  {
    id: "c3",
    topic: "Product Differentiation",
    mnemonic: "",
    answer:
      "Differentiation isn't just features, it's owning a position in the user's mind that competitors can't easily copy or credibly claim.",
    framework: [
      "Functional edge → does it do something others don't",
      "Emotional edge → does it feel different to use",
      "Defensibility → can it be copied in a quarter",
    ],
    tags: ["PM Basics"],
    color: "#C4D8E8",
  },
  {
    id: "c4",
    topic: "Why We Need RAG",
    mnemonic: "FGC",
    answer:
      "A model's knowledge is frozen at training time and it can hallucinate on facts it never saw. RAG grounds answers in real, current documents instead.",
    framework: [
      "Frozen knowledge → model can't know what happened after training",
      "Grounding → retrieval pulls real facts before answering",
      "Cost → cheaper than fine-tuning every time knowledge changes",
    ],
    tags: ["AI & Agents"],
    color: "#C4E8D0",
  },
  {
    id: "c5",
    topic: "5 Things for a Roadmap",
    mnemonic: "OPTIC",
    answer:
      "A roadmap is a communication tool first, a plan second. It needs to survive contact with reality without losing trust.",
    framework: [
      "Outcomes over output → tied to goals, not just features",
      "Prioritized → ruthless, not everything fits",
      "Time-boxed loosely → now/next/later beats fixed dates",
      "Input from all sides → eng, design, sales, support",
      "Communicated often → a roadmap no one's seen is useless",
    ],
    tags: ["PM Basics"],
    color: "#E8DCC4",
  },
];

const TAG_COLORS = {
  "PM Basics": "#B08968",
  "AI & Agents": "#5B8A72",
};

export default function FlashcardApp() {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [view, setView] = useState("card"); // card | grid
  const [activeTag, setActiveTag] = useState("All");
  const [notesOpen, setNotesOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const fileInputRef = useRef(null);

  const tags = ["All", ...new Set(MOCK_CARDS.map((c) => c.tags[0]))];

  const filteredCards =
    activeTag === "All" ? cards : cards.filter((c) => c.tags.includes(activeTag));

  const card = filteredCards[index] || filteredCards[0];

  // Load saved bookmarks/notes from localStorage (persists on this device/browser)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("flashcards:state");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCards((prev) => prev.map((c) => ({ ...c, ...(parsed[c.id] || {}) })));
      }
      const savedDeck = localStorage.getItem("flashcards:deck");
      if (savedDeck) {
        const parsedDeck = JSON.parse(savedDeck);
        if (Array.isArray(parsedDeck) && parsedDeck.length) {
          setCards(parsedDeck);
        }
      }
    } catch (e) {
      // no saved state yet, that's fine
    }
    setLoaded(true);
  }, []);

  // Persist the whole deck (including bookmarks/notes/likes) whenever it changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("flashcards:deck", JSON.stringify(cards));
    } catch (e) {
      // storage full or unavailable, fail silently
    }
  }, [cards, loaded]);

  function updateCard(id, patch) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function handleExport() {
    const payload = {
      exportedAt: new Date().toISOString(),
      cards,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flashcard-deck.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const incoming = Array.isArray(parsed) ? parsed : parsed.cards;
        if (!Array.isArray(incoming)) throw new Error("bad shape");
        const cleaned = incoming.map((c, i) => ({
          id: c.id || `imported-${Date.now()}-${i}`,
          topic: c.topic || "Untitled",
          mnemonic: c.mnemonic || "",
          answer: c.answer || "",
          framework: Array.isArray(c.framework) ? c.framework : [],
          tags: Array.isArray(c.tags) && c.tags.length ? c.tags : ["Imported"],
          color: c.color || "#D8D8D8",
          saved: !!c.saved,
          liked: !!c.liked,
          myNotes: c.myNotes || "",
        }));
        setCards(cleaned);
        setIndex(0);
        setActiveTag("All");
        setImportMsg(`Imported ${cleaned.length} cards`);
        setTimeout(() => setImportMsg(""), 3000);
      } catch (err) {
        setImportMsg("Couldn't read that file, check it's a valid export");
        setTimeout(() => setImportMsg(""), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function goNext() {
    setFlipped(false);
    setNotesOpen(false);
    setIndex((i) => (i + 1) % filteredCards.length);
  }

  function goPrev() {
    setFlipped(false);
    setNotesOpen(false);
    setIndex((i) => (i - 1 + filteredCards.length) % filteredCards.length);
  }

  if (!card) return null;

  return (
    <div
      className="min-h-screen w-full flex flex-col transition-colors duration-500"
      style={{ backgroundColor: card.color }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex gap-2 flex-wrap">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTag(t);
                setIndex(0);
                setFlipped(false);
              }}
              className="px-3 py-1 rounded-full text-xs font-medium transition-opacity"
              style={{
                backgroundColor:
                  activeTag === t ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.5)",
                color: activeTag === t ? "#fff" : "#3a3a3a",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            title="Export deck as JSON"
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          >
            <Download size={18} color="#fff" />
          </button>
          <button
            onClick={handleImportClick}
            title="Import a deck JSON"
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          >
            <Upload size={18} color="#fff" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            onClick={() => setView(view === "card" ? "grid" : "card")}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          >
            <LayoutGrid size={18} color="#fff" />
          </button>
        </div>
      </div>

      {importMsg && (
        <div className="mx-6 mt-3 px-4 py-2 rounded-lg bg-black/70 text-white text-xs text-center">
          {importMsg}
        </div>
      )}

      {view === "grid" ? (
        <div className="flex-1 px-6 py-8 grid grid-cols-2 gap-4 content-start">
          {filteredCards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setIndex(i);
                setView("card");
                setFlipped(false);
              }}
              className="rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-transform"
              style={{ backgroundColor: c.color }}
            >
              <div className="text-sm font-semibold text-gray-800 leading-snug">
                {c.topic}
              </div>
              {c.mnemonic && (
                <div className="text-[10px] mt-2 font-mono tracking-wide text-gray-600">
                  {c.mnemonic}
                </div>
              )}
              {c.saved && (
                <Bookmark size={12} className="mt-2" fill="#3a3a3a" color="#3a3a3a" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Card area */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
            >
              <ChevronRight size={18} />
            </button>

            <div className="w-full max-w-sm mx-auto text-center">
              <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-4">
                {card.topic}
              </h1>

              {card.mnemonic && (
                <div className="inline-block px-4 py-2 rounded-full bg-black/10 text-sm font-mono tracking-widest text-gray-800 mb-6">
                  {card.mnemonic}
                </div>
              )}

              {!flipped ? (
                <button
                  onClick={() => setFlipped(true)}
                  className="mt-2 text-sm underline text-gray-700"
                >
                  Try answering out loud, then tap to reveal
                </button>
              ) : (
                <div className="text-left mt-2 animate-[fadeIn_0.3s_ease]">
                  <p className="text-base text-gray-800 leading-relaxed mb-4">
                    {card.answer}
                  </p>
                  <ul className="space-y-2">
                    {card.framework.map((f, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-800 bg-white/40 rounded-lg px-3 py-2"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>

                  {notesOpen ? (
                    <div className="mt-4">
                      <textarea
                        value={card.myNotes || ""}
                        onChange={(e) =>
                          updateCard(card.id, { myNotes: e.target.value })
                        }
                        placeholder="Add your own spin on this answer..."
                        className="w-full text-sm rounded-lg p-3 bg-white/60 outline-none resize-none"
                        rows={3}
                        autoFocus
                      />
                      <button
                        onClick={() => setNotesOpen(false)}
                        className="text-xs mt-1 text-gray-600 underline"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setNotesOpen(true)}
                      className="text-xs mt-3 text-gray-600 underline"
                    >
                      {card.myNotes ? "Edit my notes" : "+ Add my own notes"}
                    </button>
                  )}
                  {card.myNotes && !notesOpen && (
                    <p className="text-xs italic text-gray-600 mt-2 bg-white/30 rounded-lg px-3 py-2">
                      {card.myNotes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Icon row */}
          <div className="flex items-center justify-around px-8 pb-4">
            <button className="w-10 h-10 flex items-center justify-center">
              <Info size={20} color="#3a3a3a" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center">
              <Share size={20} color="#3a3a3a" />
            </button>
            <button
              onClick={() => updateCard(card.id, { liked: !card.liked })}
              className="w-10 h-10 flex items-center justify-center"
            >
              <Heart
                size={20}
                color="#3a3a3a"
                fill={card.liked ? "#3a3a3a" : "none"}
              />
            </button>
            <button
              onClick={() => updateCard(card.id, { saved: !card.saved })}
              className="w-10 h-10 flex items-center justify-center"
            >
              <Bookmark
                size={20}
                color="#3a3a3a"
                fill={card.saved ? "#3a3a3a" : "none"}
              />
            </button>
          </div>
        </>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-8 pb-8 pt-2">
        <button
          onClick={() => setView("grid")}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <LayoutGrid size={18} color="#fff" />
        </button>
        <button
          className="px-8 py-3 rounded-full flex items-center gap-2"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <GraduationCap size={18} color="#fff" />
          <span className="text-white text-sm font-medium">Practice</span>
        </button>
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <BarChart2 size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}
