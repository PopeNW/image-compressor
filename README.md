# Image Compressor App

A modern web application for bulk image compression in your browser, powered by [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression). Easily compress multiple images or entire folders, then download them as a ZIP file—all without uploading your files to a server.

## Features

- 🖼️ Bulk image compression (select multiple images)
- ⚡ Fast, client-side processing—no uploads required
- 📦 Download all compressed images as a single ZIP archive
- 🎨 Responsive interface with light and dark themes
- 🔒 Your images never leave your device
- 🛠️ Built with React, TypeScript, and React Router

## Getting Started

### Requirements

- Node.js 22.22.0 or newer (Docker uses Node.js 24)
- npm

The app uses React Router 8 with React 19, Vite 8, and TypeScript 7. The former React Router
`future.v8_*` behaviors are defaults in v8, so no opt-in flags are needed.

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to use the app.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t image-compressor .

# Run the container
docker run -p 3000:3000 image-compressor
```

### DIY Deployment

After building, deploy the contents of the `build/` directory using your preferred Node hosting solution.

## How It Works

1. **Select Images:** Use the file picker to select one or more images.
2. **Compress:** Click the "Compress" button to process all selected images in your browser.
3. **Download ZIP:** Once compression is complete, download all images as a ZIP archive.

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- [JSZip](https://stuk.github.io/jszip/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

Built with ❤️ using React Router.
