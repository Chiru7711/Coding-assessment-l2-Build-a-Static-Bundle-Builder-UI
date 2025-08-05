const PRODUCTS = [
  { id: 1, title: "Tie-Dye Lounge Set", price: 129.99, image: "assets/product-1.png" },
  { id: 2, title: "Sunburst Tracksuit", price: 149.99, image: "assets/product-2.png" },
  { id: 3, title: "Retro Red Streetwear", price: 899.99, image: "assets/product-3.png" },
  { id: 4, title: "Urban Sportwear Combo", price: 1999.49, image: "assets/product-4.png" },
  { id: 5, title: "Oversized Knit & Coat", price: 199.99, image: "assets/product-5.png" },
  { id: 6, title: "Chit Monochrome Blazer", price: 159.00, image: "assets/product-6.png" }
];

let selected = {}; // {id: quantity}
const $ = sel => document.querySelector(sel);
const grid = $('.product-grid');
const sidebar = $('.bundle-sidebar');
const selectedList = sidebar.querySelector('.selected-list');
const progress = sidebar.querySelector('.progress-bar-inner');
const count = $('#selected-count');
const subtotalVal = $('#subtotal-val');
const discountRow = $('#discount-row');
const discountAmount = $('#discount-amount');
const cta = $('#bundle-cta');

function renderGrid() {
  grid.innerHTML = PRODUCTS.map(product => {
    const isActive = selected[product.id] > 0;

    // Pick button style
    let btnClass = 'bundle-btn';
    let btnLabel = '', btnIcon = '';
    if(isActive) {
      btnClass += ' grey';
      btnLabel = 'Added to Bundle';
      btnIcon = '<span class="icon check">&#10003;</span>';
    } else {
      btnClass += ' dark';
      btnLabel = 'Add to Bundle';
      btnIcon = '<span class="icon">+</span>';
    }

    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="${btnClass}" data-id="${product.id}">
          ${btnLabel} ${btnIcon}
        </button>
      </div>
    `;
  }).join('');
}

function renderSidebar() {
  const totalItems = Object.values(selected).reduce((sum, qty) => sum + qty, 0);
  count.textContent = Math.min(totalItems, 3);
  progress.style.width = Math.min(100, totalItems/3*100) + "%";
  // Selected list
  selectedList.innerHTML = Object.keys(selected).filter(id => selected[id] > 0).map(id => {
    const p = PRODUCTS.find(p => p.id == id);
    const qty = selected[id];
    return `
      <div class="selected-item">
        <img src="${p.image}" alt="" class="item-image">
        <div class="item-content">
          <div class="item-title">${p.title}</div>
          <div class="item-price">$${(p.price * qty).toFixed(2)}</div>
          <div class="item-bottom">
            <div class="quantity-controls">
              <button class="qty-btn" data-id="${p.id}" data-action="decrease">-</button>
              <span class="quantity">${qty}</span>
              <button class="qty-btn" data-id="${p.id}" data-action="increase">+</button>
            </div>
            <button class="selected-item-remove" data-id="${p.id}"><img src="https://img.icons8.com/?size=100&id=14237&format=png&color=000000" alt="Delete" width="16" height="16"></button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  // Subtotal & discount
  const subtotal = Object.keys(selected).reduce((sum, id) => sum + (PRODUCTS.find(p => p.id == id).price * selected[id]), 0);
  const discount = totalItems >=3 ? 0.3 * subtotal : 0;
  const total = subtotal - discount;
  subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
  if(totalItems >= 3) {
    discountRow.style.display = "flex";
    discountAmount.textContent = `-$${discount.toFixed(2)} (30%)`;
  } else {
    discountRow.style.display = "none";
  }
  // CTA
  cta.disabled = totalItems < 3;

  // CTA Text
  let ctaLabel = "Add 3 Items to Cart";
  let ctaIcon = '<span class="icon arrow">&rarr;</span>';
  cta.innerHTML = ctaLabel + ' ' + ctaIcon;
}
grid.addEventListener("click", function(e){
  if(e.target.closest('button')) {
    const btn = e.target.closest('button');
    const id = +btn.dataset.id;
    if(selected[id]) {
      delete selected[id];
    } else {
      selected[id] = 1;
    }
    renderGrid();
    renderSidebar();
  }
});
selectedList.addEventListener('click', function(e){
  const target = e.target.closest('button');
  if(!target) return;
  
  const id = +target.dataset.id;
  
  if(target.classList.contains('selected-item-remove')) {
    delete selected[id];
    renderGrid();
    renderSidebar();
  } else if(target.classList.contains('qty-btn')) {
    const action = target.dataset.action;
    if(action === 'increase') {
      selected[id]++;
    } else if(action === 'decrease') {
      selected[id]--;
      if(selected[id] <= 0) delete selected[id];
    }
    renderGrid();
    renderSidebar();
  }
});
cta.addEventListener('click', function(){
  const totalItems = Object.values(selected).reduce((sum, qty) => sum + qty, 0);
  if(totalItems < 3) return;
  const bundle = Object.keys(selected).map(id => ({...PRODUCTS.find(p => p.id == id), quantity: selected[id]}));
  alert("Bundle added! (see console)");
  console.log("BUNDLE:", bundle);
});
renderGrid();
renderSidebar();
