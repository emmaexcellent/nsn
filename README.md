# Newton Scholarship Nexus

Scholarship discovery platform built with Next.js 15 and Appwrite. It includes:

- Public scholarship discovery and detail pages
- Student authentication, profile management, saves, and application tracking
- Blog/resources publishing
- Admin dashboard for scholarship and blog management

## Stack

- Next.js App Router
- React 19
- Tailwind CSS
- Appwrite

## Production Notes

The app routes privileged writes and admin reads through server-side handlers in `app/api/**`.

- Admin CRUD uses server-side Appwrite API-key access
- Admin routes verify the caller through an Appwrite JWT and require `profile.role === "admin"`
- Student save/apply actions are created server-side with user-scoped Appwrite document permissions
- Public scholarship/blog documents are created with public read permissions

## Required Environment Variables

Create a local `.env` from `.env.example` and provide real values:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_ID=
APPWRITE_DATABASE_NAME=
APPWRITE_API_KEY=
APPWRITE_BUCKET_ID=
APPWRITE_BUCKET_NAME=
```

`APPWRITE_API_KEY` must be a server-side key with access to the required Appwrite database and storage resources. Do not expose it to the browser.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npx next typegen
npx tsc --noEmit
npm run lint
npm run build
```

## Bootstrap Appwrite Resources

Create the Appwrite project first in the Appwrite console, then set the project-scoped environment variables and run:

```bash
npm run appwrite:bootstrap
```

The bootstrap script will provision:

- Database: `NEXT_PUBLIC_DATABASE_ID`
- Bucket: `APPWRITE_BUCKET_ID`
- Collections: `profile`, `scholarships`, `blogs`, `saved_scholarships`
- Attributes and indexes for each collection

The bootstrap script is idempotent and skips resources that already exist.

## Appwrite Setup Expectations

- `profile` collection: user profile documents, including `role`
- `scholarships` collection: public scholarship documents
- `blogs` collection: public blog/resource documents
- `saved_scholarships` collection: user-specific save/apply records
- Storage bucket for scholarship/blog images

## Security Model

- Browser clients should not perform admin CRUD directly against Appwrite
- Admin operations should go through `/api/admin/*`
- Student save/apply actions should go through `/api/user/*`
- Appwrite collection permissions should be tightened so public clients cannot mutate admin-managed collections directly

## Deployment Checklist

1. Set all environment variables in the hosting environment.
2. Add an Appwrite API key as `APPWRITE_API_KEY`.
3. Run `npm run appwrite:bootstrap` if you want the local script to provision schema resources, or create them directly in Appwrite Cloud yourself.
4. Confirm at least one profile document has `role: "admin"`.
5. Verify Appwrite collection permissions match the server-route model.
6. Run `npx next typegen`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` before deploy.
