console.clear();
// Étape 1
console.log("Bienvenue dans la boutique en ligne !");
console.log(process.version);

// Étape 2
const shopName = "TechStore"; // string
let itemCount = 0; // number
let isOpen = true; // boolean
let specialOffer = null; // null
let nextDelivery; // undefined
const maxStock = 1000n; // bigint

console.log(shopName); // string
console.log(itemCount); // number
console.log(isOpen); // boolean
console.log(specialOffer); // null
console.log(nextDelivery); // undefined
console.log(maxStock); // bigint

// Étape 3

const product1 = {
  id: 1,
  name: "Clavier mécanique",
  price: 79.99,
  stock: 15,
  category: "Périphériques",
};

const product2 = {
  id: 2,
  name: "Souris gaming",
  price: 49.99,
  stock: 23,
  category: "Electronique",
};

const product3 = {
  id: 3,
  name: "Écran 24 pouces",
  price: 199.99,
  stock: 8,
  category: "Ecrans",
};

const product4 = {
  id: 4,
  name: "Casque audio",
  price: 89.99,
  stock: 12,
  category: "Audio"
};

const products = [product1, product2, product3, product4];

const cart = [];

console.log(products.length);
console.log(products[0]);
@
let totalProducts = 0;

products.forEach((product) => (totalProducts += product.stock));

console.log("Stock total:", totalProducts);

// Étape 4
function checkType(value) {
  console.log("Valeur à vérifier :", value);
  const typeValue =
    value === null ? null : Array.isArray(value) ? "array" : typeof value;
  console.log("Type :", typeValue);

  //   const typeValue = typeof value;
  //   let retValue;

  //   switch (typeValue) {
  //     case "object":
  //       if (Array.isArray(value)) {
  //         retValue = "array";
  //       } else {
  //         retValue = "object";
  //       }
  //       break;
  //     default:
  //       if (value === null) {
  //         retValue = null;
  //       } else {
  //         retValue = typeValue;
  //       }
  //       break;
  //   }

  //   console.log("Type :", retValue);
}

checkType(1234);
checkType("1234");
checkType(product1);
checkType(products);
checkType(null);
checkType(undefined);

// Étape 5

const displayShopInfo = () => {
    let message = "La boutique est ouverte";
    console.log(message, shopName);
}

displayShopInfo();
// console.log(message)

// if (true) {
//     let discount = 10;
// }
// console.log(discount);
//
let ordersQty = 0;


// Étape 6

const calculateTotal = (price, quantity, discount = 0) => {
    let total = price * quantity;

    if (discount) {
        if (discount < 0 || discount > 100) {
            console.error("La réduction renseignée est invalide.");
            return null;
        }

        total -= (total * (discount / 100));
    }

    ordersQty += 1;
    return total;
}

console.log(calculateTotal(79.99, 2));        // 159.98
console.log(calculateTotal(79.99, 2, 10));    // 143.98 (avec 10% de réduction)
console.log(calculateTotal(79.99, 2, 110));

console.log("Commandes passés :", ordersQty);

// const product = products.findIndex((product) => product.name === "Écras");

// console.log("Produit trouvé à l'index :", product)
// console.log(products[2])


// Étape 7

function canAddToCart(product, quantity) {
    return (
        product.stock > 0 &&
        quantity > 0 &&
        quantity <= product.stock
    );
}

console.log(canAddToCart(products[0], 5)); // true
console.log(canAddToCart(products[0], 20)); // false
console.log(canAddToCart(products[0], 0)); // false


// Étape 8

function getShippingCost(total) {
    if (total >= 50) {
        return 0;
    } else if (total >= 20 && total < 50) {
        return 5.99;
    } else {
        return 8.99;
    }
}

console.log(getShippingCost(60)); // 0
console.log(getShippingCost(35)); // 5.99
console.log(getShippingCost(15)); // 8.99


// Étape 12

const addToCart = (product, quantity) => {
if (canAddToCart(product, quantity)) {
console.error ("Le produit n'a pas été ajouté au panier");
return;
product.stock -= quantity;
if
(product.stock < 5) {
console.warn ("Attention, stock faible pour ce produit !");
cart. push({ product, quantity });
};


// Etape 13

function findProductById(id) {
    return products.find(product => product.id === id);
}

function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

function getProductNames() {
    return products.map(product => product.name);
}

function isProductInStock(id) {
    return products.some(product => product.id === id && product.stock > 0);
}

function getTotalStock() {
    return products.reduce((total, product) => tot

// Etap 14

    const customer = {
    firstName: "Layla",
    lastName: "Shabi",
    email: "layla@email.com",
    isVIP: true,
    orders: [],

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};

customer.loyaltyPoints = 0;

console.log("Client :", customer.getFullName());
console.log("Points fidélité :", customer.loyaltyPoints);



// Etape 16

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadProducts() {
    console.log("Chargement des produits...");
    await wait(2000);
    console.log("Produits chargés !");
    return products;
}

function displayCatalog() {
    products.forEach(product => {
        console.log(`[${product.id}] ${product.name} - ${product.price}€ (Stock: ${product.stock})`);
    });
}

async function init() {
    const loadedProducts = await loadProducts();
    console.log(`${loadedProducts.length} produits disponibles`);
    displayCatalog();
}

init();