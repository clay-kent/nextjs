import { useState } from "react";
import Link from "next/link";
import { Post } from "../_types/Post";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { useDeletePost } from "../_hooks/useDeletePost";

type Props = {
  post: Post;
  onDelete: () => void;
};

export const AdminPostSummary: React.FC<Props> = ({ post, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deletePost, isDeleting } = useDeletePost();

  const handleDelete = async () => {
    const success = await deletePost(post.id);
    if (success) {
      onDelete();
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="text-sm text-gray-500">
          作成日: {new Date(post.createdAt).toLocaleDateString("ja-JP")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link 
          href={`/admin/posts/${post.id}`}
          className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          編集
        </Link>
        <Button
          variant="danger"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
        >
          削除
        </Button>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="投稿の削除"
        message="この投稿を削除してもよろしいですか？"
      />
    </div>
  );
};