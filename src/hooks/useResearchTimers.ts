import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ResearchTimer } from "@/types";

type TimerRow = {
  user_id: string;
  profile_id: string;
  section: string;
  item: string;
  trait: string;
  end_time: string | null;
};

export function useResearchTimers(characterId?: string) {
  return useQuery({
    queryKey: ["research-timers", characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<TimerRow>("research_timers")
        .select("profile_id,section,item,trait,end_time")
        .eq("profile_id", characterId!);
      if (error) throw error;
      return (data ?? []).map((r) => ({
        profileId: r.profile_id,
        section: r.section,
        item: r.item,
        trait: r.trait,
        endTime: r.end_time ? new Date(r.end_time) : new Date(),
      })) as ResearchTimer[];
    },
    enabled: !!characterId,
  });
}

type Payload = TimerRow;

export function useSetResearchTimer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { error } = await supabase
        .from("research_timers")
        .upsert(payload, { onConflict: "profile_id,section,item,trait" });
      if (error) throw error;
      return payload;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["research-timers", data.profile_id] });
    },
  });
}

export function useRemoveResearchTimer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { error } = await supabase
        .from("research_timers")
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
      qc.invalidateQueries({ queryKey: ["research-timers", data.profile_id] });
    },
  });
}
