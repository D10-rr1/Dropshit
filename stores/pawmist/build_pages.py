"""Builds the policy/contact pages in site/ using the header and footer from site/index.html.

Run: python3 stores/pawmist/build_pages.py
"""
import pathlib, re

SITE = pathlib.Path(__file__).resolve().parent / "site"
index = (SITE / "index.html").read_text()
head = index.split("<body", 1)[0]
header = re.search(r"<!--HEADER-->(.*?)<!--/HEADER-->", index, re.S).group(1)
footer = re.search(r"<!--FOOTER-->(.*?)<!--/FOOTER-->", index, re.S).group(1)

EMAIL = "support@pawmist.example"

PAGES = {
  "shipping": ("Shipping policy", f"""
<p>We ship worldwide, and shipping is <strong>free on every order</strong>.</p>
<h2>Processing time</h2>
<p>Orders are processed within 1–3 business days. You'll receive an email with your tracking link as soon as your order ships.</p>
<h2>Delivery time</h2>
<p>Delivery usually takes <strong>7–15 business days</strong>, depending on your location. Remote areas may take a little longer.</p>
<h2>Christmas orders</h2>
<p>Order by <strong>December 5</strong> for the best chance of delivery before Christmas.</p>
<h2>Duties and taxes</h2>
<p>Some countries charge import duties or taxes. Unless they are shown at checkout, they are the customer's responsibility.</p>
<h2>Lost or delayed orders</h2>
<p>If your order hasn't arrived within 20 business days, email <a href="mailto:{EMAIL}">{EMAIL}</a> and we'll make it right.</p>"""),
  "returns": ("Refunds & returns", f"""
<p>We want you and your pet to love Pawmist. If you don't, you're covered by our <strong>30-day money-back guarantee</strong>.</p>
<h2>How to return</h2>
<ol>
<li>Email <a href="mailto:{EMAIL}">{EMAIL}</a> within 30 days of delivery with your order number.</li>
<li>We'll reply with return instructions within 24 hours on business days.</li>
<li>Send the item back in its original packaging.</li>
</ol>
<h2>Refunds</h2>
<p>Once we receive your return, we refund the full purchase price to your original payment method within 7 business days. Return shipping is paid by the customer unless the item arrived damaged or defective.</p>
<h2>Damaged or defective items</h2>
<p>Email us a photo within 30 days of delivery and we'll send a replacement or a full refund at no cost to you.</p>
<h2>EU and UK customers</h2>
<p>You also keep your statutory 14-day right of withdrawal.</p>"""),
  "privacy": ("Privacy policy", f"""
<p>This policy explains what personal information we collect when you visit or buy from our store, and how we use it.</p>
<h2>What we collect</h2>
<p>When you place an order we collect your name, shipping address, email address and order details. Payments are processed by our payment provider; we never see or store your full card number.</p>
<h2>How we use it</h2>
<p>To fulfil and ship your order, send order and shipping updates, answer your questions and, if you opt in, send you offers by email.</p>
<h2>Sharing</h2>
<p>We share only what is needed with our payment provider, shipping partners and fulfilment partners. We never sell your data.</p>
<h2>Cookies and analytics</h2>
<p>We use cookies to keep your cart working and, if enabled, analytics and advertising pixels to understand and improve our ads.</p>
<h2>Your rights</h2>
<p>You can ask to see, correct or delete your data at any time by emailing <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>"""),
  "terms": ("Terms of service", f"""
<p>By using this website and placing an order, you agree to these terms.</p>
<h2>Orders</h2>
<p>All orders are subject to availability. We may cancel an order and issue a full refund if an item is out of stock or a pricing error occurs.</p>
<h2>Prices</h2>
<p>Prices are shown in US dollars and include free shipping. Taxes and import duties may apply depending on your country.</p>
<h2>Product use</h2>
<p>Follow the instructions included with the product. Use clean water only, never spray into your pet's eyes, ears or nose, and stop brushing if your pet seems uncomfortable or has irritated or broken skin.</p>
<h2>Liability</h2>
<p>To the extent permitted by law, our liability is limited to the purchase price of the product.</p>
<h2>Contact</h2>
<p>Questions about these terms? Email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>"""),
  "about": ("About us", f"""
<p>We love our pets. We don't love finding their fur on every sofa, sweater and car seat.</p>
<p>So we set out to make brushing better: a rechargeable brush with a fine water mist that calms static, so loose fur stays in the brush, and a one-click button that releases it.</p>
<p>That's Pawmist. Questions? Email <a href="mailto:{EMAIL}">{EMAIL}</a>. A real person always answers.</p>"""),
  "track": ("Track your order", f"""
<p>When your order ships, we email you a tracking link. Click it to follow your package all the way to your door.</p>
<h2>Can't find the email?</h2>
<p>Check your spam folder, or email <a href="mailto:{EMAIL}">{EMAIL}</a> with your order number and we'll send you the tracking link again.</p>
<h2>Delivery time</h2>
<p>Orders usually arrive within 7–15 business days.</p>"""),
  "faq": ("Frequently asked questions", f"""
<h2>Is it a steam brush?</h2>
<p>It sprays a fine, cool water mist. It does not heat the water, so there's no hot steam near your pet.</p>
<h2>Does it work for cats and dogs?</h2>
<p>Yes. It's made for short- and long-haired cats and dogs. Start slowly so your pet can get used to the mist.</p>
<h2>What do I put in the tank?</h2>
<p>Clean water. Don't add oils, perfumes or products that aren't made for pets.</p>
<h2>How do I charge it?</h2>
<p>With the included USB-C cable, like your phone.</p>
<h2>How long does shipping take?</h2>
<p>Usually 7–15 business days. Shipping is free and you'll get a tracking link by email.</p>
<h2>What if I don't like it?</h2>
<p>You have a 30-day money-back guarantee. Email <a href="mailto:{EMAIL}">{EMAIL}</a> and we'll sort it out.</p>"""),
  "contact": ("Contact us", f"""
<p>Questions about your order or the product? A real person answers every message, usually within 24 hours on weekdays.</p>
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
    page_head = re.sub(r"<title>.*?</title>", f"<title>{title} – Pawmist</title>", head, flags=re.S)
    # Ensure Vercel Analytics is included if not already present
    if "/_vercel/insights/script.js" not in page_head:
        page_head = page_head.replace("</head>", """  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>""")
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
