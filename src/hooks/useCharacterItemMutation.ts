import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

type Payload = {
  character_id: string;
  item_id: string;
  completed?: boolean;
  in_bank?: boolean;
  research_ends_at?: string | null;
};

export function useCharacterItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { error } = await supabase
        .from("character_items")
        .upsert(payload, { onConflict: "character_id,item_id" });
      if (error) throw error;
      return payload;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["character-items", data.character_id] });
    },
  });
}
