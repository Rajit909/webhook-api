'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileJson } from 'lucide-react';

interface CodeBlockProps {
  data: Record<string, any>;
  title: string;
  className?: string;
}

export function CodeBlock({ data, title, className }: CodeBlockProps) {
  const formattedJson = JSON.stringify(data, null, 2);

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileJson className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4.5rem)]">
        <ScrollArea className="h-full rounded-md border bg-background/50">
          <pre className="p-4 text-sm font-code">
            <code>{formattedJson}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
