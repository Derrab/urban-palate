 /* ============================================================
   URBAN PALATE — front-end app
   Menu data, rendering, filtering, and the reservation form.
   Talks to the backend at server.js via POST /api/bookings
   ============================================================ */

// ---- Config ---------------------------------------------------
const API_BASE ="http://localhost:3000";

// ---- Icons (inline SVG line-icons, one per category) ----------
const ICONS = {
  grill: `<svg class="dish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 10h16M4 10a2 2 0 1 1 0-4M20 10a2 2 0 1 0 0-4M6 10c0 5 1.5 9 6 9s6-4 6-9"/><path d="M9 6.5c.5-1 .3-2-.3-2.8M15 6.5c-.5-1-.3-2 .3-2.8"/></svg>`,
  mains: `<svg class="dish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="8.3"/><path d="M12 8v8M8 12h8" stroke-width="1"/></svg>`,
  sides: `<svg class="dish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 13c0 4 3.6 7 8 7s8-3 8-7"/><path d="M4 13c0-1 .5-2 1.5-2.3C6 9 7.5 8 9 8.6c.8-1.6 3-2 4.3-.8 1.6-.7 3.4.2 3.7 2 1.3.1 2.5 1 3 2.2"/></svg>`,
  starters: `<svg class="dish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9Z"/><path d="M12 12v9"/></svg>`,
  desserts: `<svg class="dish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 12a7 7 0 0 1 14 0"/><path d="M3 12h18M5 12l1 8h12l1-8"/></svg>`,
  drinks: `<svg class="dish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 3h12l-1.5 9a4.5 4.5 0 0 1-9 0L6 3Z"/><path d="M12 15v6M8 21h8"/></svg>`
};

// ---- Menu data with images --------------------------------------------------
const MENU = [
  { 
    id: "kachumbari", 
    name: "Kachumbari", 
    cat: "starters", 
    price: 150,
    desc: "Tomato, red onion, chili and coriander, cut fine and dressed at the table.",
    image: "/public/images/kachumbari.jpg"
  },
  { 
    id: "mutura", 
    name: "Mutura", 
    cat: "starters", 
    price: 300,
    desc: "Kenyan smoked sausage of beef and offal, grilled and sliced thin.",
    image: "/public/images/mutura.jpg"
  },
  { 
    id: "samosa", 
    name: "Nyama Samosa", 
    cat: "starters", 
    price: 450,
    desc: "Hand-folded pastry, spiced minced beef, tamarind dip.",
    image: "/public/images/samosa.jpg"
  },
  { 
    id: "nyama-choma", 
    name: "Nyama Choma", 
    cat: "grill", 
    price: 1800,
    desc: "Char-grilled goat over acacia coals, dry-rubbed, served on the bone.",
    image: "/public/images/nyama-choma.jpg"
  },
  { 
    id: "mbuzi-choma", 
    name: "Mbuzi Choma Ribs", 
    cat: "grill", 
    price: 2200,
    desc: "Slow-roasted goat ribs, finished hot over open flame.",
    image: "/public/images/mbuzi-choma.jpg"
  },
  { 
    id: "kuku-choma", 
    name: "Kuku Choma", 
    cat: "grill", 
    price: 1500,
    desc: "Half chicken, citrus-and-chili marinade, grilled to order.",
    image: "/public/images/kuku-choma.jpg"
  },
  { 
    id: "samaki-kupaka", 
    name: "Samaki wa Kupaka", 
    cat: "mains", 
    price: 1600,
    desc: "Coastal tilapia simmered in coconut and tomato, coriander.",
    image: "/public/images/samaki wa kupaka.jpg"
  },
  { 
    // ✅ FIXED: Removed space in ID
    id: "chicken-curry", 
    name: "Chicken Curry", 
    cat: "mains", 
    price: 1500,
    desc: "Chicken curry with Swahili spices, slow-cooked to perfection.",
    image: "/public/images/chicken-curry.jpg"
  },
  { 
    id: "pilau", 
    name: "Pilau ya Nyama", 
    cat: "mains", 
    price: 1200,
    desc: "Spiced rice slow-cooked with beef, clove, cardamom, cumin.",
    image: "/public/images/pilau.jpg"
  },
  { 
    id: "biryani", 
    name: "Swahili Biryani", 
    cat: "mains", 
    price: 1400,
    desc: "Layered saffron rice, marinated chicken, crisp fried onion.",
    image: "/public/images/biryani.jpg"
  },
  { 
    id: "githeri", 
    name: "Githeri", 
    cat: "mains", 
    price: 300,
    desc: "Maize and bean stew. Ask for the vegetarian pot.",
    image: "/public/images/githeri.jpg"
  },
  { 
    // ✅ FIXED: Removed veg:true since it has meat (nyama)
    id: "mukimo", 
    name: "Mukimo with Nyama", 
    cat: "sides", 
    price: 500,
    desc: "Mashed potato, maize, pumpkin leaf and green banana, served with beef stew.",
    image: "/public/images/mukimo.jpg"
  },
  { 
    // ✅ FIXED: Removed space in ID and veg:true since it has beef
    id: "ugali-sukuma-beefstew", 
    name: "Ugali na Sukuma Wiki with Beef Stew", 
    cat: "sides", 
    price: 600,
    desc: "Maize meal with garlic-sautéed collard greens, served with beef stew.",
    image: "/public/images/ugali-sukuma-beef stew.jpg"
  },
  { 
    id: "matoke", 
    name: "Matoke", 
    cat: "sides", 
    price: 600, 
    desc: "Green bananas braised in coconut milk and mild spice.",
    image: "/public/images/matoke.jpg"
  },
  { 
    id: "doughnuts", 
    name: "Doughnuts na Chai", 
    cat: "desserts", 
    price: 350, 
    desc: "Coconut doughnuts, cardamom-spiced Kenyan tea.",
    image: "/public/images/doughnuts and chai.jpg"
  },
  { 
    id: "kaimati", 
    name: "Kaimati", 
    cat: "desserts", 
    price: 400, 
    desc: "Sweet fried dumplings soaked in cardamom syrup.",
    image: "/public/images/kaimati.jpg"
  },
  { 
    id: "dawa", 
    name: "Dawa", 
    cat: "drinks", 
    price: 900,
    desc: "Honey, lime and vodka, muddled tableside. The classic 'medicine.'",
    image: "/public/images/dawa.jpg"
  },
  { 
    id: "tamarind-tea", 
    name: "Tamarind Iced Tea", 
    cat: "drinks", 
    price: 350, 
    desc: "Tamarind, ginger and mint, served long over ice. Non-alcoholic.",
    image: "/public/images/tamarind-tea.jpg"
  }
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "starters", label: "Starters" },
  { id: "grill", label: "The Grill" },
  { id: "mains", label: "Mains" },
  { id: "sides", label: "Sides" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" }
];

