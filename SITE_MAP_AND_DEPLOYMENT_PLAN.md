# Bill Master Flex – Site Map & Deployment Plan

This document describes the structure of the **Bill Master Flex** codebase and outlines a practical deployment plan.  It collects insights from the project’s source code and documentation to help you understand how the pieces fit together and what steps are needed to run the application in production.

## 1 Site Map

The project is a Vite‐powered React application written in TypeScript.  It uses React Router for page navigation, shadcn‑ui for UI components, and Supabase for authentication and data storage.  The top‑level router is defined in `src/App.tsx`.  Each route corresponds to a page under `src/pages` or a protected resource behind the `AuthProvider` and `ProtectedRoute` components.

### 1.1 Top‑level routes

| Path | Page component | Description |
| --- | --- | --- |
| `/` | `Index.tsx` | Landing page with statistics on projects and clients, calls to action for “Enter Dashboard,” AI Agents and Register.  It fetches project and client counts from Supabase on mount【668914985336285†L10-L24】. |
| `/dashboard` | `Dashboard.tsx` | Main control centre showing widgets such as quick stats, reminders and an AI‑powered insights panel for project analytics【652600788356402†L69-L90】. |
| `/invoices` | `Invoices.tsx` | Manage invoices (create and list).  Includes tables and UI for invoice data (not shown, inferred from file name). |
| `/quotes` | `Quotes.tsx` | Create and manage quotes. |
| `/expenses` | `Expenses.tsx` | Track project expenses. |
| `/tools` | `Tools.tsx` | Access supplementary tools for the business. |
| `/vat` | `VATSettings.tsx` | Configure VAT and tax rates. |
| `/projects` | `Projects.tsx` | List and manage projects.  Likely includes project creation and editing features. |
| `/business-manager` | `BusinessManager.tsx` | Central hub for business operations. |
| `/site-manager` | `SiteManager.tsx` | Manage site‑specific tasks and resources. |
| `/crm` | `CRM.tsx` | Customer relationship management page. |
| `/agents` | `Agents.tsx` | Interface for managing agent accounts. |
| `/advisor` | `Advisor.tsx` | Provides AI‑powered advisory features. |
| `/hr` | `HR.tsx` | Human‑resources dashboard for managing team members. |
| `/security` | `Security.tsx` | Page for viewing and adjusting security settings. |
| `/auth-configuration` | `AuthConfiguration.tsx` | Configure authentication providers and settings. |
| `/settings` | `Settings.tsx` | General application settings page. |
| `/setup` | `Setup.tsx` | Onboarding page after sign‑up to create a company and initial membership. |
| `/auth` | `Auth.tsx` | Handles sign‑in, sign‑up, forgot password and OAuth callback flows. |
| `/register` | `Register.tsx` | Separate registration page (may be an alias to `Auth.tsx`). |
| `/reset-password` | `ResetPassword.tsx` | Password reset form. |
| `/policy` | `Policy.tsx` | Privacy policy page. |
| `/terms` | `Terms.tsx` | Terms and conditions page. |
| `*` | `NotFound.tsx` | Fallback 404 page. |

Most authenticated routes (e.g. dashboard, invoices, projects, CRM, etc.) are wrapped in a `ProtectedRoute` that checks user session state via Supabase before rendering.  The `SidebarProvider` and `AppSidebar` components wrap these routes to provide a consistent left‑hand navigation UI.

### 1.2 Important components

* **AuthProvider** – Provides context with `signIn`, `signUp` and `signInWithOAuth` methods; handles session state with Supabase.
* **Auth.tsx** – Contains the sign‑in, sign‑up and forgot password forms.  It uses local `useState` hooks to manage form data, performs client‑side validation (e.g. password strength, name fields) and shows toast messages for errors.  It triggers Supabase’s auth methods to register or authenticate users.  Recent changes introduced invite‑only sign‑up and Google OAuth support via `supabase.auth.signInWithOAuth({ provider: 'google' })` (pending UI integration).
* **Setup.tsx** – Called after successful sign‑up to set up the user’s company.  It likely calls the `setup_user_company` RPC (defined in Supabase) to create a company row and membership.
* **EnhancedSecurityManager** – Displays banners about password strength and pending email confirmations to ensure security.
* **Various UI components** – Buttons, forms, modals and tables from shadcn‑ui; custom components like `QuickStatsGrid` and `EnhancedDashboardGrid` used in Dashboard.  They provide a polished user experience.
* **Supabase migrations** – The `supabase/migrations/` directory contains SQL migrations that set up tables such as `companies`, `company_members`, `user_consents` and `company_invites`, along with row‑level security policies and RPC functions.  Recent migrations add indexes to improve query performance.  These are required to be applied to your Supabase project before production deployment.

## 2 Deployment plan

### 2.1 Build and environment variables

