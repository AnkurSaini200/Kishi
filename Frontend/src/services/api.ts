import type { ApiResponse } from '../types/api'
export async function apiRequest<T>(data: T): Promise<ApiResponse<T>> { return { data } }
