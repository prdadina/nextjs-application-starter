import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Hook pentru metrici
export function useMetrici() {
  return useQuery<ApiResponse<any>>({
    queryKey: ["metrici"],
    queryFn: async () => {
      const response = await fetch("/api/metrici");
      return response.json();
    },
    refetchInterval: 30000, // Reîmprospătare la fiecare 30 secunde
  });
}

// Hook pentru tranzacții
export function useTranzactii() {
  return useQuery<ApiResponse<any>>({
    queryKey: ["tranzactii"],
    queryFn: async () => {
      const response = await fetch("/api/tranzactii");
      return response.json();
    },
    refetchInterval: 30000,
  });
}

// Hook pentru adăugarea unei tranzacții noi
export function useAdaugaTranzactie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tranzactie: any) => {
      const response = await fetch("/api/tranzactii", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tranzactie),
      });
      return response.json();
    },
    onSuccess: () => {
      // Reîmprospătăm datele după adăugarea unei tranzacții noi
      queryClient.invalidateQueries({ queryKey: ["tranzactii"] });
      queryClient.invalidateQueries({ queryKey: ["metrici"] });
    },
  });
}

// Hook pentru analiza bugetului
export function useAnalizaBuget(userId?: string) {
  return useQuery<ApiResponse<any>>({
    queryKey: ["buget", userId],
    queryFn: async () => {
      const response = await fetch(`/api/buget?userId=${userId || "anonymous"}`);
      return response.json();
    },
    refetchInterval: 60000, // Reîmprospătare la fiecare minut
  });
}

// Hook pentru trimiterea unui mesaj către asistentul virtual
export function useTrimiteMesaj() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mesaj, userId }: { mesaj: string; userId?: string }) => {
      const response = await fetch("/api/asistent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: mesaj, userId }),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Reîmprospătăm conversația după trimiterea unui mesaj nou
      queryClient.invalidateQueries({
        queryKey: ["conversatie", variables.userId],
      });
    },
  });
}

// Hook pentru obținerea conversației cu asistentul virtual
export function useConversatie(userId?: string) {
  return useQuery<ApiResponse<any>>({
    queryKey: ["conversatie", userId],
    queryFn: async () => {
      const response = await fetch(`/api/asistent?userId=${userId || "anonymous"}`);
      return response.json();
    },
    refetchInterval: 5000, // Reîmprospătare la fiecare 5 secunde pentru chat
  });
}

// Hook pentru actualizarea metricilor
export function useActualizeazaMetrici() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metrici: {
      tip: "cache_hit" | "cache_miss" | "tranzactie" | "sesiune";
      valoare?: number;
    }) => {
      const response = await fetch("/api/metrici", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metrici),
      });
      return response.json();
    },
    onSuccess: () => {
      // Reîmprospătăm metricile după actualizare
      queryClient.invalidateQueries({ queryKey: ["metrici"] });
    },
  });
}