This project uses Vite for bundling and Tailwind for styling.  To build the production bundle run `npm run build` which outputs static files to the `dist/` directory.  According to the deployment guide, the build command is `npm run build` and the output directory is `dist`【191951035086624†L80-L83】.  The stack uses Node 20 by default【191951035086624†L67-L67】.

The following environment variables must be configured at build time (prefixed with `VITE_` so they are exposed to the client):

* `VITE_SUPABASE_URL` – Your Supabase project URL.
* `VITE_SUPABASE_PUBLISHABLE_KEY` – The Supabase anon key for public access.
* `VITE_RESEND_API_KEY` – API key for Resend email service (optional)【150669575408540†L38-L45】.
* `VITE_SIGNUP_INVITE_ONLY` – Set to `true` to enforce invite‑only sign‑up; otherwise `false`.

Additional secret environment variables (service role keys, Google OAuth client secret, etc.) should **never** be exposed in the client; store them in your deployment platform’s secret manager and use Supabase dashboard for server‑side operations.

### 2.2 Apply database migrations

Before deploying, you must apply all SQL migrations in the `supabase/migrations` directory to your Supabase project.  These migrations create the core schema (companies, users, invoices, etc.), row‑level security policies and RPC helpers.  Later migrations add `user_consents` and `company_invites` tables for tracking terms acceptance and invite codes.  A performance migration creates indexes on `company_invites.company_id` and `user_consents.policy` for efficient queries.

To apply migrations:

1. Log into the Supabase dashboard for your project.
2. Open **SQL Editor**.
3. For each migration file (ordered by timestamp) paste the SQL contents and run it.  Alternatively, use the Supabase CLI (`supabase db push`) if your environment is configured.
4. Confirm that tables `companies`, `company_members`, `user_consents`, `company_invites` and their related policies exist.

### 2.3 Authentication configuration

The project uses Supabase Auth.  You must:

1. Enable **Email/Password** provider and require email confirmation.
2. Enable **Google** provider under **Authentication → Providers** and supply your Google OAuth Client ID and Client Secret.  Set the redirect URLs to `https://your-domain.com/auth/callback` and `http://localhost:5173/auth/callback` for development.
3. If `VITE_SIGNUP_INVITE_ONLY=true`, ensure you create invite codes by inserting rows into `company_invites` with `company_id`, `code` and `expires_at` values.  The `redeem_company_invite()` RPC is used to validate and consume these codes.
4. Consider enabling multi‑factor authentication (MFA) in the Supabase dashboard for enhanced security.

### 2.4 Hosting options

The `DEPLOYMENT.md` file outlines several hosting providers.  Here is a condensed plan:

1. **Vercel** – Recommended for React/Vite apps.  Connect your GitHub repo in the Vercel dashboard.  Vercel will auto‑detect the framework and build settings (Vite)【191951035086624†L72-L83】.  Set environment variables under Project → Settings → Environment Variables.  For custom domains, configure them in Vercel.
2. **GitHub Pages** – Free static hosting.  You can enable Pages in repository settings, or use the existing GitHub Actions workflow (`.github/workflows/deploy.yml`) to build and push the `dist/` folder.  Note that GitHub Pages does not support serverless functions; it’s only appropriate if your Supabase back‑end is separate.
3. **Cloudflare Pages** and **Netlify** – Both support Vite builds with similar configuration: build command `npm run build`, output directory `dist`【191951035086624†L47-L50】.  Use their dashboards to connect your GitHub repository and set environment variables.  Cloudflare Pages offers a global CDN; Netlify has a pre‑configured `netlify.toml` in the repo for SPA routing【191951035086624†L69-L70】.
4. **Lovable Platform** – If you prefer no‑config deployment, the repository is associated with the Lovable project.  From the Lovable dashboard you can click Share → Publish to deploy【191951035086624†L14-L19】.  This is the simplest route if you aren’t using custom domains.

### 2.5 Deployment checklist

1. **Clone the repository** and install dependencies:
   ```bash
   git clone https://github.com/adrianstanca1/bill-master-flex.git
   cd bill-master-flex
   npm install
   ```
2. **Set environment variables** locally (e.g. in `.env`) and in your hosting platform (see Section 2.1).
3. **Run and test** locally:
   ```bash
   npm run dev       # starts local dev server
   npm run preview   # serve built files after `npm run build`
   ```
4. **Apply Supabase migrations** (see Section 2.2).
5. **Enable Google OAuth** and configure invite codes if needed (Section 2.3).
6. **Run the build** and confirm the `dist/` folder contains `index.html`, `assets/index-*.js`, `assets/index-*.css`, etc.【191951035086624†L99-L106】.
7. **Deploy** to your chosen hosting provider (Section 2.4).  Ensure environment variables are set and that the build command and output directory match the provider’s configuration.
8. **Verify** the production site: all routes load, assets are served, sign‑in and sign‑up work, Supabase calls succeed, and performance meets expectations.

---

This site map and deployment guide should help you navigate the codebase and launch **Bill Master Flex** successfully.  Feel free to extend this document as the project evolves.