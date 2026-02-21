"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePost } from "@/app/_hooks/usePost";
import { useEditPost } from "@/app/_hooks/useEditPost";
import { useCategories } from "@/app/_hooks/useCategories";
import { Button } from "@/app/_components/Button";
import { Loader } from "@/app/_components/Loader";
import SubmittingOverlay from "@/app/_components/SubmittingOverlay";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const { post, isLoading: isLoadingPost, error: postError } = usePost(id, { isAdmin: true });
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { editPost, isSubmitting } = useEditPost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCoverImageURL(post.coverImage?.url ?? "");
      setSelectedCategoryIds(post.categories.map(cat => cat.id));
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!title.trim() || !content.trim() || selectedCategoryIds.length === 0) {
      setSubmitError("タイトル・内容・カテゴリーは必須です");
      return;
    }

    const payload: any = {
      title: title.trim(),
      content: content.trim(),
      categoryIds: selectedCategoryIds,
    };

    if (coverImageURL.trim()) {
      payload.coverImageURL = coverImageURL.trim();
    }

    const success = await editPost(id, payload);

    if (success) {
      router.push("/admin/posts");
    } else {
      setSubmitError("投稿の更新に失敗しました。");
    }
  };

  if (postError) {
    return (
      <div className="p-4">
        <p className="text-red-500">エラーが発生しました: {postError}</p>
      </div>
    );
  }

  if (isLoadingPost || isLoadingCategories) {
    return (
      <div className="flex justify-center p-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">投稿の編集</h1>
      </div>

      {submitError && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-500">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-2 block font-medium">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block font-medium">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="coverImageURL" className="mb-2 block font-medium">
            カバー画像URL
          </label>
          <input
            type="url"
            id="coverImageURL"
            value={coverImageURL}
            onChange={(e) => setCoverImageURL(e.target.value)}
            className="w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">カテゴリー</label>
          <div className="space-y-2">
            {categories?.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={(e) => {
                    setSelectedCategoryIds(prev =>
                      e.target.checked
                        ? [...prev, category.id]
                        : prev.filter(id => id !== category.id)
                    );
                  }}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
          {selectedCategoryIds.length === 0 && (
            <p className="mt-1 text-sm text-red-500">
              少なくとも1つのカテゴリーを選択してください
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/posts")}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            更新
          </Button>
        </div>
      </form>

      <SubmittingOverlay isSubmitting={isSubmitting} />
    </div>
  );
}
