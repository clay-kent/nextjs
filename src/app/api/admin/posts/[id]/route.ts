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
      select: {
        id: true,
        title: true,
        content: true,
        coverImageURL: true,
        createdAt: true,
        categories: {
          select: {
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "投稿記事が見つかりません" },
        { status: 404 }
      );
    }

    const transformedPost = {
      ...post,
      categories: post.categories.map((c) => c.category),
    };

    return NextResponse.json(transformedPost);
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

    await prisma.postCategory.deleteMany({ where: { postId: id } });

    const updateData: any = {
      title,
      content,
      updatedAt: new Date(),
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
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
