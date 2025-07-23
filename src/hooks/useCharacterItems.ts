import { useQuery } from "@tanstack/react-query";
import { fetchCharacterItems } from "@/lib/fetchCharacterItems";

export function useCharacterItems(characterId?: string) {
  return useQuery({
    queryKey: ["character-items", characterId],
    queryFn: () => fetchCharacterItems(characterId!),
    enabled: !!characterId,
  });
}
