# SWAPI Character Explorer

A lightweight Angular 21 application for browsing and filtering Star Wars characters using the [SWAPI](https://swapi.dev/) REST API. Built with a focus on modern Angular features and performance.

## 🚀 Live Demo
[Link to your Vercel deployment will go here]

## 🛠 Tech Stack & Architecture
- **Framework:** Angular 21.2 (Standalone Components, Signals)
- **UI & Styles:** Angular Material + SCSS
- **State Management:** Signal-based reactive state with URL synchronization
- **Testing:** Vitest
- **Linting:** ESLint + Prettier

## ✨ Key Features
- **Server-side Search:** Real-time character search via API `?search=` parameter.
- **Client-side Filtering:** Gender filtering implemented on top of the current dataset.
- **URL Sync:** All filters, search queries, and pagination states are persisted in the URL.
- **Optimization:** Intelligent caching for `Homeworld` data to reduce redundant API calls.
- **Responsive UI:** Material-based layout optimized for both desktop and mobile.

## 📦 Getting Started

### Prerequisites
- Node.js v22.x (LTS recommended)
- Angular CLI `^21.2.1`

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>

2. Install dependencies:
    ```bash
    npm install

### Development
Run ng serve for a dev server. Navigate to http://localhost:4200/.

### Build
Run ng build to generate a production-ready bundle in the dist/ directory.

### Testing
Run ng test to execute unit tests via Vitest.

### Key Features & Architectural Decisions
- URL-Driven State: The application implements a "Single Source of Truth" pattern where the browser URL is the primary state holder. Navigating back/forward in the browser works out of the box.
- Optimized Data Fetching: - Smart Caching: SwapiService uses a local Map to cache planet data, preventing redundant API calls for characters sharing the same homeworld.
- Race Condition Protection: Used switchMap in the data pipeline to cancel previous pending requests when a new search or page change occurs.
- Modern Reactivity: Leverages Angular Signals for UI state management, resulting in fine-grained updates and improved performance via OnPush change detection.
- Advanced UI/UX: - Real-time search with debounceTime(300) to avoid API spamming.
- Responsive Material Table with horizontal scroll for mobile users.
- European date formatting (en-GB) for better readability.