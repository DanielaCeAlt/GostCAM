// =============================================
// PROXY: Next.js → Python Backend
// Reenvía todas las llamadas /api/python/* a http://localhost:8000/*
// Esto permite que dispositivos móviles accedan al backend sin
// usar "localhost" directamente (que en el celular apunta al celular).
// =============================================

import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API = process.env.PYTHON_API_URL || 'http://localhost:8000';

async function proxy(request: NextRequest, params: { path: string[] }) {
  const path = params.path.join('/');
  const search = request.nextUrl.search;
  const targetUrl = `${PYTHON_API}/${path}${search}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authorization = request.headers.get('authorization');
  if (authorization) {
    headers['Authorization'] = authorization;
  }

  let body: string | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.text();
    } catch {
      // sin body
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error(`[Python Proxy] Error al llamar ${targetUrl}:`, error);
    return NextResponse.json(
      { success: false, error: 'Backend Python no disponible' },
      { status: 503 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params);
}
