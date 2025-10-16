"use client";

import { useState } from "react";
import { Button } from "@/app/_components/Button";
import { Loader } from "@/app/_components/Loader";
import Link from "next/link";

type QAResponse = {
  answer: string;
  score: number;
  post?: {
    id: string;
    title: string;
  };
  context?: Array<{
    title: string;
    similarity: number;
  }>;
};

export default function AiPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<QAResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/ai/qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "質問への回答生成に失敗しました");
      }

      setAnswer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">ブログ内容への質問</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="question" className="block font-bold">
            質問
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="h-24 w-full rounded-lg border p-3"
            required
            placeholder="ブログの内容について質問してください..."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            質問する
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="mt-8">
          <Loader />
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold">回答:</h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <p>{answer.answer}</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">信頼度: {(answer.score * 100).toFixed(1)}%</p>
              {answer.context && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">参考にした記事:</p>
                  <ul className="space-y-1">
                    {answer.context.map((ctx, index) => (
                      <li key={index} className="text-sm">
                        {ctx.title} (関連度: {(ctx.similarity * 100).toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {answer.post && (
                <div className="mt-2">
                  <Link 
                    href={`/posts/${answer.post.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    記事を読む: {answer.post.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}