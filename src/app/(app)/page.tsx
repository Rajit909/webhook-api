import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Webhook } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <Webhook className="mx-auto h-16 w-16 text-primary" />
          <CardTitle className="mt-4 text-2xl font-bold">Welcome to Webhook Weaver</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your central hub for managing and debugging webhooks.
          </p>
          <p className="mt-2 text-muted-foreground">
            Select an endpoint from the sidebar to view its requests, or create a new one to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
