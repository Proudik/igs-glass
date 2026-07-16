/**
 * Payment service interface.
 * Connect Stripe or invoice flow here when ready.
 */

import type { Cart, Order, CheckoutPayment } from './types';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
}

export interface PaymentService {
  createPaymentIntent(cart: Cart): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent>;
  handleInvoiceRequest(order: Order): Promise<void>;
}

// ─── Placeholder implementation ───────────────────────────────────────────────
// Replace with: import Stripe from 'stripe'; initialised with process.env.STRIPE_SECRET_KEY

export const paymentService: PaymentService = {
  async createPaymentIntent(cart) {
    // Placeholder — wire up Stripe here
    console.log('[PaymentService] createPaymentIntent for cart', cart.id, 'total', cart.total);
    return {
      id: 'pi_placeholder',
      clientSecret: 'pi_placeholder_secret',
      amount: cart.total,
      currency: 'gbp',
      status: 'requires_payment_method',
    };
  },
  async confirmPayment(paymentIntentId, paymentMethodId) {
    console.log('[PaymentService] confirmPayment', paymentIntentId, paymentMethodId);
    return {
      id: paymentIntentId,
      clientSecret: '',
      amount: 0,
      currency: 'gbp',
      status: 'succeeded',
    };
  },
  async handleInvoiceRequest(order) {
    console.log('[PaymentService] Invoice requested for order', order.orderNumber);
  },
};
