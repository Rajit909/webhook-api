import type { WebhookEndpoint, WebhookRequest } from './types';

export const initialEndpoints: WebhookEndpoint[] = [
  {
    id: 'ep_github_123',
    name: 'GitHub Webhooks',
    description: 'Receives push and PR events from GitHub.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ep_stripe_456',
    name: 'Stripe Events',
    description: 'Handles payment success and failure events.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ep_slack_789',
    name: 'Slack Notifications',
    description: 'Incoming messages from a Slack channel.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const initialRequests: WebhookRequest[] = [
  {
    id: 'req_gh_001',
    endpointId: 'ep_github_123',
    receivedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-GitHub-Event': 'push' },
    payload: {
      ref: 'refs/heads/main',
      repository: { name: 'webhook-weaver', full_name: 'user/webhook-weaver' },
      pusher: { name: 'devuser', email: 'dev@example.com' },
    },
    statusCode: 200,
  },
  {
    id: 'req_gh_002',
    endpointId: 'ep_github_123',
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-GitHub-Event': 'pull_request' },
    payload: {
      action: 'opened',
      number: 42,
      pull_request: { title: 'Add new feature', user: { login: 'another-dev' } },
    },
    statusCode: 200,
  },
  {
    id: 'req_st_001',
    endpointId: 'ep_stripe_456',
    receivedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': 'whsec_...' },
    payload: {
      id: 'evt_12345',
      type: 'payment_intent.succeeded',
      data: { object: { amount: 2000, currency: 'usd' } },
    },
    statusCode: 200,
  },
  {
    id: 'req_st_002',
    endpointId: 'ep_stripe_456',
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': 'whsec_...' },
    payload: {
      id: 'evt_67890',
      type: 'charge.failed',
      data: { object: { amount: 500, currency: 'eur', failure_message: 'Insufficient funds.' } },
    },
    statusCode: 200,
  },
    {
    id: 'req_sl_001',
    endpointId: 'ep_slack_789',
    receivedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: {
      text: 'New build deployed to production!',
      channel: '#deployments',
      username: 'DeployBot',
    },
    statusCode: 200,
  },
];
