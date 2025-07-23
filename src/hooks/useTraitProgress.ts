import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { TraitProgress } from "@/types";

type ProgressRow = {
  user_id: string;
  profile_id: string;
  section: string;
  item: string;
  trait: string;
  completed: boolean;
};

export function useTraitProgress(characterId?: string) {
  return useQuery({
    queryKey: ["trait-progress", characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<ProgressRow>("trait_progress")
        .select("profile_id,section,item,trait,completed")
        .eq("profile_id", characterId!);
      if (error) throw error;
      return (data ?? []).map((r) => ({
        profileId: r.profile_id,
        section: r.section,
        item: r.item,
        trait: r.trait,
        completed: r.completed,
      })) as TraitProgress[];
    },
    enabled: !!characterId,
  });
}

type Payload = ProgressRow;

export function useSetTraitProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { error } = await supabase
        .from("trait_progress")
        .upsert(payload, { onConflict: "profile_id,section,item,trait" });
      if (error) throw error;
      return payload;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["trait-progress", data.profile_id] });
    },
  });
}

export function useRemoveTraitProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { error } = await supabase
        .from("trait_progress")
        .delete()
        .match({
          profile_id: payload.profile_id,
          section: payload.section,
          item: payload.item,
          trait: payload.trait,
        });
      if (error) throw error;
      return payload;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["trait-progress", data.profile_id] });
    },
  });
}
