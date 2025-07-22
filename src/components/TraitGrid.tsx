import { useEffect, useState } from "react";
import { fetchCharacterItems } from "@/lib/fetchCharacterItems";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: string;
  item_type: string;
  trait: string;
  character_items: {
    id?: string;
    completed?: boolean;
    in_bank?: boolean;
    research_ends_at?: string | null;
  } | null;
};

export default function TraitGrid({ characterId }: { characterId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacterItems(characterId)
      .then(setRows)
      .catch((e) => setMsg(e.message));
  }, [characterId]);

  async function toggle(
    row: Row,
    field: "completed" | "in_bank",
    value: boolean
  ) {
    const payload = {
      character_id: characterId,
      item_id: row.id,
      [field]: value,
    };
    const { error } = await supabase
      .from("character_items")
      .upsert(payload, { onConflict: "character_id,item_id" });
    if (error) {
      setMsg(error.message);
      return;
    }
    setRows(
      (r) =>
        r!.map((x) =>
          x.id === row.id
            ? {
                ...x,
                character_items: { ...(x.character_items ?? {}), [field]: value },
              }
            : x
        ) as Row[]
    );
  }

  async function updateTimer(row: Row, value: string) {
    const iso = value ? new Date(value).toISOString() : null;
    const payload = { character_id: characterId, item_id: row.id, research_ends_at: iso };
    const { error } = await supabase
      .from("character_items")
      .upsert(payload, { onConflict: "character_id,item_id" });
    if (error) { setMsg(error.message); return; }
    setRows((r)=> r!.map(x => x.id===row.id ? ({...x, character_items:{...(x.character_items??{}), research_ends_at: iso}}) : x) as Row[]);
  }
  if (msg) return <p style={{ color: "red" }}>{msg}</p>;
  if (!rows) return <p>Loading grid…</p>;

  return (
    <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
            <th>Finish Time</th>
      <thead>
        <tr>
          <th>Item</th>
          <th>Trait</th>
          <th>Done</th>
          <th>Bank</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const status = row.character_items ?? {};
          return (
            <tr key={row.id}>
              <td>{row.item_type}</td>
              <td>{row.trait}</td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={!!status.completed}
                  onChange={(e) => toggle(row, "completed", e.target.checked)}
                />
              </td>
                <td style={{ textAlign: "center" }}>
                  <input type="datetime-local"
                    value={(status.research_ends_at ? new Date(status.research_ends_at).toISOString().slice(0,16) : "")}
                    onChange={(e)=>updateTimer(row, e.target.value)}
                  />
                </td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={!!status.in_bank}
                  onChange={(e) => toggle(row, "in_bank", e.target.checked)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
