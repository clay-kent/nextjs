"use client";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";

// 言語定義のみを登録する（実行はページ側で行う）
export { Prism };

export default function PrismInit() {
  return null;
}
