const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const CONTACT_EMAIL = 'barbenchpublishers72@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: CONTACT_EMAIL, pass: process.env.GMAIL_PASS || '<YOUR_GMAIL_APP_PASSWORD>' },
});

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

// Cache durations
const CACHE = {
  '.html': 'no-cache',
  '.js':   'public, max-age=31536000, immutable',
  '.css':  'public, max-age=31536000, immutable',
  '.woff': 'public, max-age=31536000, immutable',
  '.woff2':'public, max-age=31536000, immutable',
  '.ttf':  'public, max-age=31536000, immutable',
  '.eot':  'public, max-age=31536000, immutable',
  '.jpg':  'public, max-age=2592000',
  '.jpeg': 'public, max-age=2592000',
  '.png':  'public, max-age=2592000',
  '.svg':  'public, max-age=2592000',
};

const ERROR_PAGES = {
  400: { title: 'Bad Request',            subtitle: 'Defective Submission',         icon: '&#xe9a1;', desc: 'The request could not be understood. Please check your input and try again.' },
  401: { title: 'Unauthorised',           subtitle: 'Access Restricted',            icon: '&#xeecd;', desc: 'You must be authenticated to access this resource. Please sign in and try again.' },
  403: { title: 'Forbidden',              subtitle: 'Entry Denied',                 icon: '&#xed94;', desc: 'You do not have permission to access this page. If you believe this is an error, please contact us.' },
  404: { title: 'Page Not Found',         subtitle: 'The Page Has Left The Shelf',  icon: '&#xead6;', desc: 'The page you are looking for may have been moved, renamed, or does not exist. Let us help you find your way back.' },
  500: { title: 'Internal Server Error',  subtitle: 'Something Went Wrong',         icon: '&#xeca0;', desc: 'An unexpected error occurred on our end. Our team has been notified. Please try again shortly.' },
  502: { title: 'Bad Gateway',            subtitle: 'Upstream Disruption',          icon: '&#xf09c;', desc: 'We received an invalid response from an upstream service. Please try again in a moment.' },
  503: { title: 'Service Unavailable',    subtitle: 'Temporarily Closed',           icon: '&#xf07f;', desc: 'The service is temporarily unavailable, likely due to maintenance. Please check back shortly.' },
};

function buildErrorPage(code) {
  const p = ERROR_PAGES[code] || { title: 'Error', subtitle: 'Unexpected Error', icon: '&#xeca0;', desc: 'An unexpected error occurred.' };
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${code} – ${p.title} | Bar &amp; Bench Publishers Ltd.</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/libs/ajax/libs/remixicon/6Hzp8aNJnUIG.0/QCZVe8eqgn3b.css">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--green-900:#0f2318;--green-800:#163322;--green-700:#1e4a30;--gold-400:#c9a84c;--gold-300:#d9be7a;--cream-50:#faf8f3;--cream-100:#f3efe4;--cream-300:#d9cfb8}
  body{font-family:'Inter',sans-serif;background:var(--green-900);color:var(--cream-100);min-height:100vh;display:flex;flex-direction:column}
  body::before{content:'';position:fixed;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.015) 60px,rgba(255,255,255,.015) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.015) 60px,rgba(255,255,255,.015) 61px);pointer-events:none;z-index:0}
  header{position:relative;z-index:10;padding:1.5rem 2rem;border-bottom:1px solid rgba(201,168,76,.2);display:flex;align-items:center;gap:.75rem}
  .logo-bar{width:3px;height:2rem;background:var(--gold-400);border-radius:2px;flex-shrink:0}
  .logo-text{font-family:'Playfair Display',serif;font-size:.95rem;font-weight:600;color:var(--cream-50);letter-spacing:.03em;text-decoration:none}
  .logo-text span{color:var(--gold-400)}
  main{position:relative;z-index:1;flex:1;display:flex;align-items:center;justify-content:center;padding:4rem 1.5rem}
  .card{max-width:620px;width:100%;text-align:center}
  .ornament{display:flex;align-items:center;justify-content:center;gap:1rem;margin-bottom:2rem}
  .ornament-line{flex:1;max-width:80px;height:1px;background:linear-gradient(to right,transparent,var(--gold-400))}
  .ornament-line.r{background:linear-gradient(to left,transparent,var(--gold-400))}
  .ornament-icon{width:64px;height:64px;border:1px solid rgba(201,168,76,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--gold-400);font-size:1.75rem;background:rgba(201,168,76,.08);flex-shrink:0}
  .code{font-family:'Playfair Display',serif;font-size:clamp(5rem,20vw,9rem);font-weight:700;line-height:1;color:transparent;-webkit-text-stroke:1px rgba(201,168,76,.35);letter-spacing:-.02em;margin-bottom:.5rem;user-select:none}
  .subtitle{font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--gold-400);margin-bottom:.75rem}
  h1{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,5vw,2.25rem);font-weight:600;color:var(--cream-50);margin-bottom:.75rem;letter-spacing:-.01em}
  .divider{width:48px;height:2px;background:var(--gold-400);margin:0 auto 1.5rem;border-radius:1px}
  p{font-size:.9375rem;line-height:1.7;color:var(--cream-300);max-width:480px;margin:0 auto 2.5rem}
  .actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
  .btn-p{font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;padding:.75rem 2rem;background:var(--gold-400);color:var(--green-900);border:none;border-radius:.25rem;cursor:pointer;text-decoration:none;display:inline-block;transition:background .2s,transform .2s}
  .btn-p:hover{background:var(--gold-300);transform:translateY(-1px)}
  .btn-s{font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;padding:.75rem 2rem;background:transparent;color:var(--cream-300);border:1px solid rgba(201,168,76,.35);border-radius:.25rem;cursor:pointer;text-decoration:none;display:inline-block;transition:border-color .2s,color .2s,transform .2s}
  .btn-s:hover{border-color:var(--gold-400);color:var(--gold-300);transform:translateY(-1px)}
  footer{position:relative;z-index:10;padding:1.25rem 2rem;border-top:1px solid rgba(201,168,76,.15);text-align:center;font-size:.75rem;color:rgba(217,207,184,.45);font-family:'DM Sans',sans-serif;letter-spacing:.04em}
  @media(max-width:480px){.actions{flex-direction:column;align-items:center}.btn-p,.btn-s{width:100%;max-width:280px;text-align:center}}
