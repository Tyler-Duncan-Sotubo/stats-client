import { toast } from "sonner";
import useAxiosAuth from "./use-axios-auth";
import { extractErrorMessage } from "@/shared/utils/error-handler";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type RefetchKey = string | string[] | Array<{ key: string; params?: unknown }>;

type DeleteMutationParams = {
  endpoint: string;
  successMessage?: string;
  refetchKey?: RefetchKey;
  onSuccess?: () => void;
  onError?: (errorMsg: string) => void;
};

export function useDeleteMutation({
  endpoint,
  successMessage = "Deleted successfully!",
  refetchKey,
  onSuccess,
  onError,
}: DeleteMutationParams) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const axiosInstance = useAxiosAuth();

  const remove = async (
    setError?: (errorMsg: string) => void,
    onClose?: () => void,
  ) => {
    try {
      const res = await axiosInstance.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
      });

      if (res.status === 200 || res.status === 204) {
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

        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setError?.(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  };

  return remove;
}
