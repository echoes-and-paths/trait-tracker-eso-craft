import { supabase } from "@/lib/supabaseClient";

type Item = {
  id: string;
  item_type: string;
  trait: string;
};
type State = {
  item_id: string;
  completed: boolean | null;
  in_bank: boolean | null;
  research_ends_at: string | null;
};

export async function fetchCharacterItems(characterId: string) {
  // 1) All items (static list)
  const { data: items, error: itemsErr } = await supabase
    .from<Item>("items")
    .select("id,item_type,trait")
    .order("item_type", { ascending: true })
    .order("trait", { ascending: true });
  if (itemsErr) throw itemsErr;

  // 2) This character's statuses
  const { data: states, error: statesErr } = await supabase
    .from<State>("character_items")
    .select("item_id,completed,in_bank,research_ends_at")
    .eq("character_id", characterId);
  if (statesErr) throw statesErr;

  const map = new Map(states.map((s) => [s.item_id, s]));
  return items.map((it) => ({
    ...it,
    character_items: map.get(it.id) ?? null,
  }));
}
