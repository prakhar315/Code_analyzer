/**
 * Deployment Verification Script
 * Run this to verify all files are ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment readiness...\n');

// Check required files
const requiredFiles = [
    'frontend/index.html',
    'frontend/style.css',
    'frontend/script.js',
    'frontend/c-analyzer.js',
    'vercel.json',
    'package.json',
    'README.md'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

// Check vercel.json configuration
console.log('\n🔧 Checking Vercel configuration...');
try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    if (vercelConfig.routes) {
        console.log('❌ vercel.json contains "routes" which conflicts with "rewrites"');
        allFilesExist = false;
    } else {
        console.log('✅ vercel.json configuration is valid');
    }
    
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
        console.log('✅ Rewrites configuration found');
    } else {
        console.log('❌ No rewrites configuration found');
        allFilesExist = false;
    }
    
} catch (error) {
    console.log('❌ Error reading vercel.json:', error.message);
    allFilesExist = false;
}

// Check HTML meta tags
console.log('\n📄 Checking HTML optimization...');
try {
    const htmlContent = fs.readFileSync('frontend/index.html', 'utf8');
    
    const checks = [
        { name: 'Meta description', pattern: /<meta name="description"/ },
        { name: 'Open Graph tags', pattern: /<meta property="og:/ },
        { name: 'Viewport meta', pattern: /<meta name="viewport"/ },
        { name: 'Preload resources', pattern: /<link rel="preload"/ }
    ];
    
    checks.forEach(check => {
        if (check.pattern.test(htmlContent)) {
            console.log(`✅ ${check.name}`);
        } else {
            console.log(`⚠️  ${check.name} - Missing (optional)`);
        }
    });
    
} catch (error) {
    console.log('❌ Error reading HTML file:', error.message);
    allFilesExist = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🎉 DEPLOYMENT READY!');
    console.log('✅ All required files are present');
    console.log('✅ Configuration is valid');
    console.log('\n🚀 Ready to deploy to Vercel!');
    console.log('Run: npx vercel --prod');
} else {
    console.log('❌ DEPLOYMENT NOT READY');
    console.log('Please fix the issues above before deploying.');
}
console.log('='.repeat(50));
