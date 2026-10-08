"""Builds the policy/contact pages in site/ using the header and footer from site/index.html.

Run: python3 stores/furaway/build_pages.py
"""
import pathlib, re

SITE = pathlib.Path(__file__).resolve().parent / "site"
index = (SITE / "index.html").read_text()
head = index.split("<body", 1)[0]
header = re.search(r"<!--HEADER-->(.*?)<!--/HEADER-->", index, re.S).group(1)
footer = re.search(r"<!--FOOTER-->(.*?)<!--/FOOTER-->", index, re.S).group(1)

EMAIL = "support@furaway.example"

PAGES = {
  "shipping": ("Shipping", f"""
<p>Free tracked shipping across the EU.</p>
<h2>Processing time</h2>
<p>Orders are sent within 1–3 business days.</p>
<h2>Delivery time</h2>
<p>Usually arrives in 8–15 business days. You get a tracking link by email.</p>
<h2>Lost or delayed orders</h2>
<p>If your order hasn't arrived within 20 business days, email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>"""),
  "returns": ("Returns & withdrawal", f"""
<p>You can change your mind within <strong>14 days of delivery</strong>, no questions asked.</p>
<h2>How to return</h2>
<ol>
<li>Email <a href="mailto:{EMAIL}">{EMAIL}</a> with your order number.</li>
<li>We'll explain how to send the item back.</li>
<li>Once it arrives, we refund the purchase price to your original payment method.</li>
</ol>
<h2>Damaged items</h2>
<p>If the item arrived damaged, email us a photo and we'll replace or refund it at no cost to you.</p>"""),
  "privacy": ("Privacy policy", f"""
<p>We collect your name, delivery address, email and order details to fulfil your order. Payments are handled securely by Stripe; we never store your full card number.</p>
<h2>Your rights</h2>
<p>You can ask to see, correct or delete your data at any time by emailing <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
<h2>Cookies</h2>
<p>We use cookies to keep your cart working and, if enabled, analytics.</p>"""),
  "terms": ("Terms of sale", f"""
<p>By placing an order you agree to these terms.</p>
<h2>Prices</h2>
<p>Prices are in euros and include free tracked shipping within the EU.</p>
<h2>Withdrawal</h2>
<p>You have a 14-day right of withdrawal from delivery, as described in our returns policy.</p>
<h2>Contact</h2>
<p>Questions? Email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>"""),
  "legal": ("Legal notice", f"""
<p>Furaway is operated by [YOUR COMPANY NAME], [ADDRESS], [COUNTRY]. Company registration: [REG. NUMBER]. VAT: [VAT NUMBER].</p>
<p>Contact: <a href="mailto:{EMAIL}">{EMAIL}</a></p>"""),
  "about": ("About us", f"""
<p>We love our pets. We don't love fur on every sofa.</p>
<p>Furaway is a reusable roller that lifts pet hair from fabric, with no sticky sheets and no batteries.</p>"""),
  "track": ("Track your order", f"""
<p>When your order ships, we email you a tracking link.</p>
<p>Can't find it? Email <a href="mailto:{EMAIL}">{EMAIL}</a> with your order number.</p>"""),
  "faq": ("Frequently asked questions", f"""
<h2>Does it work on clothes?</h2>
<p>It works best on furniture and thick fabrics. On thin clothes, hold the fabric tight and use short strokes.</p>
<h2>Does it work with long-haired pets?</h2>
<p>Yes. Just empty the chamber more often.</p>
<h2>Does it need batteries or refills?</h2>
<p>No. It's fully manual and reusable.</p>
<h2>How long does delivery take?</h2>
<p>Sent within 1–3 business days, usually arrives in 8–15 business days, with tracking.</p>
<h2>Can I return it?</h2>
<p>Yes, 14 days from delivery to change your mind.</p>"""),
  "contact": ("Contact us", f"""
<p>A real person answers every message, usually within 24 hours on weekdays.</p>
<p>📧 <a href="mailto:{EMAIL}">{EMAIL}</a></p>
<form class="form" data-contact>
<label>Your name<input name="name" required></label>
<label>Email<input name="email" type="email" required></label>
<label>Order number (optional)<input name="order"></label>
<label>Message<textarea name="message" rows="5" required></textarea></label>
<button class="atc" type="submit">SEND MESSAGE</button>
</form>
<script>
document.querySelector('[data-contact]').addEventListener('submit', function (e) {{
  e.preventDefault();
  var f = new FormData(this);
  var body = 'Name: ' + f.get('name') + '\\nOrder: ' + (f.get('order') || '-') + '\\n\\n' + f.get('message');
  window.location.href = 'mailto:{EMAIL}?subject=' + encodeURIComponent('Question from ' + f.get('name')) + '&body=' + encodeURIComponent(body);
}});
</script>"""),
}

for slug, (title, body) in PAGES.items():
    page_head = re.sub(r"<title>.*?</title>", f"<title>{title} – Furaway</title>", head, flags=re.S)
    html = f"""{page_head}<body>
{header}
<main class="page">
<h1>{title}</h1>
{body}
</main>
{footer}
<script src="/app.js" defer></script>
</body>
</html>
"""
    (SITE / f"{slug}.html").write_text(html)
    print("wrote", slug)
