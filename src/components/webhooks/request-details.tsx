import type { WebhookRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from './code-block';
import { AISummary } from './ai-summary';
import { ArrowLeftRight, AtSign, Calendar, Hash, Server } from 'lucide-react';
import { format } from 'date-fns';

interface RequestDetailsProps {
  request: WebhookRequest | null;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  if (!request) {
    return (
      <Card className="flex h-full min-h-[70vh] items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Server className="mx-auto h-12 w-12" />
          <p className="mt-4 text-lg">Select a request to view its details</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Received on {format(new Date(request.receivedAt), 'PPP p')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Request ID:</span>
              <span className="font-mono text-muted-foreground text-xs">{request.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <AtSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Endpoint ID:</span>
              <span className="font-mono text-muted-foreground text-xs">{request.endpointId}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Method:</span>
              <span className="font-mono text-muted-foreground">{request.method}</span>
            </div>
             <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Status:</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                request.statusCode >= 200 && request.statusCode < 300
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>{request.statusCode}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <h4 className="font-medium mb-2">Headers</h4>
          <CodeBlock data={request.headers} title="Request Headers" className="h-64" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <CodeBlock data={request.payload} title="Payload" />
        <AISummary request={request} />
      </div>
    </div>
  );
}
