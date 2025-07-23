import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password: pw });
        if (error) throw error;
        setMsg("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        nav("/");
      }
    } catch (err) {
      setMsg((err as { message?: string }).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:400, margin:"40px auto", fontFamily:"sans-serif"}}>
      <h2>{mode === "signup" ? "Create account" : "Sign in"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Email<br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoFocus />
        </label><br/><br/>
        <label>Password<br/>
          <input value={pw} onChange={e=>setPw(e.target.value)} type="password" required />
        </label><br/><br/>
        <button disabled={loading}>{loading ? "..." : (mode === "signup" ? "Sign Up" : "Sign In")}</button>
      </form>
      {msg && <p style={{color:"purple"}}>{msg}</p>}
      <p>
        {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
        <button onClick={()=>setMode(mode==="signup"?"signin":"signup")} style={{textDecoration:"underline"}}>
          {mode === "signup" ? "Sign in" : "Sign up"}
        </button>
      </p>
      <p><Link to="/">Back to app</Link></p>
    </div>
  );
}
