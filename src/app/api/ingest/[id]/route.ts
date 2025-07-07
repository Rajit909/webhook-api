import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import type { WebhookRequest } from '@/lib/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const endpointId = params.id;

  const endpointExists = db.data?.endpoints.some(ep => ep.id === endpointId);
  if (!endpointExists) {
    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  }

  let payload: any;
  const contentType = req.headers.get('content-type');
  try {
     if (contentType && contentType.includes('application/json')) {
        payload = await req.json();
     } else {
        payload = await req.text();
     }
  } catch (e) {
    payload = { error: "Could not parse body" };
  }

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const newRequest: WebhookRequest = {
    id: `req_${Math.random().toString(36).substring(2, 11)}`,
    endpointId: endpointId,
    receivedAt: new Date().toISOString(),
    method: req.method as WebhookRequest['method'],
    headers: headers,
    payload: payload,
    statusCode: 200, 
  };

  if (db.data) {
    db.data.requests.unshift(newRequest);
    await db.write();
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
      status: 204,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-GitHub-Event, Stripe-Signature, Authorization',
      },
  });
}
