document.addEventListener('DOMContentLoaded', () => {
  const guardSection = document.getElementById('admin-guard');
  const contentSection = document.getElementById('admin-content');
  const adminEmailEl = document.getElementById('admin-email');
  const logoutBtn = document.getElementById('logout-btn');

  const productsCountEl = document.getElementById('admin-products-count');
  const productsBody = document.getElementById('admin-products-body');
  const productForm = document.getElementById('product-form');
  const productIdInput = document.getElementById('product-id');
  const productNameInput = document.getElementById('product-name');
  const productPriceInput = document.getElementById('product-price');
  const productStockInput = document.getElementById('product-stock');
  const productCategoryInput = document.getElementById('product-category');
  const productDescriptionInput = document.getElementById('product-description');
  const productTagsInput = document.getElementById('product-tags');
  const productSubmitLabel = document.getElementById('product-submit-label');
  const productResetBtn = document.getElementById('product-reset');
  const productFormMessage = document.getElementById('product-form-message');

  const ordersCountEl = document.getElementById('admin-orders-count');
  const ordersBody = document.getElementById('admin-orders-body');

  function requireAdmin() {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      guardSection?.classList.remove('hidden');
      contentSection?.classList.add('hidden');
      return false;
    }
    guardSection?.classList.add('hidden');
    contentSection?.classList.remove('hidden');
    if (adminEmailEl) adminEmailEl.textContent = user.email || 'admin';
    return true;
  }

  logoutBtn?.addEventListener('click', () => {
    clearAuth();
    window.location.href = 'index.html';
  });

  if (!requireAdmin()) {
    return;
  }

  // Produits

  async function loadProducts() {
    try {
      const products = await apiFetch('/products', { auth: true });
      renderProducts(products);
    } catch (err) {
      console.error(err);
      productsBody.innerHTML =
        '<tr><td colspan="4" class="py-2 text-rose-400">Erreur lors du chargement des produits.</td></tr>';
    }
  }

  function renderProducts(products) {
    productsBody.innerHTML = '';
    productsCountEl.textContent = `${products.length} produit(s)`;

    products.forEach((p) => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-slate-800';

      const tdName = document.createElement('td');
      tdName.className = 'py-1 pr-2';
      tdName.textContent = p.name;

      const tdPrice = document.createElement('td');
      tdPrice.className = 'py-1 pr-2';
      tdPrice.textContent = `${p.price.toFixed(2)} €`;

      const tdStock = document.createElement('td');
      tdStock.className = 'py-1 pr-2';
      tdStock.textContent = p.stock;

      const tdActions = document.createElement('td');
      tdActions.className = 'py-1 pr-2';

      const btnEdit = document.createElement('button');
      btnEdit.className = 'text-[11px] text-emerald-400 hover:underline mr-2';
      btnEdit.textContent = 'Modifier';
      btnEdit.addEventListener('click', () => fillProductForm(p));

      const btnDelete = document.createElement('button');
      btnDelete.className = 'text-[11px] text-rose-400 hover:underline';
      btnDelete.textContent = 'Supprimer';
      btnDelete.addEventListener('click', () => deleteProduct(p._id));

      tdActions.appendChild(btnEdit);
      tdActions.appendChild(btnDelete);

      tr.appendChild(tdName);
      tr.appendChild(tdPrice);
      tr.appendChild(tdStock);
      tr.appendChild(tdActions);

      productsBody.appendChild(tr);
    });
  }

  function fillProductForm(p) {
    productIdInput.value = p._id;
    productNameInput.value = p.name || '';
    productPriceInput.value = p.price || '';
    productStockInput.value = p.stock || 0;
    productCategoryInput.value = p.category || '';
    productDescriptionInput.value = p.description || '';
    productTagsInput.value = (p.tags || []).join(', ');
    productSubmitLabel.textContent = 'Mettre à jour le produit';
    productFormMessage.textContent = '';
  }

  function resetProductForm() {
    productIdInput.value = '';
    productNameInput.value = '';
    productPriceInput.value = '';
    productStockInput.value = '';
    productCategoryInput.value = '';
    productDescriptionInput.value = '';
    productTagsInput.value = '';
    productSubmitLabel.textContent = 'Créer le produit';
    productFormMessage.textContent = '';
  }

  productResetBtn?.addEventListener('click', () => {
    resetProductForm();
  });

  productForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: productNameInput.value.trim(),
      price: parseFloat(productPriceInput.value),
      stock: parseInt(productStockInput.value, 10),
      category: productCategoryInput.value.trim() || undefined,
      description: productDescriptionInput.value.trim() || undefined,
      tags: productTagsInput.value
        ? productTagsInput.value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    const id = productIdInput.value || null;

    try {
      productFormMessage.textContent = 'Enregistrement...';
      if (id) {
        await apiFetch(`/products/${id}`, {
          method: 'PUT',
          body: payload,
          auth: true,
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: payload,
          auth: true,
        });
      }
      productFormMessage.textContent = 'Produit enregistré.';
      productFormMessage.classList.remove('text-rose-400');
      productFormMessage.classList.add('text-emerald-400');
      await loadProducts();
      if (!id) resetProductForm();
    } catch (err) {
      productFormMessage.textContent = err.data?.message || 'Erreur lors de l’enregistrement.';
      productFormMessage.classList.remove('text-emerald-400');
      productFormMessage.classList.add('text-rose-400');
    }
  });

  async function deleteProduct(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await apiFetch(`/products/${id}`, {
        method: 'DELETE',
        auth: true,
      });
      await loadProducts();
    } catch (err) {
      alert(err.data?.message || 'Erreur lors de la suppression.');
    }
  }

  // Commandes

  async function loadOrders() {
    try {
      const orders = await apiFetch('/orders', { auth: true });
      renderOrders(orders);
    } catch (err) {
      console.error(err);
      ordersBody.innerHTML =
        '<tr><td colspan="5" class="py-2 text-rose-400">Erreur lors du chargement des commandes.</td></tr>';
    }
  }

  function renderOrders(orders) {
    ordersBody.innerHTML = '';
    ordersCountEl.textContent = `${orders.length} commande(s)`;

    orders.forEach((o) => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-slate-800';

      const tdClient = document.createElement('td');
      tdClient.className = 'py-1 pr-2';
      tdClient.textContent = o.user?.email || o.userEmail || 'N/A';

      const tdTotal = document.createElement('td');
      tdTotal.className = 'py-1 pr-2';
      tdTotal.textContent = `${o.total.toFixed(2)} €`;

      const tdStatus = document.createElement('td');
      tdStatus.className = 'py-1 pr-2';
      tdStatus.textContent = o.status;

      const tdDate = document.createElement('td');
      tdDate.className = 'py-1 pr-2';
      const d = new Date(o.createdAt);
      tdDate.textContent = d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const tdActions = document.createElement('td');
      tdActions.className = 'py-1 pr-2';

      const select = document.createElement('select');
      select.className =
        'bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px]';
      ['pending', 'paid', 'shipped', 'cancelled'].forEach((status) => {
        const opt = document.createElement('option');
        opt.value = status;
        opt.textContent = status;
        if (o.status === status) opt.selected = true;
        select.appendChild(opt);
      });

      select.addEventListener('change', async () => {
        try {
          await apiFetch(`/orders/${o._id}/status`, {
            method: 'PATCH',
            body: { status: select.value },
            auth: true,
          });
        } catch (err) {
          alert(err.data?.message || 'Erreur lors de la mise à jour du statut.');
        }
      });

      tdActions.appendChild(select);

      tr.appendChild(tdClient);
      tr.appendChild(tdTotal);
      tr.appendChild(tdStatus);
      tr.appendChild(tdDate);
      tr.appendChild(tdActions);

      ordersBody.appendChild(tr);
    });
  }

  loadProducts();
  loadOrders();
});
