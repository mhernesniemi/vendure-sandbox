import {
  CancelPaymentResult,
  CancelPaymentErrorResult,
  PaymentMethodHandler,
  CreatePaymentResult,
  SettlePaymentResult,
  SettlePaymentErrorResult,
  LanguageCode,
} from "@vendure/core";
import { PaytrailClient } from "@paytrail/paytrail-js-sdk";

export const paytrailPaymentHandler = new PaymentMethodHandler({
  code: "paytrail-payment",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Paytrail Payment",
    },
  ],
  args: {},

  /** Payment is created when addPaymentToOrder mutation is executed */
  createPayment: async (
    ctx,
    order,
    amount,
    args,
    metadata
  ): Promise<CreatePaymentResult> => {
    try {
      const client = new PaytrailClient({
        merchantId: parseInt(process.env.PAYTRAIL_MERCHANT_ID || ""),
        secretKey: process.env.PAYTRAIL_SECRET_KEY || "",
        platformName: "Vendure",
      });

      const paymentCallbackUrls = {
        success: metadata.successUrl,
        cancel: metadata.cancelUrl,
      };

      const result = await client.createPayment({
        stamp: order.code,
        reference: order.code,
        amount: amount,
        currency: "EUR",
        language: "EN",
        orderId: order.code,
        customer: {
          email: order.customer?.emailAddress || "",
          firstName: order.shippingAddress?.fullName || "",
          lastName: "",
        },
        redirectUrls: paymentCallbackUrls,
      });

      return {
        amount: amount,
        state: "Created" as const,
        transactionId: result.data.transactionId,
        metadata: {
          paymentUrl: result.data.href,
          providers: result.data.providers,
          public: {
            paymentUrl: result.data.href,
          },
        },
      };
    } catch (err: unknown) {
      console.error("Error creating payment", err);

      return {
        amount: amount,
        state: "Declined" as const,
        metadata: {
          errorMessage: err instanceof Error ? err.message : "Unknown error",
        },
      };
    }
  },

  /** Executed when settlePayment mutation is called */
  settlePayment: async (
    ctx,
    order,
    payment,
    args
  ): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
    try {
      // Paytrail handles payment confirmation automatically
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },

  /** Executed when payment is cancelled */
  cancelPayment: async (
    ctx,
    order,
    payment,
    args
  ): Promise<CancelPaymentResult | CancelPaymentErrorResult> => {
    try {
      // Paytrail does not support payment cancellation via API
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },
});
