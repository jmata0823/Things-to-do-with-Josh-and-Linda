const map = L.map("map").setView([36.1699, -115.1398], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

const listEl = document.getElementById("list");
const tabButtons = document.querySelectorAll(".tab-btn[data-category]");
const statusEl = document.getElementById("filter-status");

let activeCategory = "all";
let markers = [];
let communityPlaces = [];
let visitedIds = new Set();

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CATEGORY_LABELS = {
  restaurants: "Restaurants",
  cafes: "Cafes",
  entertainment: "Entertainment/Bars"
};

function categoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

function getAllPlaces() {
  const seed = PLACES.map(p => ({ ...p, id: p.id || slugify(p.name) }));
  return [...seed, ...communityPlaces];
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isSafeUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url.trim());
}

const pawIcon = `<svg width="12" height="12" viewBox="0 0 100 100" aria-hidden="true">
  <ellipse cx="50" cy="65" rx="26" ry="20" fill="currentColor"/>
  <circle cx="18" cy="30" r="12" fill="currentColor"/>
  <circle cx="42" cy="14" r="12" fill="currentColor"/>
  <circle cx="66" cy="14" r="12" fill="currentColor"/>
  <circle cx="88" cy="30" r="12" fill="currentColor"/>
</svg>`;

function checkBadge(visited) {
  if (!visited) return "";
  return `<circle cx="82" cy="18" r="17" fill="#4d7c53" stroke="#fff8ea" stroke-width="3"/>
    <path d="M73 18 L79 25 L91 10" stroke="#fff8ea" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function bearIcon(visited) {
  return L.divIcon({
    className: "bear-marker",
    html: `<svg viewBox="0 0 100 100" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="52" r="38" fill="#a97c50" stroke="#6b4423" stroke-width="3"/>
      <circle cx="22" cy="22" r="13" fill="#a97c50" stroke="#6b4423" stroke-width="3"/>
      <circle cx="78" cy="22" r="13" fill="#a97c50" stroke="#6b4423" stroke-width="3"/>
      <circle cx="22" cy="22" r="6" fill="#f2d9b1"/>
      <circle cx="78" cy="22" r="6" fill="#f2d9b1"/>
      <ellipse cx="50" cy="62" rx="21" ry="16" fill="#f2d9b1"/>
      <ellipse cx="50" cy="53" rx="6.5" ry="4.5" fill="#3b2f27"/>
      <circle cx="37" cy="42" r="4.5" fill="#3b2f27"/>
      <circle cx="63" cy="42" r="4.5" fill="#3b2f27"/>
      ${checkBadge(visited)}
    </svg>`,
    iconSize: [42, 42],
    iconAnchor: [21, 40],
    popupAnchor: [0, -36]
  });
}

function honeypotIcon(visited) {
  return L.divIcon({
    className: "honeypot-marker",
    html: `<svg viewBox="0 0 100 100" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 46 Q20 46 20 60 L20 80 Q20 92 50 92 Q80 92 80 80 L80 60 Q80 46 72 46 Z" fill="#e8a33d" stroke="#6b4423" stroke-width="4"/>
      <rect x="20" y="61" width="60" height="11" fill="#6b4423"/>
      <text x="50" y="70" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="#f2d9b1" text-anchor="middle">honey</text>
      <ellipse cx="50" cy="46" rx="24" ry="9" fill="#6b4423"/>
      <ellipse cx="50" cy="43" rx="19" ry="7" fill="#a97c50"/>
      <path d="M38 36 Q38 22 50 22 Q62 22 62 36 Q62 44 50 46 Q38 44 38 36 Z" fill="#e8a33d" stroke="#6b4423" stroke-width="3"/>
      ${checkBadge(visited)}
    </svg>`,
    iconSize: [42, 42],
    iconAnchor: [21, 40],
    popupAnchor: [0, -36]
  });
}

function mugIcon(visited) {
  return L.divIcon({
    className: "mug-marker",
    html: `<svg viewBox="0 0 100 100" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 12 Q50 6 44 8 Q40 10 42 16 L46 30" stroke="#a97c50" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M58 12 Q58 6 52 8 Q48 10 50 16 L54 30" stroke="#a97c50" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="22" y="32" width="56" height="46" rx="8" fill="#f2d9b1" stroke="#6b4423" stroke-width="4"/>
      <path d="M78 40 h8 a10 10 0 0 1 0 24 h-8 Z" fill="#f2d9b1" stroke="#6b4423" stroke-width="4"/>
      <path d="M28 32 Q50 46 72 32" fill="#6b4423"/>
      ${checkBadge(visited)}
    </svg>`,
    iconSize: [42, 42],
    iconAnchor: [21, 40],
    popupAnchor: [0, -36]
  });
}

function markerIcon(category, visited) {
  if (category === "entertainment") return bearIcon(visited);
  if (category === "cafes") return mugIcon(visited);
  return honeypotIcon(visited);
}

function renderMarkers(places) {
  markers.forEach(m => map.removeLayer(m));
  markers = places.map(place => {
    const visited = visitedIds.has(place.id);
    const marker = L.marker([place.lat, place.lng], { icon: markerIcon(place.category, visited) }).addTo(map);
    marker.bindPopup(`<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.address)}`);
    marker.placeName = place.name;
    return marker;
  });

  if (markers.length) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }
}

function renderList(places) {
  listEl.innerHTML = "";

  if (!places.length) {
    listEl.innerHTML = `
      <div class="empty-state">
        ${pawIcon.replace('width="12" height="12"', 'width="28" height="28"')}
        <p>No spots here yet — this trail's still waiting to be blazed.</p>
      </div>
    `;
    return;
  }

  places.forEach(place => {
    const card = document.createElement("div");
    card.className = "place-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Show ${place.name} on the map`);

    const links = [];
    if (isSafeUrl(place.googleUrl)) links.push(`<a href="${escapeHtml(place.googleUrl)}" data-type="google" target="_blank" rel="noopener">View on Google Maps</a>`);

    const visited = visitedIds.has(place.id);

    card.innerHTML = `
      <span class="category-badge">${pawIcon}${escapeHtml(categoryLabel(place.category))}</span>
      <h3>${escapeHtml(place.name)}</h3>
      <p class="address">${escapeHtml(place.address)}</p>
      <p class="desc">${escapeHtml(place.description || "")}</p>
      <div class="links">${links.join("")}</div>
      <label class="visited-toggle">
        <input type="checkbox" class="visited-checkbox" data-id="${escapeHtml(place.id)}" ${visited ? "checked" : ""}>
        We've been here
      </label>
    `;

    const selectPlace = () => {
      document.querySelectorAll(".place-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      map.setView([place.lat, place.lng], 15);
      const marker = markers.find(m => m.placeName === place.name);
      if (marker) marker.openPopup();
    };

    card.addEventListener("click", selectPlace);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectPlace();
      }
    });

    card.querySelectorAll(".links a").forEach(a => {
      a.addEventListener("click", e => {
        e.stopPropagation();
        e.preventDefault();
        if (a.dataset.type === "google") openMapModal(place);
      });
    });

    const visitedLabel = card.querySelector(".visited-toggle");
    visitedLabel.addEventListener("click", e => e.stopPropagation());
    const visitedCheckbox = card.querySelector(".visited-checkbox");
    visitedCheckbox.addEventListener("change", () => setVisited(place.id, visitedCheckbox.checked));

    listEl.appendChild(card);
  });
}

