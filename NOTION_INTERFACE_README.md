# Notion-like Project Management Interface

## Overview
A Notion-inspired project management interface has been implemented with the following features:

### Features Implemented

#### 1. **Database Models** (`src/models/`)
- **Project Model** (`projectmodel.ts`):
  - Project name and description
  - User association (userId)
  - Array of subgroups
  - Timestamps (createdAt, updatedAt)

- **Subgroup Structure**:
  - Unique ID for each subgroup
  - Customizable title
  - Array of tasks
  - Timestamps

- **Task Structure**:
  - Task description
  - Assigned to field
  - Deadline (date picker)
  - Unique ID for each task

#### 2. **API Endpoints** (`src/app/api/projects/`)
- `GET /api/projects` - Fetch all projects for authenticated user
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Fetch a single project by ID
- `PUT /api/projects/[id]` - Update project (name, description, subgroups)
- `DELETE /api/projects/[id]` - Delete a project

All endpoints are protected with NextAuth.js session authentication.

#### 3. **Home Dashboard** (`src/app/home/page.tsx`)
- Display all projects in a responsive grid
- Create new projects with one click
- Click on any project to view details
- Empty state with call-to-action
- User greeting and sign out functionality

#### 4. **Project Detail Page** (`src/app/projects/[id]/page.tsx`)
A fully interactive Notion-like interface with:

**Project Level:**
- Editable project title (click edit icon)
- Back to projects navigation
- Add new subgroups button

**Subgroup Level:**
- Multiple subgroups per project
- Editable subgroup titles
- Delete subgroups
- Each subgroup contains a table

**Table Features:**
- **Columns:**
  - Task (text input)
  - Assigned To (text input)
  - Deadline (date picker)
  - Actions (delete button)

- **Functionality:**
  - Add new tasks to any subgroup
  - Delete individual tasks
  - Inline editing (click any cell to edit)
  - Auto-save on blur/change
  - Smooth hover effects

#### 5. **Session Management**
- Layout components with SessionProvider
- Authentication checks on all pages
- Redirect to signup if not authenticated

## User Flow

### Creating and Using Projects:

1. **Login** → User signs in with Google OAuth
2. **Dashboard** → User sees all their projects or empty state
3. **Create Project** → Click "Create New Project" button
4. **Project Detail** → Automatically redirected to new project page
5. **Add Subgroups** → Click "Add Subgroup" to create new sections
6. **Rename Subgroups** → Click edit icon next to subgroup title
7. **Add Tasks** → Click "Add Task" within any subgroup
8. **Edit Tasks** → Click on any cell to edit inline:
   - Type task description
   - Assign to team members
   - Set deadlines with date picker
9. **Delete** → Remove tasks or entire subgroups as needed
10. **Auto-save** → All changes save automatically to MongoDB

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google OAuth
- **State Management**: React hooks (useState, useEffect)

## File Structure
```
Eventura/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── projects/
│   │   │       ├── route.ts              # GET & POST projects
│   │   │       └── [id]/
│   │   │           └── route.ts          # GET, PUT, DELETE project
│   │   ├── home/
│   │   │   ├── layout.tsx                # SessionProvider wrapper
│   │   │   └── page.tsx                  # Projects dashboard
│   │   └── projects/
│   │       ├── layout.tsx                # SessionProvider wrapper
│   │       └── [id]/
│   │           └── page.tsx              # Project detail with subgroups
│   ├── models/
│   │   ├── projectmodel.ts               # Project, Subgroup, Task schemas
│   │   └── usermodel.ts                  # User schema
│   └── utils/
│       ├── mongodb.ts                    # Mongoose connection
│       └── mongodbclient.ts              # MongoDB client (NextAuth)
```

## Key Design Decisions

### 1. **Inline Editing**
- Tasks are edited directly in table cells
- No modal dialogs needed
- Immediate visual feedback

### 2. **Auto-save**
- Changes saved automatically on blur/change
- No explicit "Save" button needed
- Reduces cognitive load

### 3. **Notion-like UI**
- Clean, minimal design
- Hover effects for interactivity
- Icon-based actions
- Editable titles with inline edit mode

### 4. **Flexible Subgroups**
- Create unlimited subgroups per project
- Each subgroup has its own table
- Custom titles for different sections (e.g., "Sprint 1", "Backend Tasks", "Design Work")

### 5. **Type Safety**
- Full TypeScript implementation
- Interface definitions for all data structures
- Type-safe API calls

## Example Use Cases

### Software Development Project:
```
Project: "Web App Development"
├── Subgroup: "Frontend Tasks"
│   ├── Task: "Build login page" | Assigned to: "John" | Deadline: 2025-11-01
│   └── Task: "Add dark mode" | Assigned to: "Sarah" | Deadline: 2025-11-05
├── Subgroup: "Backend Tasks"
│   ├── Task: "Setup database" | Assigned to: "Mike" | Deadline: 2025-10-28
│   └── Task: "Create API endpoints" | Assigned to: "Alex" | Deadline: 2025-11-02
└── Subgroup: "Testing"
    └── Task: "Write unit tests" | Assigned to: "Emma" | Deadline: 2025-11-10
```

### Event Planning:
```
Project: "Company Conference 2025"
├── Subgroup: "Venue Setup"
│   ├── Task: "Book conference hall" | Assigned to: "Events Team" | Deadline: 2025-12-01
│   └── Task: "Arrange seating" | Assigned to: "Logistics" | Deadline: 2025-12-15
└── Subgroup: "Speakers"
    └── Task: "Confirm keynote speaker" | Assigned to: "HR" | Deadline: 2025-11-20
```

## Next Steps / Potential Enhancements

1. **Drag & Drop** - Reorder tasks and subgroups
2. **Rich Text Editing** - Add formatting to task descriptions
3. **Tags/Labels** - Categorize tasks with colored tags
4. **Due Date Reminders** - Email notifications for upcoming deadlines
5. **Task Status** - Add status column (To Do, In Progress, Done)
6. **Comments** - Add discussion threads to tasks
7. **File Attachments** - Upload files to tasks
8. **Search** - Search across all projects and tasks
9. **Templates** - Pre-built project templates
10. **Collaboration** - Share projects with team members
11. **Activity Log** - Track changes and who made them
12. **Export** - Export projects to CSV/PDF

## Authentication Notes
- All API endpoints check for valid NextAuth.js session
- Projects are scoped to the logged-in user (userId)
- Unauthorized requests return 401 status
- Missing projects return 404 status

## Database Notes
- MongoDB connection via Mongoose
- Models use timestamps (createdAt, updatedAt)
- Subdocuments (subgroups, tasks) use generated IDs
- Indexes on userId for faster queries
- Prevents model recompilation in development

## Getting Started

1. Ensure MongoDB connection string is in `.env`
2. Run the development server: `npm run dev`
3. Sign in with Google OAuth
4. Navigate to `/home` to see your projects
5. Click "Create New Project"
6. Start adding subgroups and tasks!

---

**Built with**: Next.js 15 + MongoDB + NextAuth.js
**Interface Inspiration**: Notion.so
**Date**: October 2025
