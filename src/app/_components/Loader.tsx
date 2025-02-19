import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type LoaderProps = {
  isLoading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
};

export const Loader: React.FC<LoaderProps> = ({
  isLoading,
  error,
  children,
}) => {
  if (!isLoading) return <>{children}</>;

  // カテゴリをウェブAPIから取得することに失敗したときの画面
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="text-gray-500">
      <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
      Loading...
    </div>
  );
};
