"use client";
import { useState } from "react";
import CategoryList from "@/app/_components/CategoryList";
import { Loader } from "@/app/_components/Loader";
import { ConfirmDialog } from "@/app/_components/ConfirmDialog";
import { useCategories } from "@/app/_hooks/useCategories";
import { useEditCategory } from "@/app/_hooks/useEditCategory";
import { useDeleteCategory } from "@/app/_hooks/useDeleteCategory";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { categoryNameSchema } from "@/app/_types/Category";

const schema = z.object({
  name: categoryNameSchema,
});

type FormData = z.infer<typeof schema>;

const Page: React.FC = () => {
  const { data, error, isLoading, mutate } = useCategories();
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //TODO: [id]/foo/barなどの不正なパス デバッグ
  useEffect(() => {
    if (!isLoading && data && !data.some((cat) => cat.id === categoryId)) {
      notFound();
    }
  }, [data, isLoading, categoryId]);

  const initialName = data?.find((cat) => cat.id === categoryId)?.name ?? "";
  const { editCategory, isEditing } = useEditCategory(mutate);
  const { deleteCategory, isDeleting } = useDeleteCategory(mutate);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { name: initialName },
  });

  const onSubmit = async (data: FormData) => {
    const success = await editCategory(categoryId, data.name);
    if (success) {
      router.push("/admin/categories/new");
    }
  };

  const handleDelete = async () => {
    const success = await deleteCategory(categoryId);
    if (success) {
      router.push("/admin/categories/new");
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <main>
      <div className="section-title">カテゴリの編集・削除</div>
      <Loader isLoading={isLoading} error={error}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={twMerge("mb-4 space-y-4", isSubmitting && "opacity-50")}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              カテゴリ名
            </label>
            <div className="mt-1">
              <input
                {...register("name", { required: "必須です" })}
                id="name"
                type="text"
                autoComplete="name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              削除
            </button>
            <div className="space-x-4">
              <button
                type="button"
                onClick={() => router.push("/admin/categories/new")}
                className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </form>
        <CategoryList />

        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="カテゴリの削除"
          message="このカテゴリを削除してもよろしいですか？"
        />
      </Loader>
    </main>
  );
};

export default Page;
