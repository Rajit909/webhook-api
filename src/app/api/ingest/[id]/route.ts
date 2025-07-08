import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import type { WebhookRequest } from '@/lib/types';

// Be more permissive with CORS for easier integration with various services,
// including custom headers that might be sent by APIs like ABDM.
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CM-ID, X-HIP-ID, X-GitHub-Event, Stripe-Signature, *',
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const endpointId = params.id;

  // Added [POST] prefix for clearer logging
  console.log(`\n--- [ingest][POST] New Request for Endpoint: ${endpointId} ---`);
  console.log(`Method: ${req.method}`);
  console.log('Headers:');
  req.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });
  
  const db = await getDb();

  const endpointExists = db.data?.endpoints.some(ep => ep.id === endpointId);
  if (!endpointExists) {
    console.error(`[ingest] Endpoint not found: ${endpointId}`);
    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404, headers: CORS_HEADERS });
  }

  let payload: any;
  const contentType = req.headers.get('content-type');
  
  console.log('Parsing payload...');
  try {
     if (contentType && contentType.includes('application/json')) {
        payload = await req.json();
     } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        // Handle form data
        const formData = await req.formData();
        payload = Object.fromEntries(formData.entries());
     } else {
        // Fallback to text for everything else (e.g., XML, plain text)
        payload = await req.text();
     }
     console.log(`[ingest] Parsed payload for ${endpointId}`);
  } catch (e) {
    const error = e as Error;
    console.error(`[ingest] Failed to parse payload for ${endpointId}:`, error);
    payload = { error: "Could not parse request body", details: error.message };
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
    console.log(`[ingest] Successfully saved request ${newRequest.id} for endpoint ${endpointId}`);
  }

  console.log('--- [ingest][POST] End Request ---');
  return NextResponse.json({ message: 'Webhook received' }, { status: 200, headers: CORS_HEADERS });
}

// Handle CORS preflight requests with logging
export async function OPTIONS(req: NextRequest) {
  console.log(`\n--- [ingest][OPTIONS] Preflight Request Received ---`);
  console.log(`From Origin: ${req.headers.get('origin')}`);
  console.log(`Request Method: ${req.headers.get('access-control-request-method')}`);
  console.log(`Request Headers: ${req.headers.get('access-control-request-headers')}`);
  console.log(`--- [ingest][OPTIONS] Responding with CORS headers ---`);

  return new NextResponse(null, {
      status: 204, // No Content
      headers: CORS_HEADERS,
  });
}