const money = (n) => "KES " + n.toLocaleString("en-KE");

// ---- Render menu --------------------------------------------------
function renderFilters(active = "all") {
  const el = document.getElementById("menuFilters");
  if (!el) return;

  el.innerHTML = CATEGORIES.map(c => `
    <button class="filter-btn ${c.id === active ? "active" : ""}" data-cat="${c.id}" role="tab" aria-selected="${c.id === active}">
      ${c.label}
    </button>
  `).join("");

  el.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      renderFilters(btn.dataset.cat);
      renderGrid(btn.dataset.cat);
    });
  });
}

function renderGrid(cat = "all") {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const items = cat === "all" ? MENU : MENU.filter(d => d.cat === cat);
  grid.innerHTML = items.map(d => `
    <article class="dish">
      <div class="dish-image-wrapper">
        <img src="${d.image}" alt="${d.name}" class="dish-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3E🍽️%3C/text%3E%3C/svg%3E'" />
        ${ICONS[d.cat] || ""}
      </div>
      <div class="dish-content">
        <div class="dish-top">
          <h3 class="dish-name">${d.name}</h3>
          <span class="dish-price">${money(d.price)}</span>
        </div>
        <p class="dish-desc">${d.desc}</p>
        ${d.veg ? `<span class="dish-tag">🌱 Vegetarian</span>` : ""}
      </div>
    </article>
  `).join("");
}

// ---- Initialize menu --------------------------------------------------
renderFilters();
renderGrid();

// ---- Nav toggle (mobile) ------------------------------------------
const navToggle = document.getElementById("navToggle");
const siteHeader = document.querySelector(".site-header");

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    const open = siteHeader.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

