import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post, Category } from "@prisma/client";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type RequestBody = {
  title: string;
  content: string;
  coverImageURL?: string;
  categoryIds: string[];
};

export const GET = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const { id } = await routeParams.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "投稿記事が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const { id } = await routeParams.params;
    const { title, content, coverImageURL, categoryIds }: RequestBody = await req.json();

    if (!title || !content || !categoryIds || categoryIds.length === 0) {
      return NextResponse.json(
        { error: "タイトル・内容・カテゴリーは必須です" },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      content,
      categories: {
        set: categoryIds.map((id) => ({ id })),
      },
      updatedAt: new Date(),
    };

    if (coverImageURL) {
      updateData.coverImageURL = coverImageURL;
    }

    const post: Post = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の更新に失敗しました" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const { id } = await routeParams.params;
    const post: Post = await prisma.post.delete({ where: { id } });
    return NextResponse.json({ msg: `投稿「${post.title}」を削除しました。` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 }
    );
  }
};
