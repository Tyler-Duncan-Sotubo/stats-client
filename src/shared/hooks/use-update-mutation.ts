import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "./use-axios-auth";
import { extractErrorMessage } from "@/shared/utils/error-handler";

type RefetchKey = string | string[] | Array<{ key: string; params?: unknown }>;

type UpdateMutationParams<T> = {
  endpoint: string;
  successMessage?: string;
  refetchKey?: RefetchKey;
  onSuccess?: (updated: unknown) => void;
  onError?: (errorMsg: string) => void;
  method?: "PATCH" | "PUT";
};

export function useUpdateMutation<T>({
  endpoint,
  successMessage,
  refetchKey,
  onSuccess,
  onError,
  method = "PATCH",
}: UpdateMutationParams<T>) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const axiosInstance = useAxiosAuth();

  const update = async (
    data?: T,
    setError?: (errorMsg: string) => void,
    onClose?: () => void,
  ) => {
    try {
      const res = await axiosInstance({
        method,
        url: endpoint,
        data,
        headers: {
          Authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
      });

      if (res.data && successMessage) {
        toast.success(successMessage);
        onClose?.();

        if (refetchKey) {
          if (typeof refetchKey === "string") {
            refetchKey.split(" ").forEach((key) => {
              queryClient.invalidateQueries({ queryKey: [key] });
            });
          } else if (Array.isArray(refetchKey)) {
            refetchKey.forEach((item) => {
              if (typeof item === "string") {
                queryClient.invalidateQueries({ queryKey: [item] });
              } else {
                queryClient.invalidateQueries({
                  queryKey: [item.key, item.params],
                });
              }
            });
          }
        }

        onSuccess?.(res.data);
        return res.data;
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setError?.(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  };

  return update;
}
