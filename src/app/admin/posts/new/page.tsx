"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/Button";
import { Loader } from "@/app/_components/Loader";
import SubmittingOverlay from "@/app/_components/SubmittingOverlay";
import type { Category } from "@/app/_types/Category";
import { useAuth } from "@/app/_hooks/useAuth";
import CryptoJS from "crypto-js";
import Image from "next/image";
import { supabase } from "@/utils/supabase";

type CategoryApiResponse = Category & {
  createdAt: string;
  updatedAt: string;
};

// Category selection type for the form
type SelectableCategory = {
  id: string;
  name: string;
  isSelect: boolean;
};

const calculateMD5Hash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  return CryptoJS.MD5(wordArray).toString();
};

const handleImageChange = async (
  setCoverImageKey: (value: string | undefined) => void,
  setCoverImageUrl: (value: string | undefined) => void,
  e: ChangeEvent<HTMLInputElement>
) => {
  setCoverImageKey(undefined);
  setCoverImageUrl(undefined);

  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files?.[0];
  const fileHash = await calculateMD5Hash(file);
  const path = `private/${fileHash}`;

  const { data, error } = await supabase.storage
    .from("cover_image")
    .upload(path, file, { upsert: true });

  if (error || !data) {
    window.alert(`アップロードに失敗しました: ${error.message}`);
    return;
  }

  setCoverImageKey(data.path);
  const publicUrlResult = supabase.storage
    .from("cover_image")
    .getPublicUrl(data.path);

  setCoverImageUrl(publicUrlResult.data.publicUrl);
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const [coverImageKey, setCoverImageKey] = useState<string | undefined>();
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { token } = useAuth();

  // Categories array state - null while loading/error, empty array if no categories exist
  const [checkableCategories, setCheckableCategories] = useState<SelectableCategory[] | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          setCheckableCategories(null);
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const apiResBody = (await res.json()) as CategoryApiResponse[];
        setCheckableCategories(
          apiResBody.map((category) => ({
            id: category.id,
            name: category.name,
            isSelect: false,
          }))
        );
      } catch (error) {
        const errorMsg = error instanceof Error
          ? `カテゴリの取得に失敗しました: ${error.message}`
          : `予期しないエラーが発生しました: ${error}`;
        console.error(errorMsg);
        setFetchErrorMsg(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Toggle category selection
  const switchCategoryState = (categoryId: string) => {
    if (!checkableCategories) return;

    setCheckableCategories(
      checkableCategories.map((category) =>
        category.id === categoryId
          ? { ...category, isSelect: !category.isSelect }
          : category
      )
    );
  };

  const updateNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const updateNewContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewContent(e.target.value);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!token) {
        throw new Error("認証エラー: トークンが取得できません");
      }

      const requestBody = {
        title: newTitle,
        content: newContent,
        coverImageKey: coverImageKey,
        categoryIds: checkableCategories
          ? checkableCategories.filter((c) => c.isSelect).map((c) => c.id)
          : [],
      };

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const postResponse = await res.json();
      setIsSubmitting(false);
      router.push(`/posts/${postResponse.id}`);
    } catch (error) {
      const errorMsg = error instanceof Error
        ? `投稿の作成に失敗しました: ${error.message}`
        : `予期しないエラーが発生しました: ${error}`;
        console.error(errorMsg);
        window.alert(errorMsg);
        setIsSubmitting(false);
      }
    };

    if (isLoading) {
      return <Loader />;
    }

    if (!checkableCategories) {
      return <div className="text-red-500">{fetchErrorMsg}</div>;
    }

    return (
      <main>
        <div className="mb-4 text-2xl font-bold">投稿の作成</div>

        <SubmittingOverlay isSubmitting={isSubmitting} />

        <form
          onSubmit={handleSubmit}
          className={`space-y-4 ${isSubmitting ? "opacity-50" : ""}`}
        >
          <div className="space-y-1">
            <label htmlFor="title" className="block font-bold">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full rounded-md border-2 px-2 py-1"
              value={newTitle}
              onChange={updateNewTitle}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="content" className="block font-bold">
              内容
            </label>
            <textarea
              id="content"
              name="content"
              className="h-48 w-full rounded-md border-2 px-2 py-1"
              value={newContent}
              onChange={updateNewContent}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="imgSelector" className="block font-bold">
              カバー画像URL
            </label>
            <input
              id="imgSelector"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (setCoverImageKey && setCoverImageUrl) {
                  handleImageChange(setCoverImageKey, setCoverImageUrl, e);
                }
              }}
              hidden={true}
              ref={hiddenFileInputRef}
            />
            <button
              onClick={() => hiddenFileInputRef.current?.click()}
              type="button"
              className="rounded-md bg-indigo-500 px-3 py-1 text-white"
            >
              ファイルを選択
            </button>
            {coverImageUrl && (
              <div className="mt-2">
                <Image
                  className="w-1/2 border-2 border-gray-300"
                  src={coverImageUrl}
                  alt="プレビュー画像"
                  width={1024}
                  height={1024}
                  priority
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="font-bold">カテゴリー</div>
            <div className="flex flex-wrap gap-x-3.5">
              {checkableCategories.length > 0 ? (
                checkableCategories.map((category) => (
                  <label key={category.id} className="flex space-x-1">
                    <input
                      id={category.id}
                      type="checkbox"
                      checked={category.isSelect}
                      className="mt-0.5 cursor-pointer"
                      onChange={() => switchCategoryState(category.id)}
                    />
                    <span className="cursor-pointer">{category.name}</span>
                  </label>
                ))
              ) : (
                <div>カテゴリがありません。</div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              >
              作成
            </Button>
          </div>
        </form>
      </main>
    );
  };

  export default Page;