</style>
</head><body>
<header>
  <div class="logo-bar"></div>
  <a href="/" class="logo-text">Bar <span>&amp;</span> Bench Publishers Ltd.</a>
</header>
<main>
  <div class="card">
    <div class="ornament">
      <div class="ornament-line"></div>
      <div class="ornament-icon"><i class="ri-${p.riIcon || 'error-warning-line'}"></i></div>
      <div class="ornament-line r"></div>
    </div>
    <div class="code">${code}</div>
    <p class="subtitle">${p.subtitle}</p>
    <h1>${p.title}</h1>
    <div class="divider"></div>
    <p>${p.desc}</p>
    <div class="actions">
      <a href="/" class="btn-p">Return Home</a>
      <a href="javascript:history.back()" class="btn-s">Go Back</a>
    </div>
  </div>
</main>
<footer>&copy; ${new Date().getFullYear()} Bar &amp; Bench Publishers Ltd. &mdash; We Publish Authority</footer>
</body></html>`;
}

// Pre-assign remix icons
const ICONS = { 400:'error-warning-line', 401:'lock-line', 403:'forbid-line', 404:'book-line', 500:'server-line', 502:'router-line', 503:'time-line' };
Object.keys(ERROR_PAGES).forEach(c => { ERROR_PAGES[c].riIcon = ICONS[c]; });

function sendError(res, code) {
  const html = buildErrorPage(code);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache');
  res.writeHead(code);
  res.end(html);
}

const server = http.createServer((req, res) => {
  // Contact form handler
  if (req.method === 'POST' && req.url === '/contact') {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 10000) req.destroy(); });
    req.on('end', async () => {
      try {
        const { name, email, message } = JSON.parse(body);
        if (!name || !email || !message) {
          res.writeHead(400); return res.end(JSON.stringify({ error: 'Missing fields' }));
        }
        await transporter.sendMail({
          from: `"Bar & Bench Website" <${CONTACT_EMAIL}>`,
          to: CONTACT_EMAIL,
          replyTo: email,
          subject: `New Contact Form Submission from ${name}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`,
        });
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error('Contact form error:', err.message);
        res.writeHead(500); res.end(JSON.stringify({ error: 'Failed to send' }));
      }
    });
    return;
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    return sendError(res, 400);
  }

  let filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return sendError(res, 403);
  }

  const tryFile = (fp) => {
    fs.readFile(fp, (err, data) => {
      if (err) return sendError(res, 404);
      const ext = path.extname(fp).toLowerCase();
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', CACHE[ext] || 'public, max-age=86400');
      res.writeHead(200);
      res.end(data);
    });
  };

  fs.stat(filePath, (err, stat) => {
    if (err) return sendError(res, 404);
    if (stat.isDirectory()) {
      tryFile(path.join(filePath, 'index.html'));
    } else {
      tryFile(filePath);
    }
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Run: fuser -k ${PORT}/tcp`);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
