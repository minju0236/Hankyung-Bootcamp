import { apiFetch } from './api';
import type { ApiResponse, User } from './types';

export async function loadCurrentUser(): Promise<User> {
  const response = await apiFetch<ApiResponse<User>>('/api/auth/me');
  return response.data;
}
