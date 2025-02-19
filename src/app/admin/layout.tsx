"use client";

import React from "react";
import { useRouteGuard } from "@/app/_hooks/useRouteGuard";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const { isAuthenticated } = useRouteGuard();

  // 認証済みが確認できるまでは何も表示しない
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AdminLayout;