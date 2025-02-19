import { useState } from "react";

type EditPostData = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
};

export const useEditPost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editPost = async (id: string, data: EditPostData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `${response.status}: ${response.statusText}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error updating post:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editPost,
    isSubmitting,
  };
};
