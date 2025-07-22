import { useEffect, useState } from "react";
import { fetchCharacterItems } from "@/lib/fetchCharacterItems";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: string;
  item_type: string;
  trait: string;
  character_items: {
    completed?: boolean;
    in_bank?: boolean;
    research_ends_at?: string | null;
  } | null;
};

type GroupName = "Blacksmithing" | "Clothing" | "Woodworking" | "Jewelry" | "Other";

function craftGroup(itemType: string): GroupName {
  const t = itemType.toLowerCase();
  if (
    ["axe","sword","dagger","mace","maul","greatsword","battle axe","arm cops","boots","bracers","cuirass","gauntlets","greaves","helm","pauldron","sabatons","girdle","vambraces","helmets","shoulders"].some(k => t.includes(k))
  ) return "Blacksmithing";
  if (
    ["robe","jerkin","gloves","hat","pants","shoes","jack","belt","guards","arm cops","bracers","cuirass"].some(k => t.includes(k)) ||
    ["arm cops","boots","bracers","cuirass","gloves","helm","jack","legs","robe","sabaton","shoes","shoulders","belt","girdle","sash"].some(k=>t.includes(k))
  ) return "Clothing";
  if (
    ["bow","shield","inferno staff","ice staff","lightning staff","restoration staff","flame staff","frost staff","shock staff","staff"].some(k => t.includes(k))
  ) return "Woodworking";
  if (["ring","necklace"].some(k => t.includes(k))) return "Jewelry";
  return "Other";
}

export default function TraitGridGrouped({ characterId }: { characterId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacterItems(characterId)
      .then(setRows)
      .catch((e) => setMsg(e.message));
  }, [characterId]);

  async function upsert(field: "completed" | "in_bank" | "research_ends_at", row: Row, value: any) {
    const payload: any = { character_id: characterId, item_id: row.id, [field]: value };
    const { error } = await supabase.from("character_items").upsert(payload, { onConflict: "character_id,item_id" });
    if (error) { setMsg(error.message); return; }
    setRows(r => r!.map(x => x.id === row.id ? { ...x, character_items: { ...(x.character_items ?? {}), [field]: value } } : x) as Row[]);
  }

  if (msg) return <p style={{ color: "red" }}>{msg}</p>;
  if (!rows) return <p>Loading grid…</p>;

  // Group
  const groups: Record<GroupName, Row[]> = { Blacksmithing: [], Clothing: [], Woodworking: [], Jewelry: [], Other: [] };
  rows.forEach(r => groups[craftGroup(r.item_type)].push(r));

  const tableStyle: React.CSSProperties = { margin: "0 auto", borderCollapse: "collapse", width: "95%", maxWidth: 1100 };
  const thTd: React.CSSProperties = { borderBottom: "1px solid #333", padding: "6px 8px" };
  const groupHeader: React.CSSProperties = { background: "#111820", position: "sticky", top: 0, zIndex: 1 };

  return (
    <table style={tableStyle}>
      <thead>
        <tr style={groupHeader}>
          <th style={thTd}>Item</th>
          <th style={thTd}>Trait</th>
          <th style={thTd}>Done</th>
          <th style={thTd}>Bank</th>
          <th style={thTd}>Finish Time</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groups).map(([gname, list]) => {
          if (list.length === 0) return null;
          const done = list.filter(r => r.character_items?.completed).length;
          const pct = Math.round((done / list.length) * 100);
          return (
            <Fragment key={gname}>
              <tr>
                <td colSpan={5} style={{ ...thTd, ...groupHeader, textAlign: "left", fontWeight: 600 }}>
                  {gname} — {done}/{list.length} ({pct}%)
                </td>
              </tr>
              {list.map(row => {
                const status = row.character_items ?? {};
                return (
                  <tr key={row.id}>
                    <td style={thTd}>{row.item_type}</td>
                    <td style={thTd}>{row.trait}</td>
                    <td style={{ ...thTd, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!status.completed}
                        onChange={(e) => upsert("completed", row, e.target.checked)}
                      />
                    </td>
                    <td style={{ ...thTd, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!status.in_bank}
                        onChange={(e) => upsert("in_bank", row, e.target.checked)}
                      />
                    </td>
                    <td style={{ ...thTd, textAlign: "center" }}>
                      <input
                        type="datetime-local"
                        value={status.research_ends_at ? new Date(status.research_ends_at).toISOString().slice(0,16) : ""}
                        onChange={(e)=> {
                          const iso = e.target.value ? new Date(e.target.value).toISOString() : null;
                          upsert("research_ends_at", row, iso);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

// React 18: Fragment import
import { Fragment } from "react";
