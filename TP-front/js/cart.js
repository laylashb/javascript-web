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

function clearCartData() {
  localStorage.removeItem(CART_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsEl = document.getElementById('cart-items');
  const cartEmptyEl = document.getElementById('cart-empty');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutMessage = document.getElementById('checkout-message');
  const clearCartBtn = document.getElementById('clear-cart');

  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = '';

    if (!cart.length) {
      cartEmptyEl.classList.remove('hidden');

      if (checkoutBtn) checkoutBtn.disabled = true;

      subtotalEl.textContent = '0,00 €';
      totalEl.textContent = '0,00 €';
      return;
    }

    cartEmptyEl.classList.add('hidden');

    let subtotal = 0;

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.className =
        'flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2';

      const infoDiv = document.createElement('div');

      const title = document.createElement('p');
      title.className = 'font-medium';
      title.textContent = item.name;

      const meta = document.createElement('p');
      meta.className = 'text-[11px] text-slate-500';
      meta.textContent = `${item.price.toFixed(2)} € • Qté : ${item.quantity}`;

      infoDiv.appendChild(title);
      infoDiv.appendChild(meta);

      const controls = document.createElement('div');
      controls.className = 'flex items-center gap-2';

      const btnDec = document.createElement('button');
      btnDec.className =
        'inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs';
      btnDec.textContent = '-';

      const btnInc = document.createElement('button');
      btnInc.className =
        'inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs';
      btnInc.textContent = '+';

      const btnRemove = document.createElement('button');
      btnRemove.className = 'text-[11px] text-rose-400 hover:underline';
      btnRemove.textContent = 'Retirer';

      btnDec.addEventListener('click', () => {
        const c = getCart();

        if (c[index].quantity > 1) {
          c[index].quantity -= 1;
        } else {
          c.splice(index, 1);
        }

        saveCart(c);
        renderCart();
      });

      btnInc.addEventListener('click', () => {
        const c = getCart();
        c[index].quantity += 1;
        saveCart(c);
        renderCart();
      });

      btnRemove.addEventListener('click', () => {
        const c = getCart();
        c.splice(index, 1);
        saveCart(c);
        renderCart();
      });

      controls.appendChild(btnDec);
      controls.appendChild(btnInc);
      controls.appendChild(btnRemove);

      li.appendChild(infoDiv);
      li.appendChild(controls);

      cartItemsEl.appendChild(li);

      subtotal += item.price * item.quantity;
    });

    subtotalEl.textContent = `${subtotal.toFixed(2)} €`;
    totalEl.textContent = `${subtotal.toFixed(2)} €`;

    const user = getUser();
    if (checkoutBtn) {
      checkoutBtn.disabled = !user || !cart.length;
    }
  }

  async function checkout() {
    const user = getUser();

    if (!user) {
      checkoutMessage.textContent = 'Veuillez vous connecter avant de passer commande.';
      checkoutMessage.classList.add('text-amber-300');
      return;
    }

    const cart = getCart();
    if (!cart.length) return;

    checkoutMessage.textContent = 'Création de la commande...';
    checkoutMessage.classList.remove('text-rose-400', 'text-emerald-400');

    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: { items },
        auth: true,
      });

      clearCartData();
      renderCart();

      checkoutMessage.textContent = 'Commande créée avec succès ✅';
      checkoutMessage.classList.add('text-emerald-400');

    } catch (err) {
      console.error(err);

      checkoutMessage.textContent =
        err.data?.message || 'Erreur lors de la création de la commande.';
      checkoutMessage.classList.add('text-rose-400');
    }
  }

  clearCartBtn?.addEventListener('click', () => {
    clearCartData();
    renderCart();
  });

  checkoutBtn?.addEventListener('click', checkout);

  renderCart();
});