const fs = require('fs');
const path = require('path');

const processedDir = path.join(process.cwd(), 'data', 'processed');
const uploadsDir = path.join(process.cwd(), 'data', 'uploads');

try {
    const files = fs.readdirSync(processedDir).filter(f => f.endsWith('.json'));

    console.log(`Scanning ${files.length} processed files...`);

    files.forEach(file => {
        const filePath = path.join(processedDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        let hasUnknown = false;
        let unknownCount = 0;

        if (Array.isArray(content)) {
            content.forEach(review => {
                if (!review.product_name) {
                    hasUnknown = true;
                    unknownCount++;
                }
            });
        }

        if (hasUnknown) {
            console.log(`[UNKNOWN] ${file}: ${unknownCount} reviews missing product_name`);

            // Delete processed file
            fs.unlinkSync(filePath);
            console.log(`   -> Deleted processed file: ${file}`);

            // Delete matching upload file
            const uploadPath = path.join(uploadsDir, file);
            if (fs.existsSync(uploadPath)) {
                fs.unlinkSync(uploadPath);
                console.log(`   -> Deleted upload file: ${file}`);
            }
        }
    });

} catch (error) {
    console.error("Error scanning files:", error);
}
