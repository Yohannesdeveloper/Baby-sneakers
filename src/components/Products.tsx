import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { addToCart, openCart } from "../store/cartSlice";
import {
  fetchProducts,
  deleteProduct as deleteProductApi,
} from "../api/products";
import {
  setProducts,
  deleteProduct,
  setSearchQuery,
} from "../store/productsSlice";

interface ProductsProps {
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

const Products: React.FC<ProductsProps> = ({ onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state: RootState) => state.products.products);
  const searchQuery = useSelector(
    (state: RootState) => state.products.searchQuery
  );

  console.log("Products component: Redux products state:", products);
  console.log("Products component: Redux products length:", products.length);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [adminMode, setAdminMode] = React.useState(isAdmin);

  // Keep local adminMode in sync with store's isAdmin so we can show/hide admin UI
  React.useEffect(() => {
    setAdminMode(isAdmin);
  }, [isAdmin]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchName, setSearchName] = useState<string>(searchQuery);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [shoeNo, setShoeNo] = useState<string>("");

  useEffect(() => {
    setSearchName(searchQuery);
  }, [searchQuery]);

  // Reset search query when component mounts to show all products by default
  useEffect(() => {
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  useEffect(() => {
    // Always fetch from API first to get real products from database
    (async () => {
      try {
        console.log("Products component: Fetching products from database...");
        const data = await fetchProducts();
        console.log("Products component: Fetched data:", data);
        // Map API _id to id for UI consistency
        const mapped = data.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          image: p.image,
          category: p.category,
          shoeNo: p.shoeNo,
        }));
        console.log("Products component: Mapped products:", mapped);
        // Always set products from database (this replaces any test products)
        dispatch(setProducts(mapped));
      } catch (error) {
        console.error("Products component: Failed to fetch products from API, keeping local data:", error);
        // Do not clear local storage or set empty; keep existing local products for offline support
      }
    })();
  }, [dispatch]);

  // Filtered products
  console.log("Filter values:", {
    selectedCategory,
    searchName,
    minPrice,
    maxPrice,
    shoeNo,
  });
  const filteredProducts = products.filter((product: any) => {
    console.log("Filtering product:", product);
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesName =
      searchName === "" ||
      product.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesMinPrice =
      minPrice === "" || product.price >= parseFloat(minPrice);
    const matchesMaxPrice =
      maxPrice === "" || product.price <= parseFloat(maxPrice);
    const matchesShoeNo =
      shoeNo === "" ||
      (product.shoeNo && product.shoeNo.toString().includes(shoeNo));
    const result =
      matchesCategory &&
      matchesName &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesShoeNo;
    console.log("Product matches filters:", result, {
      matchesCategory,
      matchesName,
      matchesMinPrice,
      matchesMaxPrice,
      matchesShoeNo,
    });
    return result;
  });

  console.log("Filtered products length:", filteredProducts.length);
  console.log("Filtered products:", filteredProducts);

  return (
    <section
      id="products-section"
      className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white text-center">
            Our Products
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Filters
            </h3>
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="">All Categories</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              {/* Name Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search by Name
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter product name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
              {/* Shoe No Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shoe No
                </label>
                <input
                  type="text"
                  value={shoeNo}
                  onChange={(e) => setShoeNo(e.target.value)}
                  placeholder="Enter shoe number..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </aside>
          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No products match your filters. Try adjusting them!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                {filteredProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
                  >
                    {product.image && (
                      <div className="w-full h-60 sm:h-68 bg-white dark:bg-gray-900 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {product.name}
                        </h3>
                        {product.category && (
                          <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-fuchsia-200 to-cyan-200 text-blue-900 dark:from-fuchsia-900 dark:to-cyan-900 dark:text-blue-100">
                            {String(product.category).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 text-xs line-clamp-1">
                        {product.description}
                      </p>
                      {product.shoeNo && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Shoe No: {product.shoeNo}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3">
                          {adminMode && (onEdit || onDelete) && (
                            <>
                              <button
                                onClick={() => {
                                  if (onEdit) {
                                    onEdit(product.id);
                                  } else {
                                    navigate("/add-product", {
                                      state: { editProductId: product.id },
                                    });
                                  }
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded-md transition duration-200 flex items-center justify-center"
                                title="Edit Product"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={async () => {
                                  if (onDelete) {
                                    onDelete(product.id);
                                  } else {
                                    if (
                                      confirm(
                                        "Are you sure you want to delete this product?"
                                      )
                                    ) {
                                      try {
                                        await deleteProductApi(
                                          product.id.toString()
                                        );
                                        dispatch(deleteProduct(product.id));
                                      } catch {
                                        // Fallback to local delete
                                        dispatch(deleteProduct(product.id));
                                      }
                                    }
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md transition duration-200 flex items-center justify-center"
                                title="Delete Product"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                navigate("/auth");
                                return;
                              }
                              dispatch(
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                })
                              );
                              dispatch(openCart());
                            }}
                            className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 text-white font-medium py-1 px-2 rounded-md transition duration-200 flex items-center justify-center"
                            title="Add to Cart"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
