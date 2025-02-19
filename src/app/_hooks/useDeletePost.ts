import { useState } from "react";

export const useDeletePost = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deletePost,
    isDeleting,
  };
};