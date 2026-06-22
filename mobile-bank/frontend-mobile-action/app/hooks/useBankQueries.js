"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({ mutationFn: (body) => apiRequest("/auth/login", { method: "POST", body }), onSuccess: setAuth });
}
export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({ mutationFn: (body) => apiRequest("/auth/register", { method: "POST", body }), onSuccess: setAuth });
}
export function useAccount() {
  const token = useAuthStore((s) => s.token);
  return useQuery({ queryKey: ["account"], enabled: !!token, queryFn: () => apiRequest("/bank/account", { token }) });
}
export function useTransactions() {
  const token = useAuthStore((s) => s.token);
  return useQuery({ queryKey: ["transactions"], enabled: !!token, queryFn: () => apiRequest("/bank/transactions", { token }) });
}
export function useRecentRecipients() {
  const token = useAuthStore((s) => s.token);
  return useQuery({ queryKey: ["recentRecipients"], enabled: !!token, queryFn: () => apiRequest("/bank/recent-recipients", { token }) });
}
export function useBankMutation(path) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiRequest(path, { token, method: "POST", body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["recentRecipients"] });
    }
  });
}
export function useAdminDashboard() {
  const token = useAuthStore((s) => s.token);
  return useQuery({ queryKey: ["adminDashboard"], enabled: !!token, queryFn: () => apiRequest("/admin/dashboard", { token }) });
}
export function useAdminMutation(path, method = "POST") {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body) => apiRequest(path, { token, method, body }), onSuccess: () => qc.invalidateQueries({ queryKey: ["adminDashboard"] }) });
}
