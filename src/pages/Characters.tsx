import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

/** Minimal row shape from public.characters */
type CharacterRow = {
  id: string;
  name: string;
};

export default function Characters() {
  const nav = useNavigate();
  const [chars, setChars] = useState<CharacterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // Load current user's characters
  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { session },
        error: sessErr
      } = await supabase.auth.getSession();
      if (sessErr) {
        setMsg(sessErr.message);
        setLoading(false);
        return;
      }
      if (!session) {
        setMsg("No session.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("characters")
        .select("id,name")
        .eq("user_id", session.user.id)
        .order("name", { ascending: true });

      if (error) setMsg(error.message);
      else setChars(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function addCharacter(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!newName.trim()) return;
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (!session) {
      setMsg("Not signed in.");
      return;
    }
    const { data, error } = await supabase
      .from("characters")
      .insert({ user_id: session.user.id, name: newName.trim() })
      .select("id,name")
      .single();
    if (error) {
      setMsg(error.message);
      return;
    }
    setChars((c) => [...c, data]);
    setNewName("");
  }

  function chooseCharacter(id: string) {
    // Persist selection for other pages (basic for now)
    localStorage.setItem("tt_selected_character", id);
    nav("/");
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Your Characters</h2>

      {loading && <p>Loading…</p>}
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {!loading && chars.length === 0 && <p>No characters yet.</p>}

      <ul>
        {chars.map((c) => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <button onClick={() => chooseCharacter(c.id)}>{c.name}</button>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "24px 0" }} />

      <form onSubmit={addCharacter}>
        <label>
          Add new character<br />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g., ArtimusPi"
            required
          />
        </label>
        <br />
        <br />
        <button type="submit">Add Character</button>
      </form>

      <p style={{ marginTop: 24 }}>
        <button onClick={() => nav("/")}>Back to tracker</button>
      </p>
    </div>
  );
}
