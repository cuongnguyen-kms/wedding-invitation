import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  return NextResponse.redirect(new URL(`/invite/${slug}`, request.url));
}
