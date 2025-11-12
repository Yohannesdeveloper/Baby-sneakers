export interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: "men" | "women" | "kids";
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5177";

export async function fetchProducts(): Promise<ApiProduct[]> {
  console.log("Fetching products from", `${API_BASE}/api/products`);
  const res = await fetch(`${API_BASE}/api/products`);
  console.log("Fetch response status:", res.status);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  console.log("Fetched products data:", data);
  return data;
}

export async function createProduct(
  body: Omit<ApiProduct, "_id">
): Promise<ApiProduct> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
}

export async function updateProduct(
  id: string,
  body: Omit<ApiProduct, "_id">,
  imageFile?: File
): Promise<ApiProduct> {
  const formData = new FormData();

  // Add all fields to FormData
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Add image file if provided
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}
