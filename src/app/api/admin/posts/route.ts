import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { Post, Prisma } from "@prisma/client";
import { supabase } from "@/utils/supabase";

type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
};

export const POST = async (req: NextRequest) => {
  // JWTトークンの検証・認証
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return NextResponse.json(
      { error: "認証エラー: " + error.message },
      { status: 401 }
    );
  }

  try {
    const requestBody: RequestBody = await req.json();
    const { title, content, coverImageURL, categoryIds } = requestBody;

    // Create post record with relations
    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImageURL,
        // Create category relations using Prisma's nested writes
        categories: {
          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);

    // Handle foreign key constraint violations (non-existent categories)
    if (
      error instanceof Error &&
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "One or more specified categories do not exist" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
};
