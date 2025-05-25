// app/api/placeholder/[...params]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    // Extrair largura e altura dos parâmetros
    const [width = "400", height = "300"] = params.params;
    const w = parseInt(width);
    const h = parseInt(height);

    // Validar dimensões
    if (w < 1 || w > 2000 || h < 1 || h > 2000) {
      return NextResponse.json(
        { error: "Dimensões inválidas (1-2000px)" },
        { status: 400 }
      );
    }

    // Gerar SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="#475569" stroke-width="2"/>
        <text x="50%" y="50%" font-family="ui-sans-serif, system-ui" font-size="16" fill="#94a3b8" text-anchor="middle" dy=".3em">
          ${w} × ${h}
        </text>
      </svg>
    `;

    // Retornar SVG com headers corretos
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Erro na API de placeholder:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
