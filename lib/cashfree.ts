// Cashfree payment integration with proper authentication
export class CashfreeService {
  private appId: string
  private secretKey: string
  private baseUrl: string

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID!
    this.secretKey = process.env.CASHFREE_SECRET_KEY!
    this.baseUrl =
      process.env.NODE_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"
  }

  private generateSignature(postData: string): string {
    const crypto = require("crypto")
    return crypto.createHmac("sha256", this.secretKey).update(postData).digest("base64")
  }

  async createPaymentSession(orderData: {
    orderId: string
    amount: number
    customerEmail: string
    customerPhone: string
    customerName: string
  }) {
    try {
      const orderRequest = {
        order_id: orderData.orderId,
        order_amount: orderData.amount,
        order_currency: "INR",
        customer_details: {
          customer_id: orderData.customerEmail,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          customer_name: orderData.customerName,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id={order_id}`,
          notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
        },
        order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      }

      const response = await fetch(`${this.baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": this.appId,
          "x-client-secret": this.secretKey,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(orderRequest),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Cashfree API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating payment session:", error)
      throw new Error("Failed to create payment session")
    }
  }

  async verifyPayment(orderId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: "GET",
        headers: {
          "x-client-id": this.appId,
          "x-client-secret": this.secretKey,
          "x-api-version": "2023-08-01",
        },
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Cashfree API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error verifying payment:", error)
      throw new Error("Failed to verify payment")
    }
  }

  async getPaymentMethods() {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods`, {
        method: "GET",
        headers: {
          "x-client-id": this.appId,
          "x-client-secret": this.secretKey,
          "x-api-version": "2023-08-01",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch payment methods: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      throw new Error("Failed to fetch payment methods")
    }
  }
}

export const cashfreeService = new CashfreeService()
