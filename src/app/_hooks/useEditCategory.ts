import { useState } from "react";
import { KeyedMutator } from "swr";
import { Category } from "../_types/Category";
import { toast } from "react-toastify";

export const useEditCategory = (mutate: KeyedMutator<Category[]>) => {
  const [isEditing, setIsEditing] = useState(false);

  const editCategory = async (categoryId: string, name: string) => {
    setIsEditing(true);

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("カテゴリの更新に失敗しました");
      }

      await mutate();
      toast.success("カテゴリを更新しました");
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "カテゴリの更新に失敗しました"
      );
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  return { editCategory, isEditing };
};
