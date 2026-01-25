# CollegeDost Implementation Plan

## 1. Overall Architecture

### Tech Stack

- **Frontend**: React.js 18+ (Vite), Tailwind CSS, React Router v6, Axios, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas) with Mongoose ODM.
- **Auth**: JWT (JSON Web Tokens) with HttpOnly cookies or Bearer tokens.
- **State**: React Context API (for User/Auth), Local State for simple data.

### Folder Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/ (DB, etc.)
│   │   ├── controllers/ (Logic)
│   │   ├── middleware/ (Auth, Error)
│   │   ├── models/ (Mongoose Schemas)
│   │   ├── routes/ (API Endpoints)
│   │   ├── utils/ (Helpers, Cron)
│   │   └── app.js
│   ├── scripts/ (Seeders, Cron runners)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/ (Reusable UI)
    │   ├── pages/ (Route Views)
    │   ├── context/ (Global State)
    │   ├── hooks/ (Custom Hooks)
    │   └── services/ (API calls)
    └── package.json
```

---

## 2. Module Breakdown

### A. Exams Module (Partially Implemented)

- **Status**: Backend ready, Frontend Basic Pages ready.
- **Next Steps**:
  - Add filtering by `examLevel` and `authority`.
  - Refine `ExamDetailPage` with rich-text rendering for syllabus.

### B. Colleges Module

- **Goal**: Comprehensive college directory.
- **Schema Enhancements**:
  - `approvals` (Array: 'AICTE', 'UGC')
  - `facilities` (Array: 'Hostel', 'Wifi')
  - `fees` (Object: { tuition: Number, hostel: Number })
  - `placements` (Object: { highest: String, average: String })
- **API**: Filter by State, Stream, Exam Accepted.

### C. Courses Module

- **Goal**: Links courses to colleges (e.g., B.Tech in CSE).
- **Schema**: `Course` linked to `College`.
- **Logic**: Use `populate()` to show colleges offering a specific course.

### D. Predictors

- **Goal**: Rule-based prediction (not scraped).
- **Logic**: Use `openingRank` and `closingRank` from historical data (stored in `College.cutoff`).
- **Algorithm**:
  - If `userRank < closingRank`, Chance = High.
  - If `userRank < closingRank * 1.15`, Chance = Medium.
  - Else Chance = Low.
  - Must respect `Category` and `Home State` quotas.

### E. News & Cron

- **Goal**: Auto-fetch news.
- **Tech**: `rss-parser`, `node-cron`.
- **Flow**: Cron runs every 6 hours -> Fetches RSS -> Dup check -> Save to DB (Status: 'Draft') -> Admin Approves -> Publish.

### F. Authentication & Admin

- **Roles**: 'user', 'admin', 'editor'.
- **Middleware**: `protect` (checks token), `authorize('admin')` (checks role).
- **Admin Panel**: Separate route `/admin` with dashboard.

### G. SEO

- **Tech**: `react-helmet-async`.
- **Strategy**: Dynamic title/meta tags based on `examName` or `collegeName`.
- **Sitemap**: Generate `sitemap.xml` dynamically using backend routes.

---

## 3. Immediate Roadmap

1. **Fix Seeder**: Ensure `Exam` data is populated.
2. **Colleges Update**: Update Schema and seeding for Colleges.
3. **News Module**: Implement RSS fetching.
