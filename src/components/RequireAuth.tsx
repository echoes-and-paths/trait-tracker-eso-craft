import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        nav("/login", { replace: true });
      } else {
        setChecking(false);
      }
    }
    check();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) nav("/login", { replace: true });
    });
    return () => { listener.subscription.unsubscribe(); };
  }, [nav]);

  if (checking) return null; // or spinner
  return children;
}
