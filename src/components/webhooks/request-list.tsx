'use client';

import { useState, useMemo } from 'react';
import type { WebhookRequest } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';

interface RequestListProps {
  requests: WebhookRequest[];
  onSelectRequest: (request: WebhookRequest) => void;
  selectedRequestId: string | null;
}

export function RequestList({ requests, onSelectRequest, selectedRequestId }: RequestListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = useMemo(() => {
    if (!searchTerm) return requests;
    return requests.filter(req => {
      const search = searchTerm.toLowerCase();
      return (
        req.id.toLowerCase().includes(search) ||
        req.statusCode.toString().includes(search) ||
        JSON.stringify(req.payload).toLowerCase().includes(search)
      );
    });
  }, [requests, searchTerm]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Incoming Requests</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-8rem)] p-0">
        <ScrollArea className="h-full">
          {filteredRequests.length > 0 ? (
            <div className="space-y-1 p-2">
              {filteredRequests.map(req => (
                <button
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className={cn(
                    'w-full text-left p-3 rounded-md transition-colors hover:bg-muted',
                    selectedRequestId === req.id && 'bg-muted'
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-sm ${
                      req.statusCode >= 200 && req.statusCode < 300 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {req.method} {req.statusCode}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(req.receivedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate font-mono">{req.id}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <p>No requests found.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
