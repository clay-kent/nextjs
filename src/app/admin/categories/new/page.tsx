"use client";
import CategoryList from "@/app/_components/CategoryList";
import { Loader } from "@/app/_components/Loader";
import SubmittingOverlay from "@/app/_components/SubmittingOverlay";
import { useCategories } from "@/app/_hooks/useCategories";
import { useSubmitCategory } from "@/app/_hooks/useSubmitCategory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { categoryNameSchema } from "@/app/_types/Category";

const schema = z.object({
  name: categoryNameSchema,
});

type FormData = z.infer<typeof schema>;

const Page: React.FC = () => {
  const { data, error, isLoading, mutate } = useCategories();
  const { submitCategory, isSubmitting } = useSubmitCategory(mutate);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const success = await submitCategory(data.name);
  };

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">カテゴリの新規作成</div>
      <Loader isLoading={isLoading} error={error}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={twMerge("mb-4 space-y-4", isSubmitting && "opacity-50")}
        >
          <SubmittingOverlay isSubmitting={isSubmitting} />
          <div className="space-y-1">
            <label htmlFor="name" className="block font-bold">
              名前
            </label>
            <input
              id="name"
              className="w-full rounded-md border-2 px-2 py-1"
              placeholder="新しいカテゴリの名前を記入してください"
              autoComplete="off"
              required
              {...register("name")}
            />
            {errors && (
              <div className="flex items-center space-x-1 text-sm font-bold text-red-500">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="mr-0.5"
                />
                <div>{errors.name?.message}</div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={twMerge(
                "rounded-md px-5 py-1 font-bold",
                "bg-indigo-500 text-white hover:bg-indigo-600",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
              disabled={isSubmitting}
            >
              カテゴリを作成
            </button>
          </div>
        </form>
        <CategoryList />
      </Loader>
    </main>
  );
};

export default Page;
