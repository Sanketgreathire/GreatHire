const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const images = [
  '3320008.jpg',
  'innovation-bg.png',
  'digital_bg.jpg',
  'technology-solutions_bg.jpg',
  'feature_article.png',
  'vector.png',
  '19276.jpg',
  'Resume_bg.png',
  'Interview_bg.png',
  'future_of_work.png',
  'trendingz-topic_02.png',
  '971.jpg',
  'networking_bg.png',
  'Mastering_remote_work.png',
  'AI_recruitment.jpg',
  'Industry_work.png',
  'future_of_work.png',
  'trendingz_topic_03.png',
  'ATS_bg.png',
  'Keyword_bg.png',
  'HR_Insight_02.png',
  'HR_Insight_03.png',
  'interview_tips_01.png',
  'interview_tips_02.png',
  'interview_tips_03.png',
  'company_insight_01.png',
  'company_insight_02.png',
  'company_insight_03.png',
  'video-thumbnail.jpg'
];

async function optimizeImage(filename) {
  const inputPath = path.join(PUBLIC_DIR, filename);
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const webpPath = path.join(PUBLIC_DIR, `${name}.webp`);

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(webpPath);
    
    console.log(`✅ Created: ${name}.webp`);
  } catch (error) {
    console.error(`❌ Failed: ${filename}`, error.message);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  for (const img of images) {
    await optimizeImage(img);
  }
  
  console.log('\n✅ Done! Now update image paths to .webp in your code.');
}

main();