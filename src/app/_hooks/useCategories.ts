import { Category } from "@/app/_types/Category";
import useSWR from "swr";

export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/api/categories",
    (url: string) =>
      fetch(url, {
        method: "GET",
        cache: "no-store",
      }).then((res) => res.json())
  );

  return { data, error, isLoading, mutate };
};
