import http from 'http';
import fs from 'fs';

http.get('http://localhost:5177/api/products', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('db_products.json', data);
        console.log("Done fetching products.");
    });
}).on('error', (e) => {
    console.log("Error fetching: ", e.message);
});
