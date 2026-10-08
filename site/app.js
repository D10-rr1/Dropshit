// Emberwell storefront – packs, gallery, cart drawer and small UI helpers.

// Paste a Stripe Payment Link for each pack here to turn on real checkout.
// Leave empty to keep the store in preview mode.
const CHECKOUT_LINKS = {
  1: "https://buy.stripe.com/14AeVc8kHgEN8BMea02881k",
  2: "https://buy.stripe.com/7sY14m9oL9clf0a5Du2881j",
  3: "https://buy.stripe.com/8x2fZg6cz88hbNY4zq2881f",
};
const BUNDLES = {
  1: { name: "1 Set", price: 34.99, was: null },
  2: { name: "2 Sets", price: 59.99, was: 69.98 },
  3: { name: "3 Sets", price: 79.99, was: 104.97 },
};
const PRODUCT = { name: "Emberwell™ Rechargeable Hand Warmer", image: "/img/warmer-main.svg" };
// Real deadline for Christmas delivery; the countdown hides itself after this.
const CHRISTMAS_CUTOFF = new Date(2026, 11, 5, 23, 59, 59);
const CART_KEY = "emberwell-cart";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => "$" + n.toFixed(2);

// ---------- Cart state ----------
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
}
let cart = loadCart();
for (const id of Object.keys(cart)) if (!BUNDLES[id] || !(cart[id] > 0)) delete cart[id];

const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartTotal = () => Object.entries(cart).reduce((sum, [id, q]) => sum + BUNDLES[id].price * q, 0);

const TRASH = '<svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 9h12l-1 12H7L6 9z"/></svg>';

function renderCart() {
  const count = cartCount();
  $$("[data-cart-count]").forEach((el) => { el.textContent = count; el.dataset.count = count; });
  const items = $("[data-cart-items]");
  if (!items) return;
  if (!count) {
    items.innerHTML = '<div class="drawer__empty">Your cart is empty.<br><a href="/#shop" data-close-cart>Continue shopping</a></div>';
  } else {
    items.innerHTML = Object.entries(cart).map(([id, q]) => {
      const b = BUNDLES[id];
      const save = b.was ? `<span class="line__save">SAVE ${money((b.was - b.price) * q)}</span>` : "";
      const was = b.was ? `<s>${money(b.was * q)}</s>` : "";
      return `
      <div class="line">
        <img src="${PRODUCT.image}" alt="">
        <div>
          <div class="line__name">${PRODUCT.name}</div>
          <div class="line__variant">${b.name}</div>
          <div class="line__controls">
            <div class="qty">
              <button type="button" data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button>
              <span>${q}</span>
              <button type="button" data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="line__remove" data-remove="${id}" aria-label="Remove">${TRASH}</button>
          </div>
        </div>
        <div class="line__right">
          <div class="line__price">${was}${money(b.price * q)}</div>
          ${save}
        </div>
      </div>`;
    }).join("");
  }
  const total = $("[data-cart-total]");
  if (total) total.textContent = money(cartTotal());
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function openCart() {
  document.body.classList.add("cart-open");
  $(".drawer")?.setAttribute("aria-hidden", "false");
}
function closeCart() {
  document.body.classList.remove("cart-open");
  $(".drawer")?.setAttribute("aria-hidden", "true");
}

// ---------- Product ----------
const selectedBundle = () => $('input[name="bundle"]:checked')?.value || "1";

function updatePrice() {
  const price = $("[data-price]");
  if (!price) return;
  const b = BUNDLES[selectedBundle()];
  price.textContent = money(b.price);
  const was = $("[data-was]");
  was.textContent = b.was ? money(b.was) : "";
  was.hidden = !b.was;
}

function showImage(btn) {
  $$(".gallery__thumbs button").forEach((b) => b.classList.toggle("is-active", b === btn));
  $("#gallery-main").src = btn.dataset.src;
}

function stepGallery(dir) {
  const thumbs = $$(".gallery__thumbs button");
  const i = thumbs.findIndex((b) => b.classList.contains("is-active"));
  showImage(thumbs[(i + dir + thumbs.length) % thumbs.length]);
}

function deliveryEstimate() {
  const el = $("[data-delivery]");
  if (!el) return;
  const addBusinessDays = (date, days) => {
    const d = new Date(date);
    while (days > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) days--;
    }
    return d;
  };
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const now = new Date();
  el.textContent = `${fmt(addBusinessDays(now, 7))} – ${fmt(addBusinessDays(now, 15))}`;
}

function startCountdown() {
  const bar = $("[data-countdown]");
  if (!bar) return;
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const left = CHRISTMAS_CUTOFF - new Date();
    if (left <= 0) { bar.hidden = true; clearInterval(timer); return; }
    const s = Math.floor(left / 1000);
    $('[data-cd="d"]', bar).textContent = pad(Math.floor(s / 86400));
    $('[data-cd="h"]', bar).textContent = pad(Math.floor(s / 3600) % 24);
    $('[data-cd="m"]', bar).textContent = pad(Math.floor(s / 60) % 60);
    $('[data-cd="s"]', bar).textContent = pad(s % 60);
    bar.hidden = false;
  };
  const timer = setInterval(tick, 1000);
  tick();
}

// ---------- Events ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a, [data-close-cart]");
  if (!t) return;

  if (t.matches("[data-add-to-cart]")) {
    changeQty(selectedBundle(), 1);
    openCart();
  } else if (t.matches("[data-open-cart]")) {
    openCart();
  } else if (t.matches("[data-close-cart]")) {
    closeCart();
  } else if (t.matches("[data-qty]")) {
    changeQty(t.dataset.qty, Number(t.dataset.delta));
  } else if (t.matches("[data-remove]")) {
    changeQty(t.dataset.remove, -cart[t.dataset.remove]);
  } else if (t.matches("[data-checkout]")) {
    const ids = Object.keys(cart);
    if (!ids.length) return;
    const link = ids.length === 1 && cart[ids[0]] === 1 ? CHECKOUT_LINKS[ids[0]] : "";
    if (link) window.location.href = link;
    else $("[data-modal]").classList.add("is-open");
  } else if (t.matches("[data-close-modal]")) {
    $("[data-modal]").classList.remove("is-open");
  } else if (t.matches("[data-open-menu]")) {
    $("[data-mobile-nav]").classList.toggle("is-open");
  } else if (t.matches("[data-gallery]")) {
    stepGallery(Number(t.dataset.gallery));
  } else if (t.matches("[data-carousel-btn]")) {
    const track = $("[data-carousel]");
    track.scrollBy({ left: Number(t.dataset.carouselBtn) * track.firstElementChild.offsetWidth * 1.05, behavior: "smooth" });
  } else if (t.closest(".gallery__thumbs")) {
    showImage(t);
  }
});

document.addEventListener("change", (e) => {
  if (e.target.name === "bundle") updatePrice();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeCart(); $("[data-modal]")?.classList.remove("is-open"); }
});

$$("[data-newsletter]").forEach((form) =>
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.outerHTML = '<p><strong>Thanks!</strong> Newsletter signups open at launch.</p>';
  })
);

$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
updatePrice();
deliveryEstimate();
startCountdown();
renderCart();
