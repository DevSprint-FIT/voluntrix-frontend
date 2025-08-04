import authService from "./authService";

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
        "ngrok-skip-browser-warning": "true",

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
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    console.log("Status check response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Status check error response:", errorText);
      
      // If the endpoint doesn't exist or returns 404, assume payment is still pending
      if (response.status === 404) {
        console.log("Payment status endpoint not found, returning PENDING");
        return "PENDING";
      }
      
      throw new Error(`Failed to fetch payment status. Status: ${response.status}, Response: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Status check raw response:", responseText);

    try {
      const data = JSON.parse(responseText);
      const { status } = data;
      console.log("Parsed payment status:", status);
      
      // Normalize status values based on backend responses
      const normalizedStatus = status?.toUpperCase();
      if (normalizedStatus === 'SUCCESS') {
        return "SUCCESS";
      } else if (normalizedStatus === 'EXPIRED') {
        return "FAILED";
      } else if (normalizedStatus === 'PENDING') {
        return "PENDING";
      } else {
        // For any unknown status, assume pending to allow retries
        console.log(`Unknown payment status: ${status}, treating as PENDING`);
        return "PENDING";
      }
    } catch (parseError) {
      console.error("JSON parse error in status check:", parseError);
      console.error("Response was not valid JSON:", responseText);
      
      // If we can't parse the response, assume pending for now
      return "PENDING";
    }
  } catch (error) {
    console.error("Error in checkPaymentStatus:", error);
    
    // Instead of throwing error, return PENDING to allow retries
    return "PENDING";
  }
}


export interface SponsorshipPaymentDetails {
  orderId: string;
  eventId: number;
  eventTitle: string;
  sponsorId: number;
  price: number;
  type: string;
  benefits: string;
  payableAmount: number;
}

export interface SponsorshipPaymentResponse {
  message: string;
  data: SponsorshipPaymentDetails;
}

export async function getSponsorshipPaymentDetails(requestId: number): Promise<SponsorshipPaymentDetails> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorship-requests/sponsor-requests/${requestId}`;
    console.log("Sponsorship payment details API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        "Authorization": `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sponsorship details error response:", errorText);
      throw new Error(`Failed to fetch sponsorship details. Status: ${response.status}, Response: ${errorText}`);
    }

    const responseText = await response.text();

    try {
      const responseData: SponsorshipPaymentResponse = JSON.parse(responseText);
      console.log("Sponsorship details parsed:", responseData);
      
      if (!responseData.data) {
        throw new Error("Invalid response format: missing data field");
      }
      
      return responseData.data;
    } catch (parseError) {
      console.error("JSON parse error in sponsorship details:", parseError);
      console.error("Response was not valid JSON:", responseText);
      throw new Error("Server returned invalid JSON response for sponsorship details");
    }
  } catch (error) {
    console.error("Error in getSponsorshipPaymentDetails:", error);
    throw error;
  }
}