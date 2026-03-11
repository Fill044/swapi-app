# SWAPI Character Explorer

A lightweight, high-performance Angular 21 application for browsing the Star Wars universe using the [SWAPI](https://swapi.dev/) REST API. This project demonstrates modern frontend engineering patterns, focusing on reactivity, performance, and professional UX.

## 🚀 Project Evolution & Live Demo
To showcase a commitment to both core requirements and extended UX/UI polish, the project is presented in two stages:

* **[Production Version (Latest)](https://swapi-app-prod.vercel.app/)** — **Recommended for review.** Features a full "Galactic" UX, Dark/Light mode, Species caching, Person details overlay, and advanced mobile optimizations.
* **[Legacy MVP Version](https://swapi-app-prod-oxqmjbfin-philipmihalevich-6632s-projects.vercel.app/people?page=1)** — The initial stable version focused strictly on core technical requirements (API, Filtering, Pagination).

## 🛠 Tech Stack & Architecture
- **Framework:** Angular 21.2 (Standalone Components, Signals)
- **UI & Styles:** Angular Material 3 + SCSS (Theme variables & MDC Overrides)
- **State Management:** Signal-based reactive state with URL synchronization
- **Testing:** Vitest (Unit & Integration)
- **Linting:** ESLint + Prettier



## ✨ Key Features
- **Server-side Search:** Real-time search using API `?search=` parameter with `debounceTime`.
- **Client-side Filtering:** Gender filtering implemented with reactive Signals for instant UI updates.
- **URL Synchronization:** All filters, search queries, and pagination states are persisted in the URL as a "Single Source of Truth".
- **Galactic UI/UX:** Dark/Light theme persistence, Skeleton loaders, and staggered animations for a premium feel.
- **Mobile First:** Material-based layout with an independent table scroll and fixed paginator for superior mobile usability.
- **Micro-UX Polish:** Character details overlay, custom thin scrollbars, and keyboard shortcuts (Ctrl+F).

## 🌟 Enhancements
- **Reactive Pipeline:** Robust data flow using RxJS `switchMap` to handle race conditions and `distinctUntilChanged` to minimize API spam.
- **Advanced Caching:** Multi-level caching for `Homeworld` and `Species` data with a local `Map` to prevent redundant HTTP requests.
- **Fault Tolerance:** The API service handles partial failures (e.g., 404 on planet/species) gracefully without breaking the character list.
- **Theme Persistence:** State is synchronized with `localStorage` and `document.body.classList` to prevent "white flashes" during overscroll.
- **Developer Experience (DX):** Fully typed interfaces, European date formatting (`en-GB`), and comprehensive Vitest suite.



## 🏗 Architectural Decisions
- **URL-Driven State:** Navigating back/forward in the browser works out of the box because the URL is the primary state holder.
- **Modern Reactivity:** Leverages Angular Signals for UI state management, resulting in fine-grained updates and improved performance via `OnPush` change detection.
- **Zone-less Friendly:** By using Signals and RxJS interoperability (`toSignal`), the app is architected with a future-proof, zone-less direction in mind.

## 🧪 Testing Suite
The application includes a comprehensive test suite using **Vitest**, covering core requirements and bonus objectives:

* **Core Logic:** Unit tests for `SwapiService` ensuring correct API parameter mapping and intelligent caching of related entities (Planets & Species).
* **Filter & Sort:** Tests for the `PeopleList` component verifying that client-side filtering and sorting produce the correct dataset.
* **State Sync (Bonus):** Verification of query parameter synchronization, ensuring that UI actions (searching, paging) correctly update the browser URL.
* **Component Integrity:** Testing of the Material Table rendering and interaction with the `PersonDetailsDialog` overlay.

## 📦 Getting Started

### Prerequisites
- **Node.js:** v22.x (LTS)
- **Angular CLI:** `^21.2.1`

### Installation
1. Clone the repository.
2. Install dependencies: `npm install`

### Development commands
- `ng serve`: Run a dev server at `http://localhost:4200/`.
- `ng test`: Execute unit tests via Vitest.
- `ng build`: Generate a production-ready bundle.