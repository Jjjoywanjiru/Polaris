const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

export async function getMpesaToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const response = await fetch(MPESA_AUTH_URL, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })

  const data = await response.json()
  return data.access_token
}

export function getMpesaTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}${second}`
}

export function getMpesaPassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE!
  const passkey = process.env.MPESA_PASSKEY!
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
}

export async function initiateStkPush({
  phone,
  amount,
  orderId,
}: {
  phone: string
  amount: number
  orderId: string
}) {
  const token = await getMpesaToken()
  const timestamp = getMpesaTimestamp()
  const password = getMpesaPassword(timestamp)

  // Format phone: remove leading 0 and add 254
  const formattedPhone = phone.startsWith('0')
    ? `254${phone.slice(1)}`
    : phone.startsWith('+')
    ? phone.slice(1)
    : phone

  const response = await fetch(MPESA_STK_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `POLARIS-${orderId}`,
      TransactionDesc: 'Polaris clothing order',
    }),
  })

  return response.json()
}