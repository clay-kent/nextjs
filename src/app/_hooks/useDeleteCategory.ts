import { useState } from "react";
import { KeyedMutator } from "swr";

export function useDeleteCategory(mutate: KeyedMutator<any>) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategory = async (categoryId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("カテゴリの削除に失敗しました");
      }

      await mutate();
      return true;
    } catch (error) {
      console.error("カテゴリの削除エラー:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCategory, isDeleting };
}
