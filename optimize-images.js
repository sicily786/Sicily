const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, 'public');

const TARGET_IMAGES = [
  '02.09.23.jpg',
  '37-5.jpg',
  '38-7.jpg',
  '47-3.jpg',
  '49.jpg',
  '51-2.jpg',
  '55-3.jpg'
];

async function optimize() {
  console.log('Starting image optimization process...');
  
  for (const filename of TARGET_IMAGES) {
    const filePath = path.join(PUBLIC_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found, skipping: ${filename}`);
      continue;
    }
    
    const statsBefore = fs.statSync(filePath);
    const sizeBeforeKb = (statsBefore.size / 1024).toFixed(1);
    
    // Read the file buffer
    const buffer = fs.readFileSync(filePath);
    
    // Process with sharp: resize to max 800px width/height (keeping aspect ratio) and set 80% quality
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: 800,
        height: 800,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
      
    // Write optimized buffer back to file
    fs.writeFileSync(filePath, optimizedBuffer);
    
    const statsAfter = fs.statSync(filePath);
    const sizeAfterKb = (statsAfter.size / 1024).toFixed(1);
    const reductionPercent = ((1 - statsAfter.size / statsBefore.size) * 100).toFixed(0);
    
    console.log(`Optimized ${filename}: ${sizeBeforeKb} KB -> ${sizeAfterKb} KB (Reduced by ${reductionPercent}%)`);
  }
  
  console.log('Image optimization finished successfully!');
}

optimize().catch(err => {
  console.error('Error during image optimization:', err);
});
