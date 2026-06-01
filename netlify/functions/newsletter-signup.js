// Netlify function — newsletter signup handler
// POST { email: "..." } → stores & returns success
// Runs on Netlify edge, bypasses Cloudflare POST block

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email;
  try {
    email = JSON.parse(event.body).email;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Valid email required' }) };
  }

  // Log to console (visible in Netlify Functions dashboard)
  console.log(`[NEWSLETTER SIGNUP] ${email} at ${new Date().toISOString()}`);

  // Also write to /tmp for aggregation (persists within same function instance)
  const fs = require('fs');
  const logFile = '/tmp/newsletter-subscribers.txt';
  fs.appendFileSync(logFile, `${email}\t${new Date().toISOString()}\n`);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ success: true, message: "You're in!" })
  };
};
