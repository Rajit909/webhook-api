export type WebhookRequest = {
  id: string;
  endpointId: string;
  receivedAt: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  headers: Record<string, string>;
  payload: Record<string, any>;
  statusCode: 200 | 201 | 400 | 404 | 500;
};

export type WebhookEndpoint = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};
