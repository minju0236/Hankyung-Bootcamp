export type ApiResponse<T> = { ok: boolean; message: string; data: T };
export type User = { id: number; email: string; name: string; role: string; status?: string; createdAt?: string };
export type Contract = { id: number; customerName: string; itemName: string; quantity: number; warehouseName: string; contractStatus: string; requestNote: string; createdAt: string };
export type SimpleItem = Record<string, any>;
