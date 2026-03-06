"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type VoteType = "valida" | "cuestiona" | null;

interface VoteCounts {
  [contratoId: string]: { valida: number; cuestiona: number };
}

interface VoteState {
  [contratoId: string]: VoteType;
}

const STORAGE_KEY_VOTES = "eoro_contract_votes";
const STORAGE_KEY_COUNTS = "eoro_contract_counts";

export function useContractVotes(initialCounts: VoteCounts) {
  const [userVotes, setUserVotes] = useState<VoteState>({});
  const [counts, setCounts] = useState<VoteCounts>(initialCounts);
  const initialized = useRef(false);
  const pendingVotes = useRef(new Set<string>());

  // Load cached state from localStorage on mount (SSR-safe)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const savedVotes = localStorage.getItem(STORAGE_KEY_VOTES);
      const savedCounts = localStorage.getItem(STORAGE_KEY_COUNTS);
      if (savedVotes) setUserVotes(JSON.parse(savedVotes));
      if (savedCounts) setCounts(JSON.parse(savedCounts));
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Persist to localStorage on change (acts as optimistic cache)
  useEffect(() => {
    if (!initialized.current) return;
    try {
      localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(userVotes));
      localStorage.setItem(STORAGE_KEY_COUNTS, JSON.stringify(counts));
    } catch {
      // localStorage unavailable
    }
  }, [userVotes, counts]);

  const vote = useCallback(
    (contratoId: string, type: "valida" | "cuestiona") => {
      // Prevent double-clicks while a vote is in flight
      if (pendingVotes.current.has(contratoId)) return;

      const currentVote = userVotes[contratoId] || null;
      const newVote = currentVote === type ? null : type;

      // Optimistic update
      setUserVotes((prev) => ({ ...prev, [contratoId]: newVote }));
      setCounts((prev) => {
        const c = { ...(prev[contratoId] || { valida: 0, cuestiona: 0 }) };
        if (currentVote === "valida") c.valida = Math.max(0, c.valida - 1);
        if (currentVote === "cuestiona") c.cuestiona = Math.max(0, c.cuestiona - 1);
        if (newVote === "valida") c.valida++;
        if (newVote === "cuestiona") c.cuestiona++;
        return { ...prev, [contratoId]: c };
      });

      // Send to server
      pendingVotes.current.add(contratoId);
      fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contrato_id: contratoId, vote_type: type }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Vote failed");
          return res.json();
        })
        .then((serverData) => {
          // Reconcile with server state
          setCounts((prev) => ({
            ...prev,
            [contratoId]: {
              valida: serverData.valida ?? 0,
              cuestiona: serverData.cuestiona ?? 0,
            },
          }));
          setUserVotes((prev) => ({
            ...prev,
            [contratoId]: serverData.user_vote ?? null,
          }));
        })
        .catch(() => {
          // Revert optimistic update on failure
          setUserVotes((prev) => ({ ...prev, [contratoId]: currentVote }));
          setCounts((prev) => {
            const c = { ...(prev[contratoId] || { valida: 0, cuestiona: 0 }) };
            // Undo the optimistic changes
            if (newVote === "valida") c.valida = Math.max(0, c.valida - 1);
            if (newVote === "cuestiona") c.cuestiona = Math.max(0, c.cuestiona - 1);
            if (currentVote === "valida") c.valida++;
            if (currentVote === "cuestiona") c.cuestiona++;
            return { ...prev, [contratoId]: c };
          });
        })
        .finally(() => {
          pendingVotes.current.delete(contratoId);
        });
    },
    [userVotes]
  );

  const getUserVote = useCallback(
    (contratoId: string): VoteType => {
      return userVotes[contratoId] || null;
    },
    [userVotes]
  );

  const getCounts = useCallback(
    (contratoId: string) => {
      return counts[contratoId] || { valida: 0, cuestiona: 0 };
    },
    [counts]
  );

  return { vote, getUserVote, getCounts };
}
