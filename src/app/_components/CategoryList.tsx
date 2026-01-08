import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useCategories } from "../_hooks/useCategories";

const CategoryList: React.FC = () => {
  const { data, error, isLoading, mutate } = useCategories();

  return (
    <div>
      <div className="mb-2 text-2xl font-bold">作成されたカテゴリの一覧</div>
      {!data || data.length === 0 ? (
        <div className="text-gray-500">
          （カテゴリは1個も作成されていません）
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2">
            {data.map((category) => (
              <div
                key={category.id}
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "border border-slate-400 text-slate-500"
                )}
              >
                <Link href={`/admin/categories/${category.id}`}>
                  {category.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
