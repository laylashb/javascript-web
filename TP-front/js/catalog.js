const CART_KEY = 'mpc_cart';

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart(cart);

  alert("Produit ajouté au panier ✅");
}

document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.getElementById('products-grid');
  const productsEmpty = document.getElementById('products-empty');
  const productsCount = document.getElementById('products-count');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const categoryFilter = document.getElementById('category-filter');

  let allProducts = [];

  async function loadProducts() {
    const params = new URLSearchParams();

    if (searchInput?.value.trim()) {
      params.set('search', searchInput.value.trim());
    }

    if (categoryFilter?.value) {
      params.set('category', categoryFilter.value);
    }

    const query = params.toString();
    const path = query ? `/products?${query}` : '/products';

    try {
      // IMPORTANT: auth activé
      const data = await apiFetch(path, { auth: true });

      allProducts = data || [];
      renderProducts(allProducts);
      populateCategories(allProducts);

    } catch (err) {
      console.error(err);
      productsGrid.innerHTML = '';
      productsEmpty.classList.remove('hidden');
      productsEmpty.textContent = 'Erreur lors du chargement des produits.';
    }
  }

  function renderProducts(products) {
    productsGrid.innerHTML = '';

    if (!products.length) {
      productsEmpty.classList.remove('hidden');
      productsCount.textContent = '0 produit(s)';
      return;
    }

    productsEmpty.classList.add('hidden');
    productsCount.textContent = `${products.length} produit(s)`;

    products.forEach((product) => {
      const article = document.createElement('article');
      article.className =
        'group rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between';

      const title = document.createElement('h3');
      title.className = 'font-semibold group-hover:text-emerald-400 transition';
      title.textContent = product.name;

      const desc = document.createElement('p');
      desc.className = 'text-xs text-slate-400 line-clamp-2 mt-1';
      desc.textContent = product.description || 'Aucune description.';

      const infoWrapper = document.createElement('div');
      infoWrapper.className = 'mt-4 flex items-center justify-between';

      const priceBlock = document.createElement('div');
      priceBlock.className = 'text-sm';

      const price = document.createElement('span');
      price.className = 'font-semibold text-emerald-400';
      price.textContent = `${Number(product.price).toFixed(2)} €`;

      const stock = document.createElement('p');
      stock.className = 'text-[11px] text-slate-500';

      if (product.stock <= 0) {
        stock.textContent = 'Rupture de stock';
        stock.classList.add('text-rose-400');
      } else if (product.stock <= 3) {
        stock.textContent = `Stock limité (${product.stock})`;
        stock.classList.add('text-amber-300');
      } else {
        stock.textContent = `En stock (${product.stock})`;
      }

      priceBlock.appendChild(price);
      priceBlock.appendChild(stock);

      const btn = document.createElement('button');
      btn.className =
        'inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs hover:bg-emerald-500 hover:text-slate-950 transition';
      btn.textContent = product.stock > 0 ? 'Ajouter' : 'Indisponible';
      btn.disabled = product.stock <= 0;

      btn.addEventListener('click', () => {
        addToCart(product);

        btn.textContent = 'Ajouté !';
        btn.classList.add('bg-emerald-500', 'text-slate-950');

        setTimeout(() => {
          btn.textContent = 'Ajouter';
          btn.classList.remove('bg-emerald-500', 'text-slate-950');
        }, 800);
      });

      infoWrapper.appendChild(priceBlock);
      infoWrapper.appendChild(btn);

      article.appendChild(title);
      article.appendChild(desc);
      article.appendChild(infoWrapper);

      productsGrid.appendChild(article);
    });
  }

  function populateCategories(products) {
    if (!categoryFilter) return;

    const categories = new Set();

    products.forEach((p) => {
      if (p.category) categories.add(p.category);
    });

    const current = categoryFilter.value;

    categoryFilter.innerHTML = '<option value="">Toutes les catégories</option>';

    Array.from(categories)
      .sort()
      .forEach((cat) => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
      });

    if (current) categoryFilter.value = current;
  }

  searchBtn?.addEventListener('click', loadProducts);

  searchInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') loadProducts();
  });

  categoryFilter?.addEventListener('change', loadProducts);

  loadProducts();
});