// Replace these with your own designs. Image files live in the "images" folder.
const products = [
  { name: "Silk Wrap Dress", category: "dresses", price: "$240", image: "images/dress1.svg" },
  { name: "Linen Button Shirt", category: "tops", price: "$120", image: "images/top1.svg" },
  { name: "Wool Trench Coat", category: "outerwear", price: "$380", image: "images/coat1.svg" },
  { name: "Pleated Midi Skirt", category: "dresses", price: "$160", image: "images/skirt1.svg" }
];

const grid = document.getElementById("product-grid");

function renderProducts(filter = "all") {
  grid.innerHTML = "";
  const filtered = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price}</p>
    `;
    grid.appendChild(card);
  });
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

// Contact form (front-end only; shows a confirmation message)
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("form-status").textContent =
    "Thank you! Your message has been received.";
  e.target.reset();
});

renderProducts();
