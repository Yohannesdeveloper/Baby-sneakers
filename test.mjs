import fs from 'fs';
import path from 'path';

async function test() {
    try {
        const API_BASE = "http://localhost:5177";

        // 1. Create a dummy image file
        fs.writeFileSync('dummy.jpg', 'fake image content');

        // 2. We can't easily use FormData object natively in plain raw Node without some imports
        // so let's just make a manual multipart request to test the backend.

        // Using native node fetch with FormData requires node 18+ FormData, let's try it:
        const blob = new Blob(['fake image content'], { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('name', 'Test Product');
        formData.append('price', '99.99');
        formData.append('description', 'A true test');
        formData.append('category', 'men');
        formData.append('shoeNo', '42');
        formData.append('image', blob, 'dummy.jpg');

        console.log("Attempting POST...");
        const postRes = await fetch(`${API_BASE}/api/products`, {
            method: "POST",
            body: formData
        });

        console.log("POST Status:", postRes.status);
        const postData = await postRes.text();
        console.log("POST Response:", postData);

        // 3. Fetch products to verify image field
        console.log("\nAttempting GET...");
        const getRes = await fetch(`${API_BASE}/api/products`);
        const getData = await getRes.json();
        console.log("GET Products Count:", getData.length);
        console.log("Latest Product:", getData[0]);

    } catch (err) {
        console.error("Test Error:", err);
    }
}
test();
