const map = L.map("map").setView([36.1699, -115.1398], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

const listEl = document.getElementById("list");
const tabButtons = document.querySelectorAll(".tab-btn");

let activeCategory = "all";
let markers = [];

const pawIcon = `<svg width="12" height="12" viewBox="0 0 100 100" aria-hidden="true">
  <ellipse cx="50" cy="65" rx="26" ry="20" fill="currentColor"/>
  <circle cx="18" cy="30" r="12" fill="currentColor"/>
  <circle cx="42" cy="14" r="12" fill="currentColor"/>
  <circle cx="66" cy="14" r="12" fill="currentColor"/>
  <circle cx="88" cy="30" r="12" fill="currentColor"/>
</svg>`;

function bearIcon() {
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
    </svg>`,
    iconSize: [42, 42],
    iconAnchor: [21, 40],
    popupAnchor: [0, -36]
  });
}

function renderMarkers(places) {
  markers.forEach(m => map.removeLayer(m));
  markers = places.map(place => {
    const marker = L.marker([place.lat, place.lng], { icon: bearIcon() }).addTo(map);
    marker.bindPopup(`<strong>${place.name}</strong><br>${place.address}`);
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
    if (place.yelpUrl) links.push(`<a href="${place.yelpUrl}" target="_blank" rel="noopener">View on Yelp</a>`);
    if (place.googleUrl) links.push(`<a href="${place.googleUrl}" target="_blank" rel="noopener">View on Google Maps</a>`);

    card.innerHTML = `
      <span class="category-badge">${pawIcon}${place.category}</span>
      <h3>${place.name}</h3>
      <p class="address">${place.address}</p>
      <p class="desc">${place.description || ""}</p>
      <div class="links">${links.join("")}</div>
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
    card.querySelectorAll(".links a").forEach(a => a.addEventListener("click", e => e.stopPropagation()));

    listEl.appendChild(card);
  });
}

const statusEl = document.getElementById("filter-status");

function applyFilter() {
  const filtered = activeCategory === "all"
    ? PLACES
    : PLACES.filter(p => p.category === activeCategory);
  renderList(filtered);
  renderMarkers(filtered);

  if (statusEl) {
    const label = activeCategory === "all" ? "places" : activeCategory;
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

applyFilter();
