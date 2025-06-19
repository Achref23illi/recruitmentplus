# Candidates Loading Issue - Troubleshooting Guide

## Problem
Getting "Failed to load candidates. Please try again later." error in the candidates page.

## Solutions Applied

### 1. Backend Improvements
- ✅ Enhanced error handling in `getAllCandidates` controller
- ✅ Added debug logging to track API calls
- ✅ Added fallback error responses with empty arrays
- ✅ Improved MongoDB connection with better error handling
- ✅ Added debug endpoints for testing

### 2. Frontend Improvements
- ✅ Enhanced error handling with detailed error messages
- ✅ Added console logging for debugging
- ✅ Added fallback to mock data if API fails
- ✅ Added timeout protection for API calls

### 3. Debug Endpoints Added
- `GET /api/v1/candidates/debug` - Check database connection and candidate count
- `GET /api/v1/candidates/mock` - Returns mock candidate data for testing

## How to Debug

### Step 1: Check Backend Status
1. Start your backend server: `cd backend && npm start`
2. Check console for MongoDB connection status
3. Visit: `http://localhost:5000/api/v1/candidates/debug`
   - Should show MongoDB connection state and candidate count

### Step 2: Test API Endpoints
1. Test debug: `http://localhost:5000/api/v1/candidates/debug`
2. Test mock data: `http://localhost:5000/api/v1/candidates/mock`
3. Test real API: `http://localhost:5000/api/v1/candidates`

### Step 3: Check Environment Variables
Create a `.env` file in the `backend` directory with:
```
MONGODB_URI_ATLAS=mongodb://localhost:27017/recruitment_db
DB_NAME=recruitment_db
PORT=5000
NODE_ENV=development
```

### Step 4: Check Frontend Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Navigate to candidates page
4. Look for detailed error messages and API responses

### Step 5: MongoDB Setup
If you don't have MongoDB running:

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Use connection string: `mongodb://localhost:27017/recruitment_db`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://mongodb.com/atlas
2. Create cluster and get connection string
3. Update `MONGODB_URI_ATLAS` in `.env` file

### Step 6: Add Sample Data
If database is empty, you can use the mock endpoint or add sample data:
```bash
# Use mock endpoint temporarily
curl http://localhost:5000/api/v1/candidates/mock
```

## Expected Console Output

### Backend (when working):
```
Attempting to connect to MongoDB...
✅ mongoose connected successfully
✅ Connected to MongoDB
Database Name: recruitment_db
getAllCandidates called with query: { page: '1', page_size: '50' }
Found 2 candidates out of 2 total
```

### Frontend (when working):
```
Fetching candidates from: http://localhost:5000/api/v1/candidates
API Response: { candidates: [...], total: 2, page: 1, page_size: 50, total_pages: 1 }
Transformed candidates: [...]
```

## Common Issues and Solutions

### Issue 1: MongoDB Connection Failed
**Error**: `mongoose connection failed`
**Solution**: 
- Check if MongoDB is running
- Verify connection string in `.env`
- Ensure database exists

### Issue 2: CORS Error
**Error**: `CORS policy` in browser console
**Solution**: Backend already has CORS enabled, check if backend is running on correct port

### Issue 3: Network Error
**Error**: `Network Error` or `ECONNREFUSED`
**Solution**: 
- Check if backend is running on port 5000
- Verify frontend is using correct API URL
- Check firewall settings

### Issue 4: Empty Response
**Error**: API returns `{ candidates: [], total: 0 }`
**Solution**: 
- Database is empty - use mock endpoint temporarily
- Add sample candidate data
- Check database connection

## Quick Test Commands

```bash
# Check if backend is running
curl http://localhost:5000/

# Test debug endpoint
curl http://localhost:5000/api/v1/candidates/debug

# Test mock data
curl http://localhost:5000/api/v1/candidates/mock

# Test real API
curl http://localhost:5000/api/v1/candidates
```

## Next Steps
1. Start with the debug endpoint to identify the root cause
2. Check MongoDB connection status
3. Use mock data temporarily while fixing database issues
4. Gradually move from mock to real data once connection is stable 