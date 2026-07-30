# CASPAA - Comprehensive Assessment Platform

A full-stack educational management platform designed to streamline assignments, Computer-Based Testing (CBT), and school-wide academic oversight. CASPAA provides dedicated workflows for teachers, students, and school proprietors to facilitate seamless academic operations.

## 🚀 Features

### 👨‍🏫 Teacher Portal

- **Assignment Management:** Create and distribute assignments to specific classes.
- **Advanced Grading Workflow:** Review student submissions with interactive, coordinate-based inline pinning for image feedback.
- **CBT Exam Builder:** Construct digital assessments featuring Multiple Choice (MCQ), True/False, and Short Answer question types.
- **Hybrid Grading System:** Instant auto-grading for MCQ and True/False questions, paired with a dedicated manual review interface for Short Answer questions.

### 🎓 Student Portal

- **Assessment Dashboard:** View active, pending, and graded assignments and CBT exams.
- **Interactive CBT Execution:** Take timed digital exams with immediate score feedback for auto-graded sections.
- **Feedback Iteration:** Review detailed inline feedback from teachers and submit revisions seamlessly.

### 🏢 Proprietor Oversight

- **School-Wide Visibility:** Monitor all active assessments and CBT exams across the entire institution.
- **Submission Tracking:** Track completion rates, grading statuses, and student performance metrics from a high-level administrative view.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** Tailwind CSS
- **Architecture:** React Server Components (RSC) & Server Actions

## 🛠️ Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

- Node.js (v18.17 or higher)
- npm, yarn, or pnpm
- A running PostgreSQL database instance

### Installation

1. **Clone the repository**
   `git clone <your-repository-url>`
   `cd caspaa`

2. **Install dependencies**
   `npm install`

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your database connection string and any other required secrets:
   `DATABASE_URL="postgresql://user:password@localhost:5432/caspaa_db?schema=public"`

4. **Database Setup**
   Push the schema to your database and generate the Prisma Client:
   `npx prisma db push`
   `npx prisma generate`

5. **Start the Development Server**
   `npm run dev`

6. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📂 Project Structure Overview

- `app/(dashboard)/`: Contains the role-based dashboard layouts and views (Teacher, Student, Proprietor).
- `lib/prisma.ts`: Prisma client instantiation.
- `actions/`: Next.js Server Actions handling database mutations and complex business logic (e.g., CBT auto-grading, assignment submissions).
- `prisma/schema.prisma`: Database schema definitions for Users, Classes, Assignments, CbtExams, CbtQuestions, and Submissions.

## 📄 License

This project is proprietary and confidential.
