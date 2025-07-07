'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, Webhook } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import type { WebhookEndpoint } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';


export function EndpointList() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/endpoints');
        const data = await response.json();
        setEndpoints(data);
      } catch (error) {
        console.error('Failed to fetch endpoints', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEndpoints();
  }, []);

  const handleCreateEndpoint = async () => {
    try {
      const response = await fetch('/api/endpoints', { method: 'POST' });
      if (response.ok) {
        const newEndpoint = await response.json();
        setEndpoints(prev => [newEndpoint, ...prev]);
        router.push(`/endpoint/${newEndpoint.id}`);
      } else {
        console.error('Failed to create endpoint');
      }
    } catch (error) {
      console.error('Failed to create endpoint', error);
    }
  };
  
  return (
    <div className="flex flex-col h-full p-2">
       <Button onClick={handleCreateEndpoint} className="mb-4 w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Endpoint
        </Button>
      <SidebarMenu>
        {loading ? (
            <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </>
        ) : (
            endpoints.map(endpoint => {
            const isActive = pathname === `/endpoint/${endpoint.id}`;
            return (
                <SidebarMenuItem key={endpoint.id}>
                <Link href={`/endpoint/${endpoint.id}`} className="w-full">
                    <SidebarMenuButton tooltip={endpoint.name} isActive={isActive}>
                    <Webhook />
                    <span>{endpoint.name}</span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            );
            })
        )}
      </SidebarMenu>
    </div>
  );
}
