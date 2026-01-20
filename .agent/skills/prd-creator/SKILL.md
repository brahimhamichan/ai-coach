---
name: PRD Creator
description: An intelligent Product Requirements Document (PRD) generator powered by Google's Gemini AI.
---

# PRD Creator Skill

The PRD Creator is a web application that helps generate comprehensive, professional PRDs using Google's Gemini AI.

## Description

This skill provides a local Next.js application that offers a wizard-based interface to input product requirements, generate PRDs, and manage drafts. It functionality includes:

-   **3-Step Wizard**: Input -> Generate -> Review.
-   **AI Auto-fill**: Generate form inputs from a simple product idea.
-   **Full PRD Generation**: Create complete markdown PRDs.
-   **Draft Management**: Save and load drafts using local storage/IndexedDB.
-   **PWA Support**: Can be installed as a Progressive Web App.

## Prerequisites

-   Node.js (v18 or higher recommended)
-   Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/apikey))

## Setup & Usage

To use this skill, you need to run the web application locally.

1.  **Install Dependencies**:
    Navigate to the skill directory and install dependencies:
    ```bash
    cd <SKILL_DIR>
    npm install
    ```

2.  **Run Development Server**:
    Start the local server:
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

3.  **Configure API Key**:
    - Open the app in your browser.
    - Click the Settings icon.
    - Enter your Gemini API Key.
    - Select your preferred model (e.g., Gemini 2.5 Flash).

## Technical Details

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS 4
-   **AI Client**: Google GenAI SDK

## API Endpoints (Local)

If programmatic access is needed in the future, the app exposes these internal API routes:

-   `POST /api/models`: Fetch available Gemini models.
-   `POST /api/prefill`: usage: `{ apiKey, model, productIdea }` -> Returns filled form data.
-   `POST /api/generate`: usage: `{ apiKey, model, inputs }` -> Returns generated PRD markdown.
-   `POST /api/refine`: usage: `{ apiKey, model, currentInputs, sectionTitle, userFeedback }` -> Returns refined section data.
