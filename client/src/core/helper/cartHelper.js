export const addItemToCart = (item, next) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    // Exclude photo from the item
    const { photo, ...slimItem } = item;

    cart.push({
      ...slimItem,
      count: 1,
    });

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      if (next) next();
    } catch (error) {
      console.error("Storage quota exceeded:", error);
      alert("Cart is too large. Please remove some items.");
    }
  }
};

export const loadCart = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return []
};

export const removeItemFromCart = (productId) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.forEach((product, i) => {
      if (product._id === productId) {
        cart.splice(i, 1);
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));

    // Reload the page to reflect changes
    window.location.reload(); // Optional: only if you want to reload the page

  }
  return cart;
};

export const cartEmpty = (next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("cart");

    let cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    next();
  }
};
