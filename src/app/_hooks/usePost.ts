import { useState, useEffect, useCallback } from "react";
import { Post } from "../_types/Post";

type UsePostOptions = {
  isAdmin?: boolean;
};

export const usePost = (id: string, options: UsePostOptions = {}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = options.isAdmin ? `/api/admin/posts/${id}` : `/api/posts/${id}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching post:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, options.isAdmin]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    isLoading,
    error,
    refetch: fetchPost,
  };
};
