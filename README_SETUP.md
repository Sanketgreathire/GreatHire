# GreatHire - Setup & Running Guide

## 1. Installation

From the project root directory, simply run:

```bash
npm install
```

> **Automated Setup**: Running `npm install` in the root automatically runs `npm install` inside both `BackEnd/` and `frontend/` directories via the `postinstall` hook. All dependencies ("all nodes") will be downloaded across the entire project.

---

## 2. Environment Setup

Environment template files are provided:

1. **BackEnd**:
   Copy `BackEnd/.env.example` to `BackEnd/.env`:
   ```bash
   cp BackEnd/.env.example BackEnd/.env
   # On Windows PowerShell:
   Copy-Item BackEnd/.env.example BackEnd/.env
   ```

2. **Frontend**:
   Copy `frontend/.env.example` to `frontend/.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   # On Windows PowerShell:
   Copy-Item frontend/.env.example frontend/.env
   ```

3. **Google Service Account**:
   Ensure `BackEnd/config/google-service-account.json` is present with valid Google Cloud credentials having editor access to your Google Spreadsheet.

---

## 3. Running the Project

Start the **Backend**:
```bash
cd BackEnd
npm run dev
```

Start the **Frontend**:
```bash
cd frontend
npm run dev
```

Visit the website at `http://localhost:5173`.

---

## 4. Google Sheets Automation & Verification

To verify that the Google Sheets automation is working and sync all applications:

```bash
npm run test:sheet
```
*(Can be executed from root, BackEnd, or frontend).*
