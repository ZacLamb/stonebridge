// Handles the contact + broker form POSTs and forwards them to GHL.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  let body = {};
  const ct = event.headers['content-type'] || '';
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : (event.body || '');
  if (ct.includes('application/json')) { try { body = JSON.parse(raw); } catch {} }
  else body = Object.fromEntries(new URLSearchParams(raw));

  const redirect = (to) => ({ statusCode: 303, headers: { Location: to }, body: '' });
  if (body.website) return redirect('/contact');           // honeypot

  const kind = body.kind || 'contact';
  const payload = { source: 'stonebridgefundinggroup.com', form: kind, submittedAt: new Date().toISOString(), ...body };
  console.log(`[${kind}]`, JSON.stringify(payload));

  if (process.env.GHL_WEBHOOK_URL) {
    try {
      await fetch(process.env.GHL_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (err) { console.error('Webhook forward failed:', err.message); }
  }
  return redirect('/contact/sent');
};
