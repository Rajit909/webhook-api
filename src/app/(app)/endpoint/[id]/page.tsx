'use client';

import { useState, useEffect } from 'react';
import type { WebhookRequest, WebhookEndpoint } from '@/lib/types';
import { initialRequests, initialEndpoints } from '@/lib/data';
import { RequestList } from '@/components/webhooks/request-list';
import { RequestDetails } from '@/components/webhooks/request-details';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';

export default function EndpointPage({ params }: { params: { id: string } }) {
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [endpoint, setEndpoint] = useState<WebhookEndpoint | null>(null);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      let allEndpoints: WebhookEndpoint[];
      let allRequests: WebhookRequest[];

      const storedEndpointsStr = localStorage.getItem('webhook_endpoints');
      if (storedEndpointsStr) {
        allEndpoints = JSON.parse(storedEndpointsStr);
      } else {
        allEndpoints = initialEndpoints;
        localStorage.setItem('webhook_endpoints', JSON.stringify(initialEndpoints));
      }
      
      const storedRequestsStr = localStorage.getItem('webhook_requests');
      if (storedRequestsStr) {
        allRequests = JSON.parse(storedRequestsStr);
      } else {
        allRequests = initialRequests;
        localStorage.setItem('webhook_requests', JSON.stringify(initialRequests));
      }

      const currentEndpoint = allEndpoints.find((ep) => ep.id === params.id) || null;
      const associatedRequests = allRequests
        .filter((req) => req.endpointId === params.id)
        .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
        
      setEndpoint(currentEndpoint);
      setRequests(associatedRequests);

      if (associatedRequests.length > 0) {
        setSelectedRequest(associatedRequests[0]);
      } else {
        setSelectedRequest(null);
      }
    } catch (error) {
        console.error("Error accessing localStorage. Falling back to initial data.", error);
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
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const handleSimulateRequest = () => {
    if (!endpoint) return;

    const newRequestId = `req_sim_${Math.random().toString(36).substring(2, 9)}`;
    const newRequest: WebhookRequest = {
      id: newRequestId,
      endpointId: endpoint.id,
      receivedAt: new Date().toISOString(),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Simulation-Source': 'WebhookWeaverUI' },
      payload: { 
        message: 'This is a simulated request.',
        timestamp: new Date().toISOString(),
        source: `simulation-ui`
      },
      statusCode: 200,
    };

    try {
      const storedRequestsStr = localStorage.getItem('webhook_requests');
      const allRequests = storedRequestsStr ? JSON.parse(storedRequestsStr) : initialRequests;
      const updatedRequests = [newRequest, ...allRequests];
      localStorage.setItem('webhook_requests', JSON.stringify(updatedRequests));

      const associatedRequests = updatedRequests
        .filter((req: WebhookRequest) => req.endpointId === params.id)
        .sort((a: WebhookRequest, b: WebhookRequest) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
      
      setRequests(associatedRequests);
      setSelectedRequest(newRequest);
    } catch (error) {
      console.error("Failed to simulate request", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{endpoint.name}</h1>
            <p className="text-muted-foreground">{endpoint.description}</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              <span className="font-bold">URL:</span> https://api.webhook-weaver.com/ingest/{endpoint.id}
            </p>
          </div>
          <Button onClick={handleSimulateRequest} variant="outline">
            <TestTube className="mr-2 h-4 w-4" />
            Simulate Request
          </Button>
        </div>
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
