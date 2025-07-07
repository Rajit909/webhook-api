'use client';

import { useState, useEffect } from 'react';
import type { WebhookRequest, WebhookEndpoint } from '@/lib/types';
import { initialRequests, initialEndpoints } from '@/lib/data';
import { RequestList } from '@/components/webhooks/request-list';
import { RequestDetails } from '@/components/webhooks/request-details';

export default function EndpointPage({ params }: { params: { id: string } }) {
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [endpoint, setEndpoint] = useState<WebhookEndpoint | null>(null);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);

  useEffect(() => {
    const currentEndpoint = initialEndpoints.find(ep => ep.id === params.id) || null;
    const associatedRequests = initialRequests
      .filter(req => req.endpointId === params.id)
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
      
    setEndpoint(currentEndpoint);
    setRequests(associatedRequests);

    if (associatedRequests.length > 0) {
      setSelectedRequest(associatedRequests[0]);
    } else {
      setSelectedRequest(null);
    }
  }, [params.id]);

  if (!endpoint) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Endpoint not found</h2>
          <p className="text-muted-foreground">The requested endpoint does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">{endpoint.name}</h1>
        <p className="text-muted-foreground">{endpoint.description}</p>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          <span className="font-bold">URL:</span> https://api.webhook-weaver.com/ingest/{endpoint.id}
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-[75vh]">
        <div className="xl:col-span-1 h-full">
          <RequestList 
            requests={requests} 
            onSelectRequest={setSelectedRequest}
            selectedRequestId={selectedRequest?.id || null}
          />
        </div>
        <div className="xl:col-span-2 h-full overflow-y-auto">
          <RequestDetails request={selectedRequest} />
        </div>
      </div>
    </div>
  );
}
