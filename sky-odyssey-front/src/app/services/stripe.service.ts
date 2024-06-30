import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe('your-publishable-key-here'); // Replace with your Stripe publishable key
  }

  async createPaymentIntent(amount: number): Promise<any> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe.js failed to load.');
    }

    // Simulate creating a PaymentIntent on your backend
    return fetch('http://localhost:5093/api/payments/{reservationId}/pay', { // Replace with your backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    }).then((response) => response.json());
  }

  async confirmCardPayment(clientSecret: string, paymentMethodId: string): Promise<any> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe.js failed to load.');
    }

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId
    });
  }
}
