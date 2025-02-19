"use client";

import Link from "next/link";
import { Button } from "@/app/_components/Button";
import { AdminPostSummary } from "@/app/_components/AdminPostSummary";
import { usePosts } from "@/app/_hooks/usePosts";
import { Loader } from "@/app/_components/Loader";

export default function AdminPostsPage() {
  const { posts, isLoading, error, refetch } = usePosts();

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">エラーが発生しました: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">投稿一覧</h1>
        <Link href="/admin/posts/new">
          <Button>新規投稿</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">投稿がありません</p>
          ) : (
            posts.map((post) => (
              <AdminPostSummary
                key={post.id}
                post={post}
                onDelete={refetch}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}