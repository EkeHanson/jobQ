# JobTrack AI Frontend

This is the React frontend for the JobTrack AI application. It provides an AI-powered job application tracker with dashboards, notifications, and more.

## Technologies

- React 18
- Vite
- TailwindCSS
- Redux Toolkit
- React Router v6
- Axios
- React Hook Form + Zod
- Recharts
- date-fns

## Getting Started

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` and API calls are proxied to whatever
   `VITE_API_URL` points to (default `http://localhost:8000/api/v1`).  Make sure the Django backend
   is running on that URL; see `backend/README.md` for setup.

   > **Tip for testing**: you can bypass authentication entirely by creating a `.env` file in `frontend/` with the
   > variable `VITE_SKIP_AUTH=true` (or prefix `VITE_SKIP_AUTH=true npm run dev`). Vite only exposes vars prefixed
   > with `VITE_`, so the older `REACT_APP_SKIP_AUTH` name will not work unless it's also present for reference.
   > This lets you visit any route without logging in, which is handy for manual UI testing.


3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

See `plan.md` section 8 for detailed structure. Key folders:

```
src/
├── components/        # Reusable UI components
├── pages/             # Page-level components
├── hooks/             # Custom React hooks
├── services/          # API service layer
├── store/             # Redux slices and store
├── utils/             # Helpers, constants, validators
├── routes/            # Routing configuration
├── App.jsx            # Main app entry
├── main.jsx           # ReactDOM render
└── index.css          # Tailwind base styles
```

## Notes

- Authentication flows rely on backend API endpoints described in `plan.md`.
- This frontend is a fully-featured prototype; additional refinements such as error handling, form validation, pagination and real API integration may be added.

Happy hacking! 🎉
