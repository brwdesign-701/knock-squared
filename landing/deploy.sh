#!/bin/bash

echo "Building static site for Dreamhost..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "Static files are ready in the 'out' directory."
echo "Upload the contents of the 'out' folder to your Dreamhost public_html directory."
echo ""
echo "Next steps:"
echo "1. Connect to Dreamhost via FTP/SFTP"
echo "2. Navigate to the public_html folder for knocksquared.com"
echo "3. Upload all files from the 'out' directory"
echo "4. Your site will be live at https://knocksquared.com"
