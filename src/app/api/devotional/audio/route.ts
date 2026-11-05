import { NextRequest, NextResponse } from "next/server";
import { getDailyDevotional } from "@/lib/public/daily-devotional";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let audioUrl = searchParams.get("url");

    if (!audioUrl) {
      const dev = await getDailyDevotional();
      audioUrl = dev?.audioUrl || null;
    }

    if (!audioUrl) {
      return new NextResponse("Audio no disponible", { status: 404 });
    }

    // Seguridad: verificar que apunte a Omny o Triton Digital
    const parsed = new URL(audioUrl);
    const allowedHosts = ["traffic.omny.fm", "omny.fm", "omnycontent.com", "tritondigital.com"];
    const isAllowed = allowedHosts.some(
      (h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`)
    );

    if (!isAllowed) {
      return new NextResponse("Host no permitido", { status: 400 });
    }

    const rangeHeader = request.headers.get("range");

    const fetchHeaders: HeadersInit = {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    };

    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    const upstreamResponse = await fetch(audioUrl, {
      headers: fetchHeaders,
      redirect: "follow",
    });

    if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
      return new NextResponse("Error obteniendo audio", { status: upstreamResponse.status });
    }

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      upstreamResponse.headers.get("content-type") || "audio/mpeg"
    );
    responseHeaders.set("Accept-Ranges", "bytes");
    responseHeaders.set("Cache-Control", "public, max-age=86400, s-maxage=86400");

    const contentLength = upstreamResponse.headers.get("content-length");
    if (contentLength) responseHeaders.set("Content-Length", contentLength);

    const contentRange = upstreamResponse.headers.get("content-range");
    if (contentRange) responseHeaders.set("Content-Range", contentRange);

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[DevotionalAudio] Proxy error:", error);
    return new NextResponse("Error interno de audio", { status: 500 });
  }
}
