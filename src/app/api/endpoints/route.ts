import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { WebhookEndpoint } from '@/lib/types';

export async function GET() {
  const db = await getDb();
  const endpoints = db.data?.endpoints || [];
  const sortedEndpoints = endpoints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sortedEndpoints);
}

export async function POST() {
    const db = await getDb();
    const newId = `ep_${Math.random().toString(36).substring(2, 9)}`;
    const newEndpoint: WebhookEndpoint = {
        id: newId,
        name: 'New Endpoint',
        description: 'A newly created endpoint.',
        createdAt: new Date().toISOString(),
    };

    if (db.data) {
        db.data.endpoints.unshift(newEndpoint);
        await db.write();
    }

    return NextResponse.json(newEndpoint, { status: 201 });
}
