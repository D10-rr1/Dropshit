// Emberwell storefront – cart, bundles, gallery and small UI helpers.

// Paste a Stripe Payment Link for each pack here to turn on real checkout.
// Leave empty to keep the store in preview mode.
const CHECKOUT_LINKS = { 1: "", 2: "", 4: "" };

const BUNDLES = {
  1: { name: "1 Set", price: 34.99, was: null },
  2: { name: "2 Sets", price: 59.99, was: 69.98 },
  4: { name: "4 Sets", price: 99.99, was: 139.96 },
};
const PRODUCT = { name: "Emberwell™ Rechargeable Hand Warmer", image: "/img/warmer-main.svg" };
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

function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function cartTotal() { return Object.entries(cart).reduce((sum, [id, q]) => sum + BUNDLES[id].price * q, 0); }

function renderCart() {
  const count = cartCount();
  $$("[data-cart-count]").forEach((el) => { el.textContent = count; el.dataset.count = count; });
  const items = $("[data-cart-items]");
  if (!items) return;
  if (!count) {
    items.innerHTML = '<div class="drawer__empty">Your cart is empty.<br><a class="btn" href="/#shop" data-close-cart>Shop now</a></div>';
  } else {
    items.innerHTML = Object.entries(cart).map(([id, q]) => `
      <div class="line">
        <img src="${PRODUCT.image}" alt="">
        <div>
          <div class="line__name">${PRODUCT.name}</div>
          <div class="line__variant">${BUNDLES[id].name}</div>
          <div class="qty">
            <button type="button" data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span>${q}</span>
            <button type="button" data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div>
          <div class="line__price">${money(BUNDLES[id].price * q)}</div>
          <button type="button" class="line__remove" data-remove="${id}">Remove</button>
        </div>
      </div>`).join("");
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

function openModal(text) {
  const modal = $("[data-modal]");
  if (!modal) return;
  if (text) $("[data-modal-text]").textContent = text;
  modal.classList.add("is-open");
}

// ---------- Product: bundles + gallery ----------
function selectedBundle() {
  return $('input[name="bundle"]:checked')?.value || "1";
}

function updatePrice() {
  const b = BUNDLES[selectedBundle()];
  const price = $("[data-price]");
  if (!price) return;
  price.textContent = money(b.price);
  const was = $("[data-was]");
  const save = $("[data-save]");
  if (b.was) {
    was.textContent = money(b.was);
    save.textContent = "Save $" + Math.round(b.was - b.price);
    was.hidden = save.hidden = false;
  } else {
    was.hidden = save.hidden = true;
  }
  const sticky = $("[data-sticky-price]");
  if (sticky) sticky.textContent = money(b.price);
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
    else openModal();
  } else if (t.matches("[data-close-modal]")) {
    $("[data-modal]").classList.remove("is-open");
  } else if (t.closest(".gallery__thumbs")) {
    $$(".gallery__thumbs button").forEach((b) => b.classList.toggle("is-active", b === t));
    $("#gallery-main").src = t.dataset.src;
  }
});

document.addEventListener("change", (e) => {
  if (e.target.name === "bundle") updatePrice();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeCart(); $("[data-modal]")?.classList.remove("is-open"); }
});

// ---------- Sticky mobile buy bar ----------
if ("IntersectionObserver" in window) {
  const mainBuy = $(".product__info [data-add-to-cart]");
  const sticky = $("[data-sticky-buy]");
  if (mainBuy && sticky) {
    new IntersectionObserver(([en]) => {
      sticky.classList.toggle("is-visible", !en.isIntersecting && en.boundingClientRect.top < 0);
    }).observe(mainBuy);
  }
}

$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
updatePrice();
deliveryEstimate();
renderCart();
