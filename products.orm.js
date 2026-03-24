const randomDelay = (min = 100, max = 500) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const waitRandomDelay = () => {
  const delay = randomDelay();
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

class Products {
  constructor(defaultData) {
    this.products = defaultData || [];
    this.lastId = this._computeLastId();
  }

  _computeLastId() {
    if (this.products.length === 0) return 0;
    return Math.max(...this.products.map((p) => p.id));
  }

  create = async (data) => {
    await waitRandomDelay();

    const id = ++this.lastId;

    const newProduct = {
      id,
      name: data.name,
      price: data.price,
      stock: data.stock ?? 0,
      createdAt: new Date(), // createdAt généré automatiquement
    };

    this.products.push(newProduct);
    return newProduct;
  };

  getAll = async () => {
    await waitRandomDelay();
    return this.products;
  };

  getById = async (id) => {
    await waitRandomDelay();
    return this.products.find((product) => product.id === +id) || null;
  };

  update = async (id, data) => {
    await waitRandomDelay();

    const index = this.products.findIndex((product) => product.id === +id);
    if (index === -1) return null;

    const updated = {
      ...this.products[index],
      ...data,
      id: this.products[index].id, // on ne modifie jamais l'id
    };

    this.products[index] = updated;
    return updated;
  };

  delete = async (id) => {
    await waitRandomDelay();

    const index = this.products.findIndex((product) => product.id === +id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  };
}

// Données statiques de départ
const defaultProducts = [
  {
    id: 1,
    name: "Clavier mécanique RGB",
    price: 89.99,
    stock: 10,
    createdAt: new Date("2026-01-10T09:15:00Z"),
  },
  {
    id: 2,
    name: "Souris gaming sans fil",
    price: 59.9,
    stock: 25,
    createdAt: new Date("2026-01-12T14:30:00Z"),
  },
  {
    id: 3,
    name: "Écran 27 pouces 144Hz",
    price: 249.0,
    stock: 5,
    createdAt: new Date("2026-01-15T18:45:00Z"),
  },
  {
    id: 4,
    name: "Casque audio surround",
    price: 129.5,
    stock: 15,
    createdAt: new Date("2026-01-20T11:05:00Z"),
  },
  {
    id: 5,
    name: "Microphone USB studio",
    price: 99.0,
    stock: 8,
    createdAt: new Date("2026-01-25T20:10:00Z"),
  },
];

const Product = new Products(defaultProducts);

module.exports = { Product };