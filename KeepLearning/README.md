# keepLearning Frontend Application

This directory contains the React.js + Vite client for **keepLearning — AI-Powered Revision Plans: Knowledge Drift Prediction & Personalized Learning System**.

For the complete project documentation, system architecture, mathematical formulations, and backend guides, refer to the [Main Project README](../README.md).

## Quick Start (Frontend):
```bash
npm install
npm run dev
```
Runs the Vite development server at `http://localhost:5173`.

## Production Build & Lint:
```bash
npm run build
npm run lint
```
Bundle will be compiled into the `dist/` directory.

## Backend Connection:
By default, the frontend connects to the backend API at `http://localhost:8000/api`. You can configure a custom API endpoint in `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```
