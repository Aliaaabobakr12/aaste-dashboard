
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'response_1769667616169.json');

try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    const unknownProducts = data.filter(item => !item.product_name);

    if (unknownProducts.length === 0) {
        console.log("No unknown products found. All items have a 'product_name'.");
    } else {
        console.log(`Found ${unknownProducts.length} items without 'product_name':`);
        unknownProducts.forEach((item, index) => {
            console.log(`Index ${index}:`, JSON.stringify(item, null, 2));
        });
    }
} catch (error) {
    console.error("Error reading or parsing file:", error);
}
