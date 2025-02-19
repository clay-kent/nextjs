import { z } from "zod";

export type Category = {
  id: string;
  name: string;
};

export const categoryNameSchema = z
  .string()
  .min(2, { message: "2文字以上入力してください。" })
  .max(16, { message: "16文字以内で入力してください。" })
  .nonempty({ message: "このフィールドは必須です。" });
