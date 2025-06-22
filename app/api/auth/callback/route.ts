import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.OAUTH_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenRes.json();
  const idToken = tokenData.id_token;
  if (!idToken) return NextResponse.json({ error: "No id_token" }, { status: 400 });

  // Decode ID token to get email
  const payload = jwt.decode(idToken) as { email: string } | null;
  if (!payload || payload.email !== "mudge.andre@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Set a signed cookie (JWT)
  const sessionToken = jwt.sign(
    { email: payload.email },
    process.env.COOKIE_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.redirect("/");
  response.cookies.set("blog_auth", sessionToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return response;
}