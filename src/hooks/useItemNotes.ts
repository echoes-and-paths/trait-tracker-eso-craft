import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

type NoteRow = {
  character_id: string;
  item_id: string;
  note: string;
};

export function useItemNotes(characterId?: string) {
  return useQuery({
    queryKey: ["item-notes", characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<NoteRow>("item_notes")
        .select("item_id,note")
        .eq("character_id", characterId!);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!characterId,
  });
}

export function useSaveItemNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: NoteRow) => {
      const { error } = await supabase
        .from("item_notes")
        .upsert(row, { onConflict: "character_id,item_id" });
      if (error) throw error;
      return row;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["item-notes", data.character_id] });
    },
  });
}
