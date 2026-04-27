import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string; // Base64 encoded image string
  category?: "men" | "women" | "kids";
  shoeNo?: string;
}

interface ProductsState {
  products: Product[];
  searchQuery: string;
}

const loadInitialState = (): ProductsState => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("productsState");
      const storedImages = localStorage.getItem("productImages");
      if (stored) {
        const parsed = JSON.parse(stored) as ProductsState;
        const parsedImages = storedImages ? JSON.parse(storedImages) : {};
        if (Array.isArray(parsed.products)) {
          // Validate each product has required fields and restore images
          const validProducts = parsed.products
            .filter(
              (product) =>
                product.id !== undefined &&
                product.name &&
                typeof product.price === "number"
            )
            .map((product) => ({
              ...product,
              image: parsedImages[product.id] || product.image, // Restore image from separate storage
            }));
          return {
            products: validProducts,
            searchQuery: parsed.searchQuery || "",
          };
        }
      }
    }
  } catch (e) {
    // ignore corrupt storage and fall back to defaults
    console.warn("Failed to load products from localStorage:", e);
  }
  return { products: [], searchQuery: "" };
};

const initialState: ProductsState = loadInitialState();

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      console.log("addProduct reducer called with:", action.payload);
      // Ensure ID is a string
      const product = {
        ...action.payload,
        id: String(action.payload.id),
      };
      // Check if product already exists (avoid duplicates)
      const exists = state.products.some((p) => p.id === product.id);
      if (!exists) {
        state.products.push(product);
        console.log("Product added. Total products:", state.products.length);
      } else {
        console.log("Product already exists, skipping add");
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    editProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  addProduct,
  setProducts,
  deleteProduct,
  editProduct,
  setSearchQuery,
} = productsSlice.actions;
export default productsSlice.reducer;
