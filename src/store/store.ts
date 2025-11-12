import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persist products, cart, and theme slices to localStorage on changes
if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      const state = store.getState();
      // Store product images separately to avoid quota issues
      const productImages: { [key: number]: string } = {};
      const productsToPersist = state.products.products.map((product) => {
        if (product.image) {
          productImages[product.id] = product.image;
        }
        return {
          ...product,
          image: undefined, // Remove image from main state
        };
      });

      const toPersist = {
        products: productsToPersist,
        searchQuery: state.products.searchQuery,
      };
      localStorage.setItem("productsState", JSON.stringify(toPersist));
      localStorage.setItem("productImages", JSON.stringify(productImages));

      const cartPersist = { items: state.cart.items };
      localStorage.setItem("cartState", JSON.stringify(cartPersist));
      localStorage.setItem("theme", state.theme.theme);
    } catch (e) {
      // best-effort persistence; ignore quota or serialization errors
      console.warn("Failed to persist state to localStorage:", e);
    }
  });
}
