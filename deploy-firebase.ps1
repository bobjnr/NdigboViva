# Firebase Deployment Script for Identity Documents Feature
# Run this script to deploy Firebase Storage and Firestore rules

Write-Host "🚀 Deploying Firebase Configuration for Identity Documents Upload..." -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
Write-Host "Checking Firebase CLI installation..." -ForegroundColor Yellow
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue

if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it with: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Firebase CLI is installed" -ForegroundColor Green
Write-Host ""

# Check if user is logged in
Write-Host "Checking Firebase authentication..." -ForegroundColor Yellow
firebase projects:list 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Firebase" -ForegroundColor Red
    Write-Host "Running: firebase login" -ForegroundColor Yellow
    firebase login
}

Write-Host "✅ Authenticated with Firebase" -ForegroundColor Green
Write-Host ""

# Deploy Storage rules
Write-Host "📦 Deploying Firebase Storage rules..." -ForegroundColor Cyan
firebase deploy --only storage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Storage rules deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy Storage rules" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Deploy Firestore rules
Write-Host "📦 Deploying Firestore rules..." -ForegroundColor Cyan
firebase deploy --only firestore:rules

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Firestore rules deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy Firestore rules" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the upload feature in your development environment" -ForegroundColor White
Write-Host "2. Check Firebase Console → Storage to verify uploads" -ForegroundColor White
Write-Host "3. Monitor the 'identity-documents' folder for test files" -ForegroundColor White
Write-Host ""
Write-Host "Firebase Console: https://console.firebase.google.com/project/great-igbo-ancestry-project" -ForegroundColor Blue
