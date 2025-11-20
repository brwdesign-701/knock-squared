# Simple Deployment Guide - No GitHub Required

## Deploy Knock² to Vercel in 3 Steps

### Step 1: Install Vercel CLI

Open your terminal and run:

```bash
npm install -g vercel
```

This installs the Vercel deployment tool on your computer.

---

### Step 2: Login to Vercel

Run this command:

```bash
vercel login
```

This will:
1. Open your web browser
2. Ask you to sign up or log in to Vercel (it's free!)
3. You can sign up with email, GitHub, GitLab, or Bitbucket

---

### Step 3: Deploy Your App

From your project folder, run:

```bash
vercel
```

The CLI will ask you some questions. Here's what to answer:

1. **"Set up and deploy?"** → Press Enter (Yes)
2. **"Which scope?"** → Choose your username → Press Enter
3. **"Link to existing project?"** → Press `N` (No)
4. **"What's your project's name?"** → Type `knock-squared` → Press Enter
5. **"In which directory is your code located?"** → Press Enter (current directory)
6. **"Want to modify settings?"** → Press `N` (No)

Vercel will automatically:
- Detect it's a Vite project
- Build your app
- Deploy it
- Give you a URL like: `https://knock-squared.vercel.app`

---

### Step 4: Add Environment Variables

After the first deployment, you need to add your Supabase credentials:

```bash
vercel env add VITE_SUPABASE_URL
```

When prompted, paste your Supabase URL and press Enter.

```bash
vercel env add VITE_SUPABASE_ANON_KEY
```

When prompted, paste your Supabase anon key and press Enter.

For both variables, when asked which environments:
- Select: **Production, Preview, and Development** (use arrow keys and space bar)
- Press Enter

---

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

This redeploys with your environment variables. Your app is now live!

---

## Testing Your Deployed App

Once deployed, Vercel gives you a URL. Open it in your browser.

### Complete Test Flow:

**1. Sign Up as a Company**
- Go to your Vercel URL
- Click "Sign up"
- Enter:
  - Company Name: Test Company
  - Email: test@example.com
  - Password: test123456
- Click "Create Account"

**2. Try Demo Mode**
- You'll see an empty dashboard
- Click the **"Try Demo Mode"** button
- 3 sample technicians will be added automatically:
  - Sarah Johnson (HVAC Technician)
  - Michael Chen (Master Plumber)
  - Jessica Martinez (Licensed Electrician)

**3. Share a Technician Link**
- Click the **Share icon** (paper airplane) next to any technician
- A modal will open with sharing options:
  - **Copy Link** - Copies URL to clipboard
  - **Share via Email** - Opens your email client
  - **Share via SMS** - Opens your messaging app
- Copy the link

**4. View as a Customer**
- Open a new **Incognito/Private window** in your browser
- Paste the technician link
- You'll see the beautiful customer-facing profile with:
  - Technician photo
  - Name and title
  - Years of experience
  - Bio
  - Certifications
  - Company branding

**5. Test Mobile View**
- Open the link on your phone
- Verify responsive design works

**6. Clean Up Demo Data** (optional)
- Go back to your dashboard
- Click **"Clear Demo Data"** button
- This removes all demo technicians

---

## Future Deployments

Every time you make changes to your code:

```bash
vercel --prod
```

This will deploy your latest changes.

---

## Finding Your Environment Variables

Your Supabase credentials are in the `.env` file in your project:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
```

---

## Common Issues

**"Command not found: vercel"**
- Run: `npm install -g vercel` again
- Try closing and reopening your terminal

**"Build failed"**
- Make sure you're in the correct project folder
- Run `npm install` first
- Check that `.env` file exists

**"Environment variables not working"**
- Make sure you added them with `vercel env add`
- Redeploy with `vercel --prod` after adding variables
- Variables must start with `VITE_` for Vite apps

**"Page not found after deployment"**
- This is normal, the app should still work
- Try navigating to `/login` or `/signup` directly

---

## Getting Your Vercel URL

After deployment, Vercel shows you the URL in the terminal:

```
✅  Production: https://knock-squared-abc123.vercel.app
```

You can also find it by:
1. Going to https://vercel.com/dashboard
2. Finding your project
3. The URL is shown on the project page

---

## Help

- Vercel CLI Docs: https://vercel.com/docs/cli
- If stuck, run: `vercel --help`
