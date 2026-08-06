import { NextResponse, type NextRequest } from "next/server";

const UNAUTHORIZED_HEADERS = {
  "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
};

function isAuthorized(request: NextRequest, username: string, password: string): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  const encoded = authHeader.slice("Basic ".length);

  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    return false;
  }

  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  return user === username && pass === password;
}

const PUBLIC_PHOTO_IMAGE_PATTERN = /^\/api\/photos\/[^/]+\/(thumb|full)$/;

export function proxy(request: NextRequest) {
  if (PUBLIC_PHOTO_IMAGE_PATTERN.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse(
      "Admin access is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.",
      { status: 503 },
    );
  }

  if (isAuthorized(request, username, password)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: UNAUTHORIZED_HEADERS,
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/guests/:path*", "/api/settings/:path*", "/api/photos/:path*"],
};
