type PaymentRequest = {
  name: string;
  amount: number;
  email: string;
};

type PayUAuthResponse = {
  access_token?: string;
  error?: string;
};

type PayUOrderResponse = {
  redirectUri?: string;
  status?: {
    statusCode?: string;
  };
};

const PAYU_AUTH_URL = "https://secure.payu.com/pl/standard/user/oauth/authorize";
const PAYU_ORDERS_URL = "https://secure.payu.com/api/v2_1/orders";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} environment variable`);
  }

  return value;
}

function getBuyerName(name: string) {
  const parts = name.trim().split(/\s+/);

  return {
    firstName: parts[0] ?? "",
    lastName: parts[parts.length - 1] ?? "",
  };
}

function getContinueUrl(requestUrl: string) {
  return process.env.PAYU_CONTINUE_URL ?? new URL("/success.html", requestUrl).toString();
}

export async function createPaymentRedirect(requestUrl: string, reqData: PaymentRequest) {
  const posId = getRequiredEnv("POS_ID");
  const clientId = getRequiredEnv("CLIENT_ID");
  const clientSecret = getRequiredEnv("CLIENT_SECRET");

  const amount = Number(reqData.amount);

  if (!Number.isFinite(amount) || amount < 1) {
    throw new Error("Amount must be at least 1 PLN");
  }

  const accessToken = await getAccessToken(clientId, clientSecret);
  const redirectUrl = await createOrder(accessToken, posId, requestUrl, {
    ...reqData,
    amount,
  });

  return redirectUrl;
}

async function getAccessToken(clientId: string, clientSecret: string) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(PAYU_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`PayU auth failed with status ${response.status}`);
  }

  const data = (await response.json()) as PayUAuthResponse;

  if (!data.access_token) {
    throw new Error(data.error ?? "PayU auth did not return an access token");
  }

  return data.access_token;
}

async function createOrder(
  accessToken: string,
  posId: string,
  requestUrl: string,
  reqData: PaymentRequest,
) {
  const { firstName, lastName } = getBuyerName(reqData.name);
  const totalAmount = Math.round(reqData.amount * 100).toString();

  const response = await fetch(PAYU_ORDERS_URL, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      continueUrl: getContinueUrl(requestUrl),
      customerIp: "127.0.0.1",
      merchantPosId: posId,
      description: "Kosciol Kierunek - wsparcie",
      currencyCode: "PLN",
      totalAmount,
      buyer: {
        email: reqData.email,
        firstName,
        lastName,
        language: "pl",
      },
      products: [
        {
          name: "Wsparcie",
          unitPrice: totalAmount,
          quantity: "1",
        },
      ],
    }),
  });

  if (!response.ok && (response.status < 300 || response.status >= 400)) {
    throw new Error(`PayU order failed with status ${response.status}`);
  }

  const location = response.headers.get("location");

  if (location) {
    return location;
  }

  const data = (await response.json()) as PayUOrderResponse;

  if (!data.redirectUri) {
    throw new Error(`PayU order did not return redirectUri`);
  }

  return data.redirectUri;
}
