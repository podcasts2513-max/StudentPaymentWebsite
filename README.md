# StudentPaymentWebsite

Simple Student Payment frontend that integrates with a Google Sheets backend via a Google Apps Script Web App.

Files:
- `login.html` — Login page for students and admin
- `class.html` — Class dashboard (add payments)
- `admin.html` — Admin dashboard (view all payments)
- `script.js` — API client wrapper and helpers
- `main.css` — Styles

API URL
The app sends POST JSON requests to the Google Apps Script endpoint. The URL used in `script.js` is:

```
https://script.google.com/macros/s/AKfycbxP8mXmXL5Tyxs4Zou5OV7dbD7mmUJhk4ETGBWUBVs9a49qZz97DpaP3x42MoWEiu2n6w/exec
```

Expected API contract (the Apps Script should implement these actions):

- `action: 'login'` — payload: `{ username, pin }`
  - response: `{ success: true, class: 'A' }` or `{ success: false, message: '...' }`
- `action: 'getStudents'` — payload: `{ class: 'A' }` or `{ class: 'ALL' }`
  - response: `{ success: true, students: [ { name, class, amount, mode, date }, ... ] }`
- `action: 'addPayment'` — payload: `{ payment: { name, class, amount, mode, date } }`
  - response: `{ success: true }`

Local testing
1. Open `login.html` in your browser (double-click the file). The site is static and can run from the filesystem.
2. Use the login form to authenticate. You can use the demo button to fill sample admin credentials.
3. After login, the app stores the user class in `localStorage` under the key `spw_class`.

Deploying to Vercel
1. Initialize a Git repository in the folder `StudentPaymentWebsite` if you haven't already.
   ```powershell
   cd path\to\StudentPaymentWebsite
   git init
   git add .
   git commit -m "Initial commit: StudentPaymentWebsite"
   ```
2. Push to GitHub (or GitLab) and connect the repository to Vercel.
   - Create a new repo on GitHub and push the code.
   - Go to https://vercel.com/new and import the repository.
3. On Vercel, configure the project as a static site (defaults work). No build step is required for this plain HTML/CSS/JS site.
4. Deploy. Vercel will provide a URL you can open publicly.

Notes & Security
- This frontend is vanilla JS and for demonstration. It relies on the Apps Script endpoint to enforce authentication and data validation.
- Do NOT store real PINs or secrets in client-side files. For production, implement server-side authentication and secure the API.
- If your Apps Script requires GET requests or different parameter names, update `script.js` accordingly.

Need help?
- If the Apps Script implementation differs from the expected contract above, paste the Apps Script code or its expected request/response shapes and I will adapt `script.js` to match it.
