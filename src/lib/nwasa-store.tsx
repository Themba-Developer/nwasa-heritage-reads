import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_BOOKS, type Book, type Tier } from "./nwasa-data";

export interface User {
  name: string;
  email: string;
  tier: Tier;
  preferences: string[];
  onboarded: boolean;
  streak: number;
  minutesRead: number;
  booksFinished: number;
  lastReadBookId?: string;
  lastReadProgress?: number; // 0..1
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterIndex: number;
  note: string;
  createdAt: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterIndex: number;
  text: string;
  note?: string;
  createdAt: number;
}

interface State {
  user: User | null;
  books: Book[];
  bookmarks: Bookmark[];
  highlights: Highlight[];
}

interface Ctx extends State {
  signUp: (name: string, email: string) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  completeOnboarding: (prefs: string[]) => void;
  upgradeToPremium: () => void;
  downgradeToFree: () => void;
  publishBook: (b: Omit<Book, "id" | "palette" | "chapters" | "custom"> & { content: string }) => Book;
  addBookmark: (b: Omit<Bookmark, "id" | "createdAt">) => void;
  removeBookmark: (id: string) => void;
  addHighlight: (h: Omit<Highlight, "id" | "createdAt">) => void;
  removeHighlight: (id: string) => void;
  setLastRead: (bookId: string, progress: number) => void;
  bumpStreak: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = "nwasa-state-v1";

const initialState = (): State => ({
  user: null,
  books: SEED_BOOKS,
  bookmarks: [],
  highlights: [],
});

const NwasaContext = createContext<Ctx | null>(null);

const PALETTES: [string, string][] = [
  ["#1f2a3a", "#caa057"],
  ["#2c1f2a", "#d49a55"],
  ["#1a2a2f", "#cba055"],
  ["#2b2e36", "#d4a24c"],
  ["#22323a", "#d8b46a"],
];

export function NwasaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        // Always merge seed books to keep new defaults; preserve custom ones
        const customs = (parsed.books || []).filter((b) => b.custom);
        setState({
          ...parsed,
          books: [...SEED_BOOKS, ...customs],
        });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const value: Ctx = useMemo(
    () => ({
      ...state,
      signUp: (name, email) =>
        setState((s) => ({
          ...s,
          user: {
            name,
            email,
            tier: "free",
            preferences: [],
            onboarded: false,
            streak: 1,
            minutesRead: 0,
            booksFinished: 0,
          },
        })),
      signIn: (email) =>
        setState((s) => ({
          ...s,
          user: s.user
            ? { ...s.user, email }
            : {
                name: email.split("@")[0] || "Reader",
                email,
                tier: "free",
                preferences: [],
                onboarded: false,
                streak: 1,
                minutesRead: 0,
                booksFinished: 0,
              },
        })),
      signOut: () => setState((s) => ({ ...s, user: null })),
      completeOnboarding: (prefs) =>
        setState((s) => ({
          ...s,
          user: s.user ? { ...s.user, preferences: prefs, onboarded: true } : s.user,
        })),
      upgradeToPremium: () =>
        setState((s) => ({ ...s, user: s.user ? { ...s.user, tier: "premium" } : s.user })),
      downgradeToFree: () =>
        setState((s) => ({ ...s, user: s.user ? { ...s.user, tier: "free" } : s.user })),
      publishBook: (b) => {
        const id = `custom-${Date.now()}`;
        const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        const paragraphs = b.content.split(/\n\n+/).filter(Boolean);
        const chunkSize = Math.max(1, Math.ceil(paragraphs.length / Math.max(1, Math.min(4, paragraphs.length))));
        const chapters = [];
        for (let i = 0; i < paragraphs.length; i += chunkSize) {
          chapters.push({
            title: `Chapter ${chapters.length + 1}`,
            content: paragraphs.slice(i, i + chunkSize).join("\n\n"),
          });
        }
        if (chapters.length === 0) chapters.push({ title: "Chapter 1", content: b.content });
        const book: Book = {
          id,
          title: b.title,
          author: b.author,
          synopsis: b.synopsis,
          tier: b.tier,
          genre: b.genre,
          palette,
          chapters,
          custom: true,
        };
        setState((s) => ({ ...s, books: [book, ...s.books] }));
        return book;
      },
      addBookmark: (b) =>
        setState((s) => ({
          ...s,
          bookmarks: [
            { ...b, id: `bm-${Date.now()}`, createdAt: Date.now() },
            ...s.bookmarks,
          ],
        })),
      removeBookmark: (id) =>
        setState((s) => ({ ...s, bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      addHighlight: (h) =>
        setState((s) => ({
          ...s,
          highlights: [
            { ...h, id: `hl-${Date.now()}`, createdAt: Date.now() },
            ...s.highlights,
          ],
        })),
      removeHighlight: (id) =>
        setState((s) => ({ ...s, highlights: s.highlights.filter((h) => h.id !== id) })),
      setLastRead: (bookId, progress) =>
        setState((s) => ({
          ...s,
          user: s.user
            ? {
                ...s.user,
                lastReadBookId: bookId,
                lastReadProgress: progress,
                minutesRead: s.user.minutesRead + 1,
              }
            : s.user,
        })),
      bumpStreak: () =>
        setState((s) => ({
          ...s,
          user: s.user ? { ...s.user, streak: s.user.streak + 1 } : s.user,
        })),
      resetAll: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState());
      },
    }),
    [state],
  );

  return <NwasaContext.Provider value={value}>{children}</NwasaContext.Provider>;
}

export function useNwasa() {
  const ctx = useContext(NwasaContext);
  if (!ctx) throw new Error("useNwasa must be used within NwasaProvider");
  return ctx;
}

export function useBook(id: string | undefined) {
  const { books } = useNwasa();
  return books.find((b) => b.id === id);
}