function applyFilter() {
  const allPlaces = getAllPlaces();
  const filtered = activeCategory === "all"
    ? allPlaces
    : allPlaces.filter(p => p.category === activeCategory);
  renderList(filtered);
  renderMarkers(filtered);

  if (statusEl) {
    const label = activeCategory === "all" ? "places" : categoryLabel(activeCategory);
    statusEl.textContent = `Showing ${filtered.length} ${label}`;
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    activeCategory = btn.dataset.category;
    applyFilter();
  });
});

/* ---------- Firestore (shared, permanent additions) ---------- */

// Firestore's client can throw a spurious permission-denied on the first
// request(s) right after page load, before its internal session is fully
// warmed up — retrying with backoff clears it without any real rules issue
// (confirmed: identical queries succeed moments later).
function subscribeWithRetry(label, subscribe, attempt) {
  subscribe(err => {
    if (attempt < 6) {
      setTimeout(() => subscribeWithRetry(label, subscribe, attempt + 1), 500 * (attempt + 1));
    } else {
      console.error(`Couldn't load ${label} from Firestore:`, err);
    }
  });
}

function setVisited(id, visited) {
  if (typeof db === "undefined" || !id) return;
  db.collection("visited").doc(id).set({
    visited,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(err => console.error("Couldn't save visited status:", err));
}

if (typeof db !== "undefined") {
  subscribeWithRetry("shared places", onError => {
    db.collection("places").orderBy("createdAt", "asc").onSnapshot(
      snapshot => {
        communityPlaces = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        applyFilter();
      },
      onError
    );
  }, 0);

  subscribeWithRetry("visited status", onError => {
    db.collection("visited").onSnapshot(
      snapshot => {
        visitedIds = new Set(
          snapshot.docs.filter(doc => doc.data().visited).map(doc => doc.id)
        );
        applyFilter();
      },
      onError
    );
  }, 0);
}

/* ---------- Modal (in-page Yelp / Google Maps) ---------- */

const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
let lastFocused = null;

function openModal(html) {
  modalBody.innerHTML = html;
  modalOverlay.hidden = false;
  document.body.classList.add("modal-open");
  lastFocused = document.activeElement;
  modalClose.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  modalBody.innerHTML = "";
  document.body.classList.remove("modal-open");
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modalOverlay.hidden) closeModal();
});

