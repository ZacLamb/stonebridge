// Renders every EJS page to static HTML in ./dist for Netlify.
// Run: node build.js   (Netlify runs this automatically via netlify.toml)
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const site = require('./data/site');
const products = require('./data/products');
const faqs = require('./data/faqs');

const OUT = path.join(__dirname, 'dist');
const VIEWS = path.join(__dirname, 'views');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(__dirname, 'public'), OUT, { recursive: true });

function render(view, urlPath, locals, outFile) {
  const globals = {
    site, products,
    path: urlPath,
    canonical: site.domain + urlPath.replace(/\/$/, '') || site.domain,
    year: new Date().getFullYear()
  };
  const html = ejs.render(
    fs.readFileSync(path.join(VIEWS, 'pages', `${view}.ejs`), 'utf8'),
    { ...globals, ...locals },
    { filename: path.join(VIEWS, 'pages', `${view}.ejs`) }
  );
  const file = outFile || (urlPath === '/' ? 'index.html' : path.join(urlPath.slice(1), 'index.html'));
  fs.mkdirSync(path.dirname(path.join(OUT, file)), { recursive: true });
  fs.writeFileSync(path.join(OUT, file), html);
  console.log('built', file);
}

render('home', '/', { title: 'Stone Bridge Funding Group — Business Funding, Direct', description: 'Stone Bridge Funding Group places merchant cash advances, business term loans, lines of credit, and business credit cards for owners who need capital this week.' });
render('funding', '/funding', { title: 'Business Funding Options — Stone Bridge Funding Group', description: 'Compare merchant cash advances, term loans, lines of credit, and business credit cards side by side.' });
for (const product of products) {
  render('product', `/funding/${product.slug}`, { title: `${product.name} — Stone Bridge Funding Group`, description: product.metaDescription, product, others: products.filter(p => p.slug !== product.slug) });
}
render('how-it-works', '/how-it-works', { title: 'How It Works — Stone Bridge Funding Group', description: 'From application to funded in four steps: apply, match, compare, get funded. Usually 24–72 hours.' });
render('brokers', '/brokers', { title: 'For Brokers & ISOs — Stone Bridge Funding Group', description: 'Submit MCA, term loan, and line of credit files. Same-day fundability answers and commission paid on funding.' });
render('about', '/about', { title: 'About — Stone Bridge Funding Group', description: 'Who we are, how we get paid, and why we work the way we do.' });
render('faq', '/faq', { title: 'Frequently Asked Questions — Stone Bridge Funding Group', description: 'Answers on cost, speed, credit, documents, and how a funding broker works.', faqs });
render('apply', '/apply', { title: 'Start an Application — Stone Bridge Funding Group', description: 'A five-minute application. A funding specialist follows up the same business day.' });
render('contact', '/contact', { title: 'Contact — Stone Bridge Funding Group', description: 'Call, email, or send a message. We answer the same business day.', submitted: false });
render('contact', '/contact/sent', { title: 'Message sent — Stone Bridge Funding Group', description: '', submitted: true });
render('privacy', '/privacy', { title: 'Privacy Policy — Stone Bridge Funding Group', description: 'How Stone Bridge Funding Group collects, uses, and protects your information.' });
render('404', '/404', { title: 'Page not found — Stone Bridge Funding Group', description: '' }, '404.html');

const urls = ['/', '/funding', ...products.map(p => `/funding/${p.slug}`), '/how-it-works', '/brokers', '/about', '/faq', '/apply', '/contact', '/privacy'];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${site.domain}${u === '/' ? '' : u}</loc></url>`).join('\n') + `\n</urlset>`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
console.log('done');
