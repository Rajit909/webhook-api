import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const endpointId = params.id;

  if (db.data) {
    const initialEndpointCount = db.data.endpoints.length;
    db.data.endpoints = db.data.endpoints.filter(ep => ep.id !== endpointId);
    
    if (db.data.endpoints.length === initialEndpointCount) {
        return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }

    // Also delete associated requests
    db.data.requests = db.data.requests.filter(req => req.endpointId !== endpointId);
    
    await db.write();
  }

  return NextResponse.json({ message: 'Endpoint deleted successfully' }, { status: 200 });
}
