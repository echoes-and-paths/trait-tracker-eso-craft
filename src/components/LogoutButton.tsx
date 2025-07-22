import { supabase } from "@/lib/supabaseClient";
export default function LogoutButton() {
  return (
    <button onClick={() => supabase.auth.signOut()} style={{marginLeft:12}}>
      Logout
    </button>
  );
}
