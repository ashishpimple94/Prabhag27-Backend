# 📤 Postman में Excel File Upload करने का Guide

## ✅ API Endpoint Details

- **URL**: `http://localhost:3000/api/voters/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Field Name**: `file` (बिल्कुल यही नाम होना चाहिए)
- **Max File Size**: 25MB (local development के लिए)

---

## 📋 Postman में Setup करने के Steps

### Step 1: New Request बनाएं
1. Postman खोलें
2. **New** button पर click करें
3. **HTTP Request** select करें

### Step 2: Request Configure करें
1. **Method**: `POST` select करें
2. **URL** field में enter करें:
   ```
   http://localhost:3000/api/voters/upload
   ```

### Step 3: Body Tab में File Upload Setup करें
1. **Body** tab पर click करें
2. **form-data** option select करें
3. **Key** field में: `file` (exactly यही नाम)
4. **Type** dropdown से: **File** select करें
5. **Value** column में **Select Files** button पर click करें
6. अपनी Excel file (.xlsx या .xls) select करें

### Step 4: Send करें
1. **Send** button पर click करें
2. Response देखें

---

## 📝 Important Points

### ✅ Field Name
- **Key name बिल्कुल `file` होना चाहिए**
- `File`, `FILE`, `files` या कोई और नाम काम नहीं करेगा
- Exact: `file` (lowercase)

### ✅ File Format
- **Supported formats**: `.xlsx`, `.xls`
- **Max size**: 25MB (local development)
- File valid Excel format में होनी चाहिए

### ✅ Headers
- Postman automatically `Content-Type: multipart/form-data` set करता है
- Manual headers add करने की जरूरत नहीं है

---

## 📊 Expected Success Response

```json
{
  "success": true,
  "message": "Data uploaded successfully (100 records inserted)",
  "message_mr": "डेटा सफलतापूर्वक अपलोड हो गया (100 रिकॉर्ड्स)",
  "count": 100,
  "totalProcessed": 100,
  "errors": 0,
  "errorDetails": [],
  "sample": [
    {
      "_id": "...",
      "serialNumber": "1",
      "houseNumber": "A-101",
      "name": "John Doe",
      "name_mr": "जॉन डो",
      "gender": "Male",
      "gender_mr": "पुरुष",
      "age": 35,
      "voterIdCard": "ABC123456",
      "mobileNumber": "9876543210"
    }
  ],
  "fieldsInfo": {
    "detectedHeaderRow": 0,
    "totalColumns": 8,
    "columnNames": ["SR_NO", "House_No", "Name_En", "Name_Mr", ...]
  }
}
```

---

## ❌ Common Errors और Solutions

### Error 1: "Please upload an Excel file. Use field name 'file'"
**Solution**: 
- Key name `file` होना चाहिए (exact match)
- Type `File` होना चाहिए, `Text` नहीं

### Error 2: "File too large"
**Solution**: 
- File size 25MB से कम होनी चाहिए
- या `MAX_FILE_SIZE_MB` environment variable बढ़ाएं

### Error 3: "केवल Excel फाइलें (.xlsx, .xls) की अनुमति है"
**Solution**: 
- File `.xlsx` या `.xls` format में होनी चाहिए
- `.csv` या कोई और format काम नहीं करेगा

### Error 4: Connection Error
**Solution**: 
- Server running होना चाहिए: `npm start`
- MongoDB connected होना चाहिए
- Check: `http://localhost:3000/health`

---

## 🧪 Quick Test (cURL)

अगर Postman में issue हो, तो cURL से test करें:

```bash
curl -X POST http://localhost:3000/api/voters/upload \
  -F "file=@/path/to/your/file.xlsx"
```

---

## 📸 Postman Screenshot Guide

### Body Tab Setup:
```
┌─────────────────────────────────────┐
│ Body  Params  Authorization  Headers│
├─────────────────────────────────────┤
│ ○ none  ○ form-data  ○ x-www-form... │
│                                      │
│ Key      │ Type │ Value              │
│ file     │ File │ [Select Files]    │
└─────────────────────────────────────┘
```

### Important:
- Key: `file` (exact)
- Type: `File` (dropdown से)
- Value: Your Excel file

---

## ✅ Checklist

Upload करने से पहले check करें:

- [ ] Server running है (`http://localhost:3000`)
- [ ] MongoDB connected है (`/health` endpoint check करें)
- [ ] Method: `POST` है
- [ ] URL: `http://localhost:3000/api/voters/upload`
- [ ] Body tab में `form-data` selected है
- [ ] Key name: `file` (exact match)
- [ ] Type: `File` है
- [ ] Excel file (.xlsx या .xls) selected है
- [ ] File size < 25MB है

---

## 🚀 Ready to Test!

अब आप Postman में Excel file upload कर सकते हैं!

