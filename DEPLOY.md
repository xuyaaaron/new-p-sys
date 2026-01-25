# Deployment Guide

This project is built with Vite. The build output is a static site located in the `dist` folder.

## 1. Build the Project

Run the following command to generate the production build:

```bash
npm run build
```

This will create a `dist` directory containing:
- `index.html`
- `assets/` (JavaScript, CSS, images)

## 2. Environment Variables

This project uses `GEMINI_API_KEY`. Since Vite embeds environment variables at build time, you must ensure this variable is available **during the build process**.

- **Local Build**: Create a `.env.local` file with `GEMINI_API_KEY=your_key_here`.
- **Vercel/Netlify**: Add `GEMINI_API_KEY` in the project settings under "Environment Variables".
- **GitHub Actions**: Add it as a Repository Secret and expose it in the workflow.

## 2. Deploy to Hosting Providers

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts. It should automatically detect Vite.
4. Output directory: `dist`

### Netlify
1. Drag and drop the `dist` folder to Netlify Drop (https://app.netlify.com/drop).
2. Or use Netlify CLI: `netlify deploy --prod` (publish directory: `dist`).

### GitHub Pages
1. Push your code to a GitHub repository.
2. Go to Settings > Pages.
3. Select 'GitHub Actions' as source or configure a workflow to build and deploy the `dist` folder.

### Generic Static Hosting
Upload the contents of the `dist` folder to your web server's public root (e.g., `public_html` or `www`).