const siteNav = document.getElementById("siteNav");
if (siteNav) {
  siteNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      siteHeader.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ---- Footer year ----------------------------------------------------
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---- WhatsApp Floating Button (Add this section) --------------------
(function addWhatsAppButton() {
  if (document.querySelector('.whatsapp-float')) return;
  
  const whatsappNumber = '254728330852';
  const whatsappLink = document.createElement('a');
  whatsappLink.href = `https://wa.me/${whatsappNumber}?text=Hello%20Urban%20Palate!%20I%27d%20like%20to%20make%20a%20reservation.`;
  whatsappLink.className = 'whatsapp-float';
  whatsappLink.target = '_blank';
  whatsappLink.rel = 'noopener noreferrer';
  whatsappLink.innerHTML = `
    <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  `;
  document.body.appendChild(whatsappLink);

  const style = document.createElement('style');
  style.textContent = `
    .whatsapp-float {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      background: #25D366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
      z-index: 1000;
      transition: all 0.3s ease;
      text-decoration: none;
      animation: pulse 2s infinite;
    }
    .whatsapp-float:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(37, 211, 102, 0.5);
    }
    .whatsapp-float svg {
      width: 32px;
      height: 32px;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
      100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
    }
    @media (max-width: 768px) {
      .whatsapp-float {
        width: 50px;
        height: 50px;
        bottom: 20px;
        right: 20px;
      }
      .whatsapp-float svg {
        width: 26px;
        height: 26px;
      }
    }
  `;
  document.head.appendChild(style);
})();

// ---- Booking form -----------------------------------------------------
const bookingForm = document.getElementById("bookingForm");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");
const submitBtn = document.getElementById("bookingSubmit");
const formStatus = document.getElementById("formStatus");

// Restrict date picker to today .. +60 days
(function initDateBounds() {
  if (!dateInput) return;
  const today = new Date();
  const max = new Date();
  max.setDate(today.getDate() + 60);
  const iso = (d) => d.toISOString().split("T")[0];
  dateInput.min = iso(today);
  dateInput.max = iso(max);
})();

// Populate time slots: 12:00 to 22:00 in 30-min steps
(function initTimeSlots() {
  if (!timeSelect) return;
  const slots = [];
  for (let h = 12; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) continue;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  timeSelect.innerHTML += slots.map(s => `<option value="${s}">${s}</option>`).join("");
})();

// Kenyan phone number: accepts 07xx/01xx local or +254/254 international
function isValidKenyanPhone(value) {
  const v = value.replace(/[\s-]/g, "");
  return /^(?:\+254|254|0)(7|1)\d{8}$/.test(v);
}

function normalizeKenyanPhone(value) {
  const v = value.replace(/[\s-]/g, "");
  if (v.startsWith("+254")) return v;
  if (v.startsWith("254")) return "+" + v;
  if (v.startsWith("0")) return "+254" + v.slice(1);
  return v;
}

function setFieldError(name, message) {
  const span = document.querySelector(`.field-error[data-for="${name}"]`);
  if (span) span.textContent = message || "";
}

function validateForm(data) {
  let ok = true;
  ["fullName", "phone", "date", "time", "guests"].forEach(f => setFieldError(f, ""));

  if (!data.fullName || data.fullName.trim().length < 2) {
    setFieldError("fullName", "Enter your full name.");
    ok = false;
  }
  if (!isValidKenyanPhone(data.phone)) {
    setFieldError("phone", "Enter a valid Kenyan number, e.g. 07XX XXX XXX.");
    ok = false;
  }
  if (!data.date) {
    setFieldError("date", "Choose a date.");
    ok = false;
  }
  if (!data.time) {
    setFieldError("time", "Choose a time.");
    ok = false;
  }
  if (!data.guests) {
    setFieldError("guests", "Choose your party size.");
    ok = false;
  }
  return ok;
}

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(bookingForm).entries());
    if (!validateForm(data)) return;

    data.phone = normalizeKenyanPhone(data.phone);

    if (submitBtn) {
      submitBtn.disabled = true;
      const label = submitBtn.querySelector(".btn-label");
      if (label) label.textContent = "Sending…";
    }

    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      if (formStatus) {
        formStatus.textContent = `✅ Reservation confirmed for ${data.date} at ${data.time}. We'll WhatsApp you shortly!`;
        formStatus.classList.add("success");
      }
      bookingForm.reset();

    } catch (err) {
      if (formStatus) {
        formStatus.textContent = err.message || "We couldn't send your reservation. Please try again or call us.";
        formStatus.classList.add("error");
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        const label = submitBtn.querySelector(".btn-label");
        if (label) label.textContent = "Confirm Reservation";
      }
    }
  });
}