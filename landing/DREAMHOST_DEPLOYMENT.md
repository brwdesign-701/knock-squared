# Deploying Knock² Landing Page to Dreamhost

This guide will help you deploy your Next.js landing page to Dreamhost using your custom domain **knocksquared.com**.

## Prerequisites

- Dreamhost hosting account
- Domain **knocksquared.com** configured in Dreamhost
- FTP/SFTP credentials for your Dreamhost account
- Node.js installed on your local machine (for building)

## Step 1: Build the Static Site

The landing page has been configured to export as static HTML files that work on any hosting provider.

Run the build command:

```bash
cd landing
npm install
npm run build
```

Or use the deployment script:

```bash
cd landing
./deploy.sh
```

This will create an `out` directory with all static files.

## Step 2: Connect to Dreamhost via SFTP

You can use any FTP/SFTP client. Here are some popular options:

- **FileZilla** (Free) - https://filezilla-project.org/
- **Cyberduck** (Free) - https://cyberduck.io/
- **Transmit** (Mac, Paid) - https://panic.com/transmit/

### Connection Details:

- **Protocol**: SFTP (recommended) or FTP
- **Host**: knocksquared.com (or your Dreamhost server hostname)
- **Username**: Your Dreamhost username
- **Password**: Your Dreamhost password
- **Port**: 22 (for SFTP) or 21 (for FTP)

To find your exact credentials:
1. Log into Dreamhost Panel: https://panel.dreamhost.com/
2. Go to **Manage Websites** → **knocksquared.com** → **Manage**
3. Look for SFTP/Shell credentials

## Step 3: Upload Files

1. Connect to your Dreamhost account via SFTP
2. Navigate to the **public_html** directory for **knocksquared.com**
   - Usually: `/home/username/knocksquared.com/`
3. Upload **ALL** contents from the `landing/out/` directory
   - Make sure to include the `_next` folder (contains CSS, JS, and assets)
   - Upload `index.html` (the homepage)
   - Upload all SVG files and other assets

**Important**: Upload the *contents* of the `out` folder, not the `out` folder itself.

Your file structure should look like:
```
knocksquared.com/
├── _next/
│   └── static/
├── index.html
├── 404.html
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

## Step 4: Configure Domain (if not already done)

If you haven't set up knocksquared.com in Dreamhost yet:

1. Log into Dreamhost Panel: https://panel.dreamhost.com/
2. Go to **Manage Domains**
3. Click **Add Domain** or configure existing domain
4. Set **knocksquared.com** to point to your hosting
5. Enable **HTTPS** (free SSL certificate)

DNS propagation can take up to 24 hours, but usually completes within a few hours.

## Step 5: Test Your Site

Visit https://knocksquared.com

Your landing page should now be live!

## Making Edits

To update your site after making changes:

1. Edit the source files in the `landing` directory
2. Run the build: `npm run build` (from the `landing` directory)
3. Upload the new files from `landing/out/` to your Dreamhost server
4. The changes will be live immediately

## Automated Deployment (Optional)

For easier deployments, you can set up automated deployment using:

### Option 1: GitHub Actions + SFTP

Create `.github/workflows/deploy.yml` in your repository root to automatically deploy when you push to GitHub.

### Option 2: Dreamhost Git Deployment

Dreamhost supports Git deployment for some hosting plans. Check if your plan supports it:
1. Panel → **Manage Websites** → **Git Deployment**

## Troubleshooting

### Site shows directory listing instead of homepage
- Make sure `index.html` is in the root of your domain's directory
- Check file permissions (should be 644 for files, 755 for directories)

### CSS/JS not loading
- Ensure the `_next` folder was uploaded completely
- Check browser console for 404 errors
- Verify all file paths are correct

### 404 errors
- Make sure all files from the `out` directory were uploaded
- Check that file names match exactly (case-sensitive)

### Changes not showing
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)
- Wait a few minutes for Dreamhost's cache to clear

## Need Help?

- **Dreamhost Support**: https://panel.dreamhost.com/index.cgi?tree=support.msg
- **Dreamhost Knowledge Base**: https://help.dreamhost.com/

## Site Information

- **Landing Page Source**: `/landing` directory in your repository
- **Build Output**: `/landing/out` directory (generated)
- **Repository**: https://github.com/brwdesign-701/knock-squared
- **Custom Domain**: knocksquared.com
