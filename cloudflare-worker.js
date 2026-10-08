import {serveMedia} from './media.js';
const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const video = await serveMedia(request, env); if(video) return video;
    if (url.pathname !== '/api/subscribe') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);
    if (request.headers.get('Origin') !== url.origin) return json({ error: 'Please join from the studio website.' }, 403);
    let body;
    try {
      const raw = await request.text();
      if (raw.length > 4096) return json({ error: 'Request too large.' }, 413);
      body = JSON.parse(raw);
    } catch { return json({ error: 'Invalid signup.' }, 400); }
    const contact = body?.kind === 'contact';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if(message.length > 2000) return json({error:'Please keep your message under 2,000 characters.'},400);
    const email = String(body?.email || '').trim().toLowerCase();
    if (body?.website || (!contact && body?.consent !== true) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Enter a valid email and agree to receive updates.' }, 400);
    }
    if (!env.SUBSCRIBERS) return json({ error: 'The mailing list is opening soon. Please check back shortly.' }, 503);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(contact ? email+'|'+message+'|'+String(body.consent===true) : email));
    const key = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    let record;
    try {
      const existing = await env.SUBSCRIBERS.get(key, 'json');
      // A repeat signup must not repeatedly notify the owner after acceptance.
      if (existing?.notification === 'accepted') return json({ ok: true });
      record = { email, message, kind: contact ? 'contact' : 'subscriber', consent: body.consent===true, joinedAt: existing?.joinedAt || new Date().toISOString(), notification: 'pending' };
      await env.SUBSCRIBERS.put(key, JSON.stringify(record));
    } catch { return json({ error: 'We couldn’t save your signup. Please try again shortly.' }, 503); }
    try {
      const sent = await fetch('https://formsubmit.co/ajax/vutukurydhruva@ucla.edu', {
        method: 'POST', signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: url.origin + '/' },
        body: JSON.stringify({ _subject: contact ? '12 Studios — new business inquiry' : '12 Studios — new mailing-list subscriber', email,
          message: contact ? 'Contact: '+email+'\nMessage: '+(message||'(not provided)')+'\nNewsletter opt-in: '+(record.consent?'Yes':'No') : 'New consented subscriber: ' + email + '\nJoined: ' + record.joinedAt, _template: 'table', _url: url.origin })
      });
      const result = await sent.json();
      record.notification = sent.ok && (result.success === true || result.success === 'true') ? 'accepted'
        : /activation/i.test(result.message || '') ? 'activation_required' : 'failed';
    } catch { record.notification = 'failed'; }
    // The email service cannot undo a successful subscriber save.
    try { await env.SUBSCRIBERS.put(key, JSON.stringify(record)); } catch { /* Initial pending record remains available. */ }
    return json({ ok: true });
  }
};
