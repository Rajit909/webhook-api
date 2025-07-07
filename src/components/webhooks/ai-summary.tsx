'use client';

import { useState, useTransition } from 'react';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { WebhookRequest } from '@/lib/types';
import { generateSummaryAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AISummaryProps {
  request: WebhookRequest;
}

export function AISummary({ request }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateSummary = () => {
    startTransition(async () => {
      const result = await generateSummaryAction(request.payload);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setSummary(null);
      } else {
        setSummary(result.summary);
      }
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Summary
          </div>
          <Button onClick={handleGenerateSummary} disabled={isPending} size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : summary ? (
          <p className="text-sm text-muted-foreground">{summary}</p>
        ) : (
          <Alert className="border-dashed">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>No Summary Yet</AlertTitle>
            <AlertDescription>
              Click &quot;Generate&quot; to get an AI-powered summary of the payload.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
