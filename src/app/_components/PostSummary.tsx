"use client";
import React from "react";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import Link from "next/link";
import { sanitizeHTML } from "@/app/_utils/sanitizeHTML";

interface PostSummaryProps {
  post: Post;
}

const PostSummary: React.FC<PostSummaryProps> = ({ post }) => {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="mb-4 rounded-md border p-4">
        <h2 className="text-xl font-bold">{post.title}</h2>
        <div className="mb-2 text-sm text-gray-500">
          {dayjs(post.createdAt).format("YYYY-MM-DD")} |{" "}
          {post.categories.map((category) => category.name).join(", ")}{" "}
          {/*TODO: category Component*/}
        </div>
        <div
          className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
        />
      </div>
    </Link>
  );
};

export default PostSummary;
