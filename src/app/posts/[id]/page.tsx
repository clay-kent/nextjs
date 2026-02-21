"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { usePost } from "@/app/_hooks/usePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { sanitizeHTML } from "@/app/_utils/sanitizeHTML";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import { runMermaid } from "@/app/_components/MermaidInit";
import dayjs from "dayjs";
import Link from "next/link";

const Page = () => {
  const { id } = useParams() as { id: string };
  const { post, isLoading, error } = usePost(id);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // post の DOM が確定した後にシンタックスハイライトと mermaid を実行
  useEffect(() => {
    if (!post || !contentRef.current) return;
    Prism.highlightAllUnder(contentRef.current);
    runMermaid();
  }, [post]);

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  const categoryNames = (post.categories || [])
    .map((c) => c.name?.trim())
    .filter(Boolean) as string[];

  return (
    <main>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="text-sm text-gray-500">
          {dayjs(post.createdAt).format("YYYY-MM-DD")}
          {categoryNames.length > 0 && (
            <>
              {' '}
              | {categoryNames.join(", ")}
            </>
          )}
        </div>
        {post.coverImage && (
          <div>
            <Image
              src={post.coverImage.url}
              alt={post.title}
              width={post.coverImage.width}
              height={post.coverImage.height}
              priority
              className="rounded-xl"
            />
          </div>
        )}
        <div
          ref={contentRef}
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
        />
      </div>
    </main>
  );
};

export default Page;
