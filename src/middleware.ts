// src/middleware.ts - Versão Corrigida
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin"];
const authRoutes = ["/login"];
const protectedApiRoutes = ["/api/admin"];
const publicApiRoutes = ["/api/placeholder", "/api/health"];

function isUserAuthenticated(request: NextRequest): boolean {
  // Verificar múltiplas fontes de autenticação
  const authCookie = request.cookies.get("portfolio_token");
  const authHeader = request.headers.get("Authorization");
  
  // Validação mais robusta do cookie
  const hasValidCookie = !!(
    authCookie?.value && 
    authCookie.value.length > 10 && // Mínimo de caracteres
    authCookie.value !== "undefined" &&
    authCookie.value.startsWith("demo-jwt-token")
  );
  
  const hasValidAuthHeader = !!(
    authHeader && 
    authHeader.startsWith("Bearer ") && 
    authHeader.length > 20 // Token mínimo
  );

  return hasValidCookie || hasValidAuthHeader;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = isUserAuthenticated(request);

  // CORS headers para todas as respostas
  const response = NextResponse.next();
  
  // Headers de segurança básicos
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Proteção de rotas admin
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirecionamento se já autenticado
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/admin";
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
  }

  // Proteção de APIs
  if (protectedApiRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Autenticação necessária",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(png|jpg|jpeg|gif|svg|ico)$).*)",
  ],
};