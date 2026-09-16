const path = require('path');
const express = require('express');
const compression = require('compression');
const site = require('./data/site');
const products = require('./data/products');
const faqs = require('./data/faqs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

// Globals available in every view
app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.products = products;
  res.locals.path = req.path;
  res.locals.canonical = site.domain + req.path.replace(/\/$/, '') || site.domain;
  res.locals.year = new Date().getFullYear();
  next();
});

const render = (view, locals) => (req, res) => res.render(`pages/${view}`, locals);

// ---------- Pages ----------
app.get('/', render('home', {
  title: 'Stone Bridge Funding Group — Business Funding, Direct',
  description: 'Stone Bridge Funding Group places merchant cash advances, business term loans, lines of credit, and business credit cards for owners who need capital this week.'
}));

app.get('/funding', render('funding', {
  title: 'Business Funding Options — Stone Bridge Funding Group',
  description: 'Compare merchant cash advances, term loans, lines of credit, and business credit cards side by side.'
}));

app.get('/funding/:slug', (req, res, next) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) return next();
  const others = products.filter(p => p.slug !== product.slug);
  res.render('pages/product', {
    title: `${product.name} — Stone Bridge Funding Group`,
    description: product.metaDescription,
    product, others
  });
});

app.get('/how-it-works', render('how-it-works', {
  title: 'How It Works — Stone Bridge Funding Group',
  description: 'From application to funded in four steps: apply, match, compare, get funded. Usually 24–72 hours.'
}));

app.get('/brokers', render('brokers', {
  title: 'For Brokers & ISOs — Stone Bridge Funding Group',
  description: 'Submit MCA, term loan, and line of credit files. Same-day fundability answers and commission paid on funding.'
}));

app.get('/about', render('about', {
  title: 'About — Stone Bridge Funding Group',
  description: 'Who we are, how we get paid, and why we work the way we do.'
}));

app.get('/faq', render('faq', {
  title: 'Frequently Asked Questions — Stone Bridge Funding Group',
  description: 'Answers on cost, speed, credit, documents, and how a funding broker works.',
  faqs
}));

app.get('/apply', render('apply', {
  title: 'Start an Application — Stone Bridge Funding Group',
  description: 'A five-minute application. A funding specialist follows up the same business day.'
}));

app.get('/contact', render('contact', {
  title: 'Contact — Stone Bridge Funding Group',
  description: 'Call, email, or send a message. We answer the same business day.',
  submitted: false
}));

app.get('/privacy', render('privacy', {
  title: 'Privacy Policy — Stone Bridge Funding Group',
  description: 'How Stone Bridge Funding Group collects, uses, and protects your information.'
}));

// ---------- Forms ----------
async function forward(kind, body) {
  const payload = { source: 'stonebridgefundinggroup.com', form: kind, submittedAt: new Date().toISOString(), ...body };
  console.log(`[${kind}]`, JSON.stringify(payload));
  if (process.env.GHL_WEBHOOK_URL) {
    try {
      await fetch(process.env.GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Webhook forward failed:', err.message);
    }
  }
}

app.post('/contact', async (req, res) => {
  if (req.body.website) return res.redirect('/contact');
  await forward('contact', req.body);
  res.render('pages/contact', {
    title: 'Message sent — Stone Bridge Funding Group',
    description: '', submitted: true
  });
});

// ---------- SEO ----------
app.get('/sitemap.xml', (req, res) => {
  const urls = ['/', '/funding', ...products.map(p => `/funding/${p.slug}`), '/how-it-works', '/brokers', '/about', '/faq', '/apply', '/contact', '/privacy'];
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${site.domain}${u === '/' ? '' : u}</loc></url>`).join('\n') +
    `\n</urlset>`
  );
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page not found — Stone Bridge Funding Group', description: '' });
});

app.listen(PORT, () => console.log(`Stone Bridge Funding Group running on :${PORT}`));
