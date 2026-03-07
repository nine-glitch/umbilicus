export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const signature = req.headers.get('x-signature');
  const body = await req.text();

  // Verificar firma
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(body);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body);
  const eventName = event.meta?.event_name;

  if (eventName === 'order_created') {
    const orderId = event.data?.id;
    const email = event.data?.attributes?.user_email;
    const status = event.data?.attributes?.status;

    if (status === 'paid') {
      // Token de desbloqueo = order ID
      // El frontend lo usa para verificar el pago
      console.log(`Pago confirmado - Order: ${orderId} - Email: ${email}`);
    }
  }

  return new Response('OK', { status: 200 });
}
