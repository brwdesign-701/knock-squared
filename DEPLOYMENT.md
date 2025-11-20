# Knock² Deployment Guide

## Deploy to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Push to Git Repository

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Knock² app"
```

2. Create a new repository on GitHub/GitLab/Bitbucket

3. Push your code:
```bash
git remote add origin <your-repository-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add the following variables from your `.env` file:
     - `VITE_SUPABASE_URL` = (your Supabase project URL)
     - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)

6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables when asked

### Step 3: Configure Environment Variables

After deployment, if you need to add or update environment variables:

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add/update:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy the project

### Step 4: Test the Deployment

Once deployed, Vercel will provide you with a URL (e.g., `your-app.vercel.app`)

#### Complete Test Flow:

1. **Sign Up as a Company**
   - Navigate to `/signup`
   - Enter company name, email, phone, and password
   - Click "Create Account"
   - You'll be redirected to the dashboard

2. **Try Demo Mode** (Optional)
   - Click "Try Demo Mode" button on empty dashboard
   - Three sample technicians will be added automatically
   - OR manually add a technician:

3. **Add a Technician** (Manual)
   - Click "Add Technician" button
   - Fill in technician details:
     - First Name: John
     - Last Name: Smith
     - Title: HVAC Technician
     - Photo URL: (use a profile image URL or leave blank)
     - Bio: Brief description
     - Certifications: EPA Certified, NATE Certified
     - Years of Experience: 10
   - Click "Save"

4. **Share Link**
   - Click the "Share" icon for the technician
   - Choose sharing method:
     - **Copy Link**: Copies direct link to clipboard
     - **Email**: Opens email client with pre-filled message
     - **SMS**: Opens SMS with pre-filled message
   - Share the link with a customer

5. **View as Customer**
   - Open the shared link in a new browser/incognito window
   - View the technician's public profile
   - Verify all information displays correctly
   - Test on mobile device for responsive design

### Troubleshooting

**Build Fails:**
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Check build logs in Vercel dashboard

**Database Connection Issues:**
- Verify Supabase URL and anon key are correct
- Check that Supabase project is active
- Verify RLS policies allow public read access for customer view

**404 Errors:**
- Ensure `vercel.json` is in the root directory
- Check that rewrites are configured correctly

**Environment Variables Not Working:**
- In Vite, env vars must be prefixed with `VITE_`
- Redeploy after adding/updating env vars

### Custom Domain (Optional)

1. Go to Project Settings → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

### Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

Every push triggers a new deployment with a unique URL.

### Performance Optimization

Consider:
- Enable Vercel Analytics
- Use Vercel Image Optimization for technician photos
- Configure caching headers
- Enable compression

### Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Supabase Documentation: https://supabase.com/docs
