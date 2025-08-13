import Stripe from "stripe";

class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createPaymentIntent(amount: number) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  async getAllPaymentIntents() {
    return await this.stripe.paymentIntents.list();
  }

  async getPaymentIntent(id: string) {
    return await this.stripe.paymentIntents.retrieve(id);
  }
}

export default new PaymentService();