function openMapModal(place) {
  const fallbackUrl = `https://www.google.com/maps?q=${place.lat},${place.lng}`;
  const externalUrl = isSafeUrl(place.googleUrl) ? place.googleUrl : fallbackUrl;
  openModal(`
    <h3 id="modal-title">${escapeHtml(place.name)}</h3>
    <p class="modal-address">${escapeHtml(place.address)}</p>
    <iframe class="map-embed" src="https://www.google.com/maps?q=${place.lat},${place.lng}&output=embed" loading="lazy" title="Map showing ${escapeHtml(place.name)}"></iframe>
    <a class="modal-external" href="${escapeHtml(externalUrl)}" target="_blank" rel="noopener">Open in Google Maps ↗</a>
  `);
}

/* ---------- Add a place ---------- */

const addToggleBtn = document.getElementById("add-toggle-btn");
const addPanel = document.getElementById("add-place-panel");
const placeForm = document.getElementById("place-form");
const lookupBtn = document.getElementById("lookup-btn");
const lookupStatus = document.getElementById("lookup-status");
const addResult = document.getElementById("add-result");
const addResultText = document.getElementById("add-result-text");
const submitBtn = placeForm.querySelector(".submit-btn");

addToggleBtn.addEventListener("click", () => {
  const willOpen = addPanel.hidden;
  addPanel.hidden = !willOpen;
  addToggleBtn.setAttribute("aria-expanded", String(willOpen));
  addToggleBtn.textContent = willOpen ? "− Close form" : "+ Add a place";
  if (willOpen) document.getElementById("f-name").focus();
});

function stripUnit(address) {
  return address
    .replace(/,?\s*\b(ste|suite|unit|apt|apartment|fl|floor|bldg|building|#)\.?\s*#?\s*[\w-]+\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

async function geocode(address) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`);
  const data = await res.json();
  return data && data[0] ? data[0] : null;
}

lookupBtn.addEventListener("click", async () => {
  const address = placeForm.address.value.trim();
  if (!address) {
    lookupStatus.textContent = "Enter an address first.";
    return;
  }
  lookupStatus.textContent = "Looking up…";
  lookupBtn.disabled = true;
  try {
    let result = await geocode(address);

    // Suite/unit numbers often trip up the geocoder — retry without one.
    const simplified = stripUnit(address);
    if (!result && simplified !== address) {
      result = await geocode(simplified);
    }

    if (result) {
      placeForm.lat.value = parseFloat(result.lat).toFixed(6);
      placeForm.lng.value = parseFloat(result.lon).toFixed(6);
      lookupStatus.textContent = `Found: ${result.display_name}`;
    } else {
      lookupStatus.textContent = "Couldn't find that address — enter coordinates manually (right-click the spot on Google Maps to copy them).";
    }
  } catch (err) {
    lookupStatus.textContent = "Lookup failed — enter coordinates manually (right-click the spot on Google Maps to copy them).";
  } finally {
    lookupBtn.disabled = false;
  }
});

placeForm.addEventListener("submit", async e => {
  e.preventDefault();

  const lat = parseFloat(placeForm.lat.value);
  const lng = parseFloat(placeForm.lng.value);
  if (!placeForm.name.value.trim() || !placeForm.address.value.trim() || Number.isNaN(lat) || Number.isNaN(lng)) {
    lookupStatus.textContent = "Fill in name, address, and coordinates (use the lookup button, or enter them manually) before adding.";
    return;
  }

  if (typeof db === "undefined") {
    lookupStatus.textContent = "Couldn't save — the shared database isn't available right now.";
    return;
  }

  const newPlace = {
    name: placeForm.name.value.trim(),
    category: placeForm.category.value,
    address: placeForm.address.value.trim(),
    lat,
    lng,
    description: placeForm.description.value.trim(),
    googleUrl: placeForm.googleUrl.value.trim()
  };

  submitBtn.disabled = true;
  lookupStatus.textContent = "Saving…";

  try {
    await db.collection("places").add({
      ...newPlace,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    activeCategory = "all";
    tabButtons.forEach(b => {
      const isAll = b.dataset.category === "all";
      b.classList.toggle("active", isAll);
      b.setAttribute("aria-pressed", String(isAll));
    });

    addResultText.textContent = `${newPlace.name} is on the map now, permanently, for both of you.`;
    addResult.hidden = false;
    lookupStatus.textContent = "";
    addResult.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const category = newPlace.category;
    placeForm.reset();
    placeForm.category.value = category;
  } catch (err) {
    console.error("Failed to save place:", err);
    lookupStatus.textContent = "Couldn't save that — check your connection and try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

applyFilter();
