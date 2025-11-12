import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";
import { addProduct, editProduct, deleteProduct, setProducts } from "../store/productsSlice";
import { loginAdmin, clearError } from "../store/authSlice";
import type { Product } from "../store/productsSlice";
import {
  createProduct,
  updateProduct,
  deleteProduct as deleteProductApi,
  fetchProducts,
} from "../api/products";
import Products from "./Products";

const AddProduct: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const products = useSelector((state: RootState) => state.products.products);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const authError = useSelector((state: RootState) => state.auth.error);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [category, setCategory] = useState<"men" | "women" | "kids" | "">("");
  const [shoeNo, setShoeNo] = useState("");
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const [password, setPassword] = useState("");

  const editProductId = location.state?.editProductId;
  const effectiveEditId = editProductId || selectedEditId;
  const isEditing = !!effectiveEditId;

  // Populate form with existing product data when editing
  useEffect(() => {
    if (isEditing && effectiveEditId) {
      const productToEdit = products.find((p) => p.id === effectiveEditId);
      if (productToEdit) {
        setName(productToEdit.name);
        setPrice(productToEdit.price.toString());
        setDescription(productToEdit.description);
        setCategory(productToEdit.category as "men" | "women" | "kids" | "");
        setShoeNo((productToEdit as any).shoeNo || "");
        setImagePreview(productToEdit.image || "");
      }
    } else {
      // Reset form when not editing
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setShoeNo("");
      setImage(null);
      setImagePreview("");
    }
  }, [isEditing, effectiveEditId, products]);

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      setSelectedEditId(selectedId);
    } else {
      setSelectedEditId(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price.trim() || !description.trim() || !category) {
      alert("Please fill in all fields");
      return;
    }

    let imageBase64 = "";
    if (image) {
      // Resize/compress image to reduce storage usage
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const maxSize = 800; // max width/height
            let { width, height } = img;
            if (width > height && width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Use JPEG with quality to reduce size
              const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
              resolve(dataUrl);
            } else {
              resolve(reader.result as string);
            }
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(image);
      });
    }

    const newProduct = {
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      image: imageBase64,
      category,
      shoeNo: shoeNo.trim(),
    } as const;

    if (isEditing) {
      try {
        const updated = await updateProduct(
          effectiveEditId.toString(),
          newProduct,
          image || undefined
        );
        // After successful API update, fetch all products to sync with server
        const allProducts = await fetchProducts();
        const mapped = allProducts.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          image: p.image,
          category: p.category,
          shoeNo: p.shoeNo,
        }));
        dispatch(setProducts(mapped));
        alert("Product updated successfully!");
      } catch (e) {
        console.error("API failed, using local storage:", e);
        // Fallback to local edit if API fails
        const localProduct: Product = {
          id: String(effectiveEditId),
          ...newProduct,
        };
        dispatch(editProduct(localProduct));
        alert("Product updated successfully! (saved locally)");
      }
    } else {
      try {
        console.log("Creating product via API:", newProduct);
        const created = await createProduct(newProduct);
        console.log("Product created via API:", created);
        // After successful API create, fetch all products to sync with server
        const allProducts = await fetchProducts();
        const mapped = allProducts.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          image: p.image,
          category: p.category,
          shoeNo: p.shoeNo,
        }));
        dispatch(setProducts(mapped));
        alert("Product added successfully!");
      } catch (e) {
        console.error("API failed, using local storage:", e);
        // Fallback to local add if API fails
        const localProduct: Product = {
          id: String(Date.now()),
          ...newProduct,
        };
        console.log("Dispatching local addProduct with:", localProduct);
        dispatch(addProduct(localProduct));
        alert("Product added successfully! (saved locally)");
      }
    }

    // Reset form
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setCategory("");
    setShoeNo("");

    navigate("/");
  };

  const handleDelete = async () => {
    if (isEditing && effectiveEditId) {
      if (confirm("Are you sure you want to delete this product?")) {
        try {
          await deleteProductApi(effectiveEditId.toString());
          // After successful API delete, fetch all products to sync with server
          const allProducts = await fetchProducts();
          const mapped = allProducts.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image,
            category: p.category,
            shoeNo: p.shoeNo,
          }));
          dispatch(setProducts(mapped));
          alert("Product deleted successfully!");
          navigate("/");
        } catch (e) {
          // Fallback to local delete
          dispatch(deleteProduct(effectiveEditId));
          alert("Product deleted successfully!");
          navigate("/");
        }
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAdmin(password));
    // Don't clear password immediately - let user see if there's an error
    // Password will be cleared on successful login via useEffect
  };

  // Clear password when admin login succeeds
  useEffect(() => {
    if (isAdmin) {
      setPassword("");
      dispatch(clearError());
    }
  }, [isAdmin, dispatch]);

  // Clear error when user starts typing
  useEffect(() => {
    if (password && authError) {
      dispatch(clearError());
    }
  }, [password, authError, dispatch]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-7">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Admin Login
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter admin password"
                required
              />
            </div>
            {authError && (
              <div className="text-red-500 text-sm text-center">
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Products List Button and Clear Cache */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 text-white font-medium py-2.5 px-6 rounded-md transition-all duration-300"
          >
            {showProducts ? "Hide Products List" : "Show Products List"}
          </button>
          <button
            onClick={() => {
              if (confirm("Clear all local product cache? This will remove test products and sync with database only.")) {
                localStorage.removeItem("productsState");
                localStorage.removeItem("productImages");
                window.location.reload();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-md transition-all duration-300"
          >
            Clear Local Cache
          </button>
        </div>

        {/* Products List */}
        {showProducts && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6">
            <Products
              onEdit={(productId) => {
                setSelectedEditId(productId);
                setShowProducts(false);
              }}
              onDelete={async (productId) => {
                if (confirm("Are you sure you want to delete this product?")) {
                  try {
                    await deleteProductApi(productId.toString());
                    // After successful API delete, fetch all products to sync with server
                    const allProducts = await fetchProducts();
                    const mapped = allProducts.map((p: any) => ({
                      id: p._id || p.id,
                      name: p.name,
                      price: p.price,
                      description: p.description,
                      image: p.image,
                      category: p.category,
                      shoeNo: p.shoeNo,
                    }));
                    dispatch(setProducts(mapped));
                  } catch (e) {
                    // Fallback to local delete
                    dispatch(deleteProduct(productId));
                  }
                }
              }}
            />
          </div>
        )}

        {/* Add/Edit Product Form */}
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
          </div>

          <div className="mb-6">
            <label
              htmlFor="productSelect"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Product to Edit (Optional)
            </label>
            <select
              id="productSelect"
              value={selectedEditId || ""}
              onChange={handleProductSelect}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">-- Select a product to edit --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </span>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="men"
                    checked={category === "men"}
                    onChange={() => setCategory("men")}
                    className="text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-gray-800 dark:text-gray-200">Men</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="women"
                    checked={category === "women"}
                    onChange={() => setCategory("women")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 dark:text-gray-200">
                    Women
                  </span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="kids"
                    checked={category === "kids"}
                    onChange={() => setCategory("kids")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 dark:text-gray-200">Kids</span>
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter product description"
                required
              />
            </div>

            <div>
              <label
                htmlFor="shoeNo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Shoe Number
              </label>
              <input
                type="text"
                id="shoeNo"
                value={shoeNo}
                onChange={(e) => setShoeNo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter shoe number (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-300"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-md transition duration-200"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
