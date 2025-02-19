import { useState } from "react";
import { Category } from "@/app/_types/Category";
import { KeyedMutator } from "swr";

export const useSubmitCategory = (mutate: KeyedMutator<Category[]>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCategory = async (newCategoryName: string) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      await mutate();
      return true;
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリのPOSTリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitCategory, isSubmitting };
};
