import { supabase } from "@/lib/supabaseClient";

/** Returns pre‑joined grid for a character id */
export async function fetchCharacterItems(characterId: string) {
  const { data, error } = await supabase
    .from("items")
    .select(`
      id,
      item_type,
      trait,
      character_items:character_items(
        id,
        completed,
        in_bank,
        research_ends_at
      )
    `)
    .order("item_type,trait", { ascending: true })
    .eq("character_items.character_id", characterId)
    .or(`character_items.character_id.is.null`)   -- include rows without status
    ;

  if (error) throw error;
  return data;
}
