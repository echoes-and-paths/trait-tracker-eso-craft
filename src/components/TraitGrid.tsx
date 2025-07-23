import { useCharacterItems } from "@/hooks/useCharacterItems";
import { useCharacterItemMutation } from "@/hooks/useCharacterItemMutation";

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
  const { data: rows, isLoading, error } = useCharacterItems(characterId);
  const mutation = useCharacterItemMutation();

  function toggle(
    row: Row,
    field: "completed" | "in_bank",
    value: boolean
  ) {
    mutation.mutate({
      character_id: characterId,
      item_id: row.id,
      [field]: value,
    });
  }

  function updateTimer(row: Row, value: string) {
    const iso = value ? new Date(value).toISOString() : null;
    mutation.mutate({ character_id: characterId, item_id: row.id, research_ends_at: iso });
  }
  if (error) return <p style={{ color: "red" }}>{(error as Error).message}</p>;
  if (isLoading || !rows) return <p>Loading grid…</p>;

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
