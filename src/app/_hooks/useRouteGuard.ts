import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const useRouteGuard = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();

  useEffect(() => {
    // 認証状況の確認中は何もせずに戻る
    if (isLoading) {
      return;
    }
    // 認証確認後、未認証であればログインページにリダイレクト
    if (session === null) {
      router.replace("/login");
    }
  }, [isLoading, router, session]);

  return {
    isLoading,
    isAuthenticated: session !== null,
  };
};