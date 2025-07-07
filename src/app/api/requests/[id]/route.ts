import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const endpointId = params.id;
  
  const endpoint = db.data?.endpoints.find(ep => ep.id === endpointId) || null;
  if (!endpoint) {
    // Return a 404 if the endpoint itself doesn't exist
    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  }

  const requests = (db.data?.requests || [])
    .filter(req => req.endpointId === endpointId)
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

  return NextResponse.json({ endpoint, requests });
}
