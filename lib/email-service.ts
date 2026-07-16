/**
 * Email notification service interface.
 * Replace the placeholder implementations with Resend / SendGrid / Postmark.
 */

import type {
  OrderConfirmationPayload,
  InvoiceRequestPayload,
  EmailNotificationPayload,
} from './types';

export interface EmailService {
  sendOrderConfirmation(payload: OrderConfirmationPayload): Promise<void>;
  sendInvoiceRequest(payload: InvoiceRequestPayload): Promise<void>;
  sendPaymentConfirmation(payload: EmailNotificationPayload): Promise<void>;
  sendReadyForCollection(payload: EmailNotificationPayload): Promise<void>;
  sendDispatched(payload: EmailNotificationPayload & { trackingNumber?: string }): Promise<void>;
  sendDelivered(payload: EmailNotificationPayload): Promise<void>;
}

// ─── Placeholder implementation ───────────────────────────────────────────────
// Replace with: import { Resend } from 'resend'; or equivalent SDK

export const emailService: EmailService = {
  async sendOrderConfirmation(payload) {
    console.log('[EmailService] Order confirmation → ', payload.to, payload.orderNumber);
  },
  async sendInvoiceRequest(payload) {
    console.log('[EmailService] Invoice request → ', payload.to, payload.orderNumber);
  },
  async sendPaymentConfirmation(payload) {
    console.log('[EmailService] Payment confirmed → ', payload.to, payload.orderNumber);
  },
  async sendReadyForCollection(payload) {
    console.log('[EmailService] Ready for collection → ', payload.to, payload.orderNumber);
  },
  async sendDispatched(payload) {
    console.log('[EmailService] Dispatched → ', payload.to, payload.trackingNumber);
  },
  async sendDelivered(payload) {
    console.log('[EmailService] Delivered → ', payload.to, payload.orderNumber);
  },
};
