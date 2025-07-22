import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

type CharRow = { id: string; name: string };

export function useActiveCharacter() {
  const [character, setCharacter] = useState<CharRow | null>(null);
  const [loading, setLoading] = useState(true);

  /** Persist and change active ID */
  const setCharacterId = useCallback((id: string | null) => {
    if (id) localStorage.setItem("tt_selected_character", id);
    else localStorage.removeItem("tt_selected_character");
    // force re‑fetch
    setCharacter(null);
    setLoading(true);
  }, []);

  // Load on mount or when id changes
  useEffect(() => {
    async function load() {
      const id = localStorage.getItem("tt_selected_character");
      if (!id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("characters")
        .select("id,name")
        .eq("id", id)
        .single();
      if (error || !data) {
        // stale id -> purge
        localStorage.removeItem("tt_selected_character");
        setLoading(false);
        return;
      }
      setCharacter(data);
      setLoading(false);
    }
    load();
  }, [setCharacterId]);

  return { character, loading, setCharacterId };
}
