import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas protegidas da interface
const protectedRoutes = ["/admin"];

// Rotas públicas (ex: login)
const authRoutes = ["/login"];

// Rotas de API protegidas
const protectedApiRoutes = ["/api/admin"];

// Rotas de API públicas que não precisam de autenticação
const publicApiRoutes = ["/api/placeholder", "/api/health", "/api/contact"];

// Lista de origens permitidas para CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001", 
  "https://luizfelippe.dev",
  "https://www.luizfelippe.dev"
];

// Verifica se o usuário está autenticado
function isUserAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get("portfolio_token");
  const authHeader = request.headers.get("Authorization");
  
  // Verifica se há token válido
  const hasValidToken = !!(
    authCookie?.value && 
    authCookie.value.length > 0 && 
    authCookie.value !== "undefined"
  );
  
  const hasValidAuthHeader = !!(
    authHeader && 
    authHeader.startsWith("Bearer ") && 
    authHeader.length > 7
  );

  const isDev = process.env.NODE_ENV === "development";

  return hasValidToken || hasValidAuthHeader || isDev;
}

// Função para obter a origem CORS apropriada
function getCorsOrigin(request: NextRequest): string {
  const origin = request.headers.get("origin");
  
  if (!origin) return "*";
  
  // Em desenvolvimento, permite qualquer localhost
  if (process.env.NODE_ENV === "development" && origin.includes("localhost")) {
    return origin;
  }
  
  // Em produção, verifica lista de origens permitidas
  return allowedOrigins.includes(origin) ? origin : "null";
}

// Função para verificar se é uma rota pública da API
function isPublicApiRoute(pathname: string): boolean {
  return publicApiRoutes.some(route => pathname.startsWith(route));
}

// Função para logs estruturados
function logMiddleware(level: "info" | "warn" | "error", message: string, data?: any) {
  if (process.env.NODE_ENV === "production") return;
  
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Middleware:${level.toUpperCase()}] ${message}`, data || "");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = isUserAuthenticated(request);
  const origin = request.headers.get("origin");

  // 🔧 Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": getCorsOrigin(request),
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  // 🔒 Rotas protegidas da interface
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);

      logMiddleware("warn", `Acesso negado a ${pathname}, redirecionando para login`);

      return NextResponse.redirect(loginUrl);
    }

    logMiddleware("info", `Acesso permitido a ${pathname}`);
  }

  // 🔁 Rotas públicas (ex: login) redireciona se já autenticado
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const callbackUrl =
        request.nextUrl.searchParams.get("callbackUrl") || "/admin";

      logMiddleware("info", `Usuário autenticado, redirecionando para ${callbackUrl}`);

      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
  }

  // 🛡️ Rotas de API protegidas
  if (
    protectedApiRoutes.some((route) => pathname.startsWith(route)) &&
    !isPublicApiRoute(pathname)
  ) {
    if (!isAuthenticated) {
      logMiddleware("warn", `Acesso negado à API: ${pathname}`, {
        origin,
        userAgent: request.headers.get("user-agent"),
        ip: request.ip || request.headers.get("x-forwarded-for")
      });

      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Autenticação necessária",
          code: "auth_required",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { 
            "content-type": "application/json",
            "Access-Control-Allow-Origin": getCorsOrigin(request),
            "Access-Control-Allow-Credentials": "true",
          },
        },
      );
    }
  }

  // ✅ Resposta padrão com headers de segurança
  const response = NextResponse.next();

  // Headers de segurança aprimorados
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  
  // CSP básico (ajuste conforme necessário)
  if (!pathname.startsWith("/api/")) {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );
  }

  // Headers CORS aprimorados para API
  if (pathname.startsWith("/api/")) {
    const corsOrigin = getCorsOrigin(request);
    
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400");
    
    // Rate limiting headers (se implementado)
    if (request.headers.get("x-ratelimit-remaining")) {
      response.headers.set("X-RateLimit-Remaining", request.headers.get("x-ratelimit-remaining")!);
    }
  }

  return response;
}

// Define quais caminhos o middleware deve interceptar
export const config = {
  matcher: [
    /*
     * Executa em todos os caminhos exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico e outros ícones
     * - arquivos de manifest e service worker
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|apple-icon.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};