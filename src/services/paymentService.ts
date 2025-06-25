export interface PaymentDetails {
  orderId: string;
  amount: string;
  currency: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  userType: string,
  volunteerId: number | null,
  sponsorId: number | null,
  eventId: number,
  isAnnonymous: boolean,
  transactionType: string
}
  
export async function startPayment(details: PaymentDetails) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/start`;
    console.log("Payment API URL:", apiUrl);
    console.log("Payment details:", details);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to generate hash for payment. Status: ${response.status}, Response: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    try {
      const data = JSON.parse(responseText);
      const { hash, merchantId } = data;
      return { hash, merchantId };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response was not valid JSON:", responseText);
      throw new Error("Server returned invalid JSON response");
    }
  } catch (error) {
    console.error("Error in startPayment:", error);
    throw error;
  }
}
  

export async function checkPaymentStatus(orderId: string): Promise<string> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/status/${orderId}`;
    console.log("Payment status API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    console.log("Status check response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Status check error response:", errorText);
      throw new Error(`Failed to fetch payment status. Status: ${response.status}, Response: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Status check raw response:", responseText);

    try {
      const data = JSON.parse(responseText);
      const { status } = data;
      return status;
    } catch (parseError) {
      console.error("JSON parse error in status check:", parseError);
      console.error("Response was not valid JSON:", responseText);
      throw new Error("Server returned invalid JSON response for status check");
    }
  } catch (error) {
    console.error("Error in checkPaymentStatus:", error);
    throw error;
  }
}


export async function generatePaymentID(paymentType: string): Promise<string> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/generate-order-id?paymentType=${paymentType}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentType }),
    });

    console.log("Generate ID response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to generate payment ID. Status: ${response.status}, Response: ${errorText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error in generatePaymentID:", error);
    throw error;
  }
}