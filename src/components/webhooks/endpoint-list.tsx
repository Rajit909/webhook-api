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
import { initialEndpoints } from '@/lib/data';

export function EndpointList() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      const storedEndpoints = localStorage.getItem('webhook_endpoints');
      if (storedEndpoints) {
        setEndpoints(JSON.parse(storedEndpoints));
      } else {
        localStorage.setItem('webhook_endpoints', JSON.stringify(initialEndpoints));
        setEndpoints(initialEndpoints);
      }
    } catch (error) {
      console.error('Failed to access localStorage', error);
      setEndpoints(initialEndpoints);
    }
  }, []);

  const handleCreateEndpoint = () => {
    const newId = `ep_new_${Math.random().toString(36).substring(2, 9)}`;
    const newEndpoint: WebhookEndpoint = {
      id: newId,
      name: 'New Endpoint',
      description: 'A newly created endpoint.',
      createdAt: new Date().toISOString(),
    };
    
    setEndpoints(prev => {
      const updatedEndpoints = [newEndpoint, ...prev];
      try {
        localStorage.setItem('webhook_endpoints', JSON.stringify(updatedEndpoints));
      } catch (error) {
        console.error('Failed to save to localStorage', error);
      }
      return updatedEndpoints;
    });

    router.push(`/endpoint/${newId}`);
  };
  
  return (
    <div className="flex flex-col h-full p-2">
       <Button onClick={handleCreateEndpoint} className="mb-4 w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Endpoint
        </Button>
      <SidebarMenu>
        {endpoints.map(endpoint => {
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
        })}
      </SidebarMenu>
    </div>
  );
}
