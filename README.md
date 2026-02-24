# Masjidly

**Masjidly** is a customizable platform for managing and displaying prayer times, announcements, and more for a mosque or Islamic center. It’s designed so **no external device** or specialized hardware is required—you can simply open the **front-end site on a smart TV’s web browser** (or any modern browser), and everything just works.

- **Frontend**: [Vue.js](https://vuejs.org) (deployed on [Netlify](https://www.netlify.com))
- **Backend CMS**: [Strapi](https://strapi.io) (deployed on [Railway](https://railway.app))
- **Database**: PostgreSQL (hosted on Railway)
- **CDN**: Cloudinary

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started (Local Development)](#getting-started-local-development)
   - [Prerequisites](#prerequisites)
   - [Clone & Install](#clone--install)
   - [Environment Variables](#environment-variables)
   - [Running Locally](#running-locally)
4. [Deployment](#deployment)
   - [Frontend on Netlify](#frontend-on-netlify)
   - [Cloudinary Setup](#cloudinary-setup)
   - [Backend (Strapi) on Railway](#backend-strapi-on-railway)
5. [Project Structure](#project-structure)
6. [License](#license)
7. [Acknowledgments](#acknowledgments)

---

## Features

- **No External Devices Needed**: Display Masjidly on **any smart TV browser**—no extra hardware required.
- **Prayer Times Management**: Easily add, edit, or schedule prayer times in Strapi’s admin panel.
- **Announcements**: Post announcements that display dynamically on the frontend.
- **Lightweight & Headless**: Vue.js consumes data from Strapi’s API.
- **Automated Deployments**: Frontend auto-builds on Netlify, backend auto-deploys on Railway.

---

## Tech Stack

- **Frontend**: Vue.js
- **Backend**: Strapi (Node.js, headless CMS)
- **Database**: PostgreSQL
- **Hosting**:
  - **Frontend** on [Netlify](https://netlify.com/)
  - **Strapi** + **Postgres** on [Railway](https://railway.app/)
  - **Assets and Media**:[Cloudinary](https://cloudinary.com/)

---

## Getting Started (Local Development)

### Prerequisites

- **Node.js** (version 20.x)
- **npm** (>= 10) or **Yarn**
- **PostgreSQL** (if running locally) or a remote DB connection
- **Git** (optional, but typical for cloning repos)

### Clone & Install

1. **Clone** this repository:
   ```bash
   git clone https://github.com/your-username/masjidly.git
   cd masjidly
   ```
2. **Install** dependencies for both frontend and backend:

   ```bash
   # Frontend (Vue.js)
   cd frontend
   npm install      # or: yarn

   # Backend (Strapi)
   cd ../backend
   npm install      # or: yarn
   ```

### Environment Variables

For **Strapi** (backend), create a `.env` file locally or configure **Railway** variables (in production) such as:

```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=...
DATABASE_PORT=5432
DATABASE_NAME=...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
APP_KEYS=myKeyOne,myKeyTwo,myKeyThree,myKeyFour
API_TOKEN_SALT=someRandomSalt
ADMIN_JWT_SECRET=anotherRandomString
JWT_SECRET=publicRandomString
HOST=0.0.0.0
PORT=1337
CLOUDINARY_KEY=your_cloudinary_key_here
CLOUDINARY_NAME=your_cloudinary_name_here
CLOUDINARY_SECRET=your_cloudinary_secret_here
```

For the **Vue.js** frontend, you might have `.env` variables like:

```bash
VITE_STRAPI_URL=https://your-strapi-railway-url
VITE_STRAPI_API_TOKEN=your_strapi_api_token
VITE_SHOW_PRAYER_DAY_LABELS=false
```

(See `frontend/.env.example` for the current set used by this repo.)

### Running Locally

1. **Backend**:

   ```bash
   # In the backend folder
   npm run develop    # or: yarn develop
   ```

   By default, Strapi runs at [http://localhost:1337](http://localhost:1337).

2. **Frontend**:
   ```bash
   # In the frontend folder
   npm run dev        # or: yarn dev
   ```
   By default, Vue runs at [http://localhost:5173](http://localhost:5173) (or [http://localhost:8080] depending on your config).

Open your browser to test:

- **Strapi Admin**: [http://localhost:1337/admin](http://localhost:1337/admin)
- **Vue.js**: [http://localhost:5173](http://localhost:5173)

---

## Deployment

### Frontend on Netlify

1. **Netlify Site Setup**:

   - Sign up or log in to [Netlify](https://netlify.com).
   - **Create a New Site** from Git (if your frontend code is on GitHub).
   - **Configure Build Command**: `npm run build` or `yarn build`.
   - **Publish Directory**: `dist` (Vue default).

2. **Environment Variables** (Optional):

   - In Netlify’s project settings, add any needed variables (e.g., `VITE_APP_STRAPI_URL`).

3. **Deploy**:
   - Netlify automatically deploys on each push to your designated branch (e.g., `main`).

### Cloudinary Setup

To integrate Cloudinary with your Strapi backend, follow these steps:

1. **Sign Up or Sign In to Cloudinary**:

   - Go to [Cloudinary's website](https://cloudinary.com/) and sign up for a free account or log in if you already have one.
   - After signing in, navigate to the **Dashboard** to find your Cloudinary credentials.

2. **Obtain Your Cloudinary Keys**:

   - In the Cloudinary Dashboard, locate your **Cloudinary Key**, **Cloudinary Name**, and **Cloudinary Secret**. These are required for the integration with Strapi.

3. **Set Environment Variables**:
   - Create a `.env` file locally or configure **Railway** variables (in production) with the following:
   ```bash
   CLOUDINARY_KEY=your_cloudinary_key_here
   CLOUDINARY_NAME=your_cloudinary_name_here
   CLOUDINARY_SECRET=your_cloudinary_secret_here
   ```

To set up Cloudinary with Strapi, ensure you have the required environment variables configured in your `.env` file as mentioned above.

### Backend (Strapi) on Railway

1. **Railway Project**:
   - Create a new project on [Railway](https://railway.app).
   - Attach a **PostgreSQL** service or configure an external Postgres DB.
2. **Set Environment Variables**:
   DATABASE_CLIENT=postgres
   DATABASE_HOST=...
   DATABASE_PORT=5432
   DATABASE_NAME=...
   DATABASE_USERNAME=...
   DATABASE_PASSWORD=...
   APP_KEYS=myKeyOne,myKeyTwo,myKeyThree,myKeyFour
   API_TOKEN_SALT=someRandomSalt
   ADMIN_JWT_SECRET=anotherRandomString
   JWT_SECRET=publicRandomString
   HOST=0.0.0.0
   PORT=1337

   **Cloudinary configuration**
   CLOUDINARY_KEY=your_cloudinary_key_here
   CLOUDINARY_NAME=your_cloudinary_name_here
   CLOUDINARY_SECRET=your_cloudinary_secret_here

3. **Deploy Strapi**:
   - Connect your GitHub repo (or upload code).
   - **Build Command**:
     - `npm run build` or `yarn build`
   - **Start Command**:
     - `npm run start` or `yarn start`
4. **Access Your Strapi Admin**:
   - After deployment, note the Railway domain, e.g. `https://your-strapi-app.up.railway.app/admin`
   - Create your admin account.

---

## Project Structure

```bash
masjidly/
├─ frontend/ # Vue.js code (Netlify)
│ ├─ src/
│ ├─ public/
│ ├─ package.json
│ └─ ...
├─ backend/ # Strapi code (Railway)
│ ├─ config/ # Strapi config files
│ ├─ src/ # Strapi API & content types
│ ├─ package.json
│ └─ ...
├─ README.md
└─ ...
```

- **frontend/**: Vue.js application
- **backend/**: Strapi CMS

---

## License

> This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Vue.js** for the dynamic frontend.
- **Strapi** for a headless CMS solution.
- **Railway** for hosting the backend + PostgreSQL.
- **Netlify** for serverless frontend hosting.
- **Smart TV Browsers** for easily displaying the site without extra hardware.

Enjoy using **Masjidly** to keep your community informed of prayer times and announcements—**just open the site on a smart TV and go!**
