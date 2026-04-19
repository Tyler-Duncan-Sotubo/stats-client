import { isAxiosError } from "../api/axios";

export function extractErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message[0];
    if (typeof message === "string") return message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
