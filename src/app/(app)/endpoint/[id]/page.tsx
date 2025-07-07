'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { WebhookRequest, WebhookEndpoint } from '@/lib/types';
import { RequestList } from '@/components/webhooks/request-list';
import { RequestDetails } from '@/components/webhooks/request-details';
import { Button } from '@/components/ui/button';
import { RefreshCw, TestTube, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EndpointPage({ params }: { params: { id: string } }) {
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [endpoint, setEndpoint] = useState<WebhookEndpoint | null>(null);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    try {
      const response = await fetch(`/api/requests/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setEndpoint(null);
          setRequests([]);
        }
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setEndpoint(data.endpoint);
      setRequests(data.requests);

      if (isInitialLoad) {
        if (data.requests.length > 0) {
          setSelectedRequest(data.requests[0]);
        } else {
          setSelectedRequest(null);
        }
      } else {
        if (selectedRequest && !data.requests.some((r: WebhookRequest) => r.id === selectedRequest.id)) {
          setSelectedRequest(data.requests.length > 0 ? data.requests[0] : null);
        }
      }

    } catch (error) {
        console.error("Error fetching data.", error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [params.id, selectedRequest]);

  // Initial data load
  useEffect(() => {
    fetchData(true);
  }, [params.id]);

  // Polling for new requests
  useEffect(() => {
    const interval = setInterval(() => {
        if (!document.hidden) {
            fetchData(false);
        }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [fetchData]);


  useEffect(() => {
    if (typeof window !== 'undefined' && endpoint) {
      setWebhookUrl(`${window.location.origin}/api/ingest/${endpoint.id}`);
    }
  }, [endpoint]);

  const handleSimulateRequest = async () => {
    if (!endpoint) return;
    setIsSimulating(true);

    try {
      await fetch(`/api/ingest/${endpoint.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'This is a simulated request from the UI.',
          timestamp: new Date().toISOString(),
          source: `simulation-ui`,
          user: 'webhook-weaver-tester'
        }),
      });
      // After simulating, refresh the data to show the new request
      fetchData(false);
    } catch (error) {
       console.error("Failed to simulate request", error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleManualRefresh = () => {
    fetchData(false);
  }
  
  const handleDeleteEndpoint = async () => {
    if (!endpoint) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/endpoints/${endpoint.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to delete endpoint');
        // Optionally show a toast notification on error
      }
    } catch (error) {
      console.error('Failed to delete endpoint', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading Endpoint...</h2>
        </div>
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Endpoint not found</h2>
          <p className="text-muted-foreground">The requested endpoint does not exist or could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{endpoint.name}</h1>
            <p className="text-muted-foreground">{endpoint.description}</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
              <span className="font-bold">URL:</span> {webhookUrl}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleManualRefresh} variant="outline" size="icon" disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleSimulateRequest} variant="outline" disabled={isSimulating}>
              <TestTube className="mr-2 h-4 w-4" />
              {isSimulating ? 'Sending...' : 'Simulate Request'}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Endpoint</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this
                    endpoint and all of its associated requests.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteEndpoint} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
