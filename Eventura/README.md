# Eventura - Project Management Application

A modern project management application built with Next.js 15, TypeScript, and MongoDB. Manage your projects with subgroups and tasks, all secured with Google OAuth authentication.

## Features

- Google OAuth authentication
- Create and manage multiple projects
- Organize projects with subgroups
- Assign tasks to team members with deadlines
- Inline editing for quick updates
- Auto-save functionality
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15.4.6, React 19, TypeScript
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS 4.1.11
- **Icons**: React Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.17 or later
- npm, yarn, or pnpm
- A Google Cloud Platform account
- A MongoDB Atlas account (or local MongoDB instance)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Eventura
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if prompted
6. For Application type, select "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Click "Create" and save your Client ID and Client Secret

### 4. Set Up MongoDB

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster or use an existing one
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<username>` and `<password>` with your database credentials

### 5. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables in `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Generate a secure `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator: https://generate-secret.vercel.app/32

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 7. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Eventura/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   │   └── projects/              # Project API routes
│   │   ├── home/                      # Dashboard page
│   │   ├── projects/[id]/             # Project detail page
│   │   ├── signup/                    # Sign-in page
│   │   └── page.tsx                   # Root redirect
│   ├── models/
│   │   ├── projectmodel.ts            # Project schema
│   │   └── usermodel.ts               # User schema
│   ├── utils/
│   │   ├── mongodb.ts                 # Mongoose connection
│   │   └── mongodbclient.ts           # MongoDB client for NextAuth
│   └── middleware.ts                  # Route protection
├── .env                               # Environment variables (not committed)
├── .env.example                       # Environment variables template
└── package.json
```

## Usage

### Sign In

1. Visit the application at `http://localhost:3000`
2. Click "Sign in with Google"
3. Authorize the application
4. You'll be redirected to the dashboard

### Create a Project

1. On the dashboard, click "Create New Project"
2. A new project will be created and you'll be redirected to the project detail page
3. Click the edit icon to rename the project

### Manage Subgroups and Tasks

1. Click "Add Subgroup" to create a new section
2. Edit the subgroup title by clicking on it
3. Click "Add Task" to create a new task row
4. Fill in the task details (description, assignee, deadline)
5. All changes are automatically saved

### Navigate

- Click the back button on a project to return to the dashboard
- Click on any project card to open it
- Click "Sign Out" to log out

## API Routes

### Authentication
- `GET/POST /api/auth/*` - NextAuth endpoints

### Projects
- `GET /api/projects` - Get all projects for authenticated user
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a specific project
- `PUT /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project

## Database Schema

### User
```typescript
{
  name: string
  email: string (unique)
  image: string
  emailVerified: Date
  createdAt: Date
  updatedAt: Date
}
```

### Project
```typescript
{
  name: string
  userId: string (user's email)
  description: string
  subgroups: [
    {
      id: string
      title: string
      tasks: [
        {
          id: string
          task: string
          assignedTo: string
          deadline: Date
        }
      ]
      createdAt: Date
      updatedAt: Date
    }
  ]
  createdAt: Date
  updatedAt: Date
}
```

## Security

- All protected routes require authentication (enforced by middleware)
- Server-side session validation on API routes
- User data isolation (users can only access their own projects)
- Environment variables for sensitive credentials
- OAuth 2.0 authentication via Google

## Troubleshooting

### "Invalid credentials" error
- Verify your Google OAuth credentials are correct
- Check that the redirect URI matches your configuration
- Ensure `NEXTAUTH_URL` matches your application URL

### Database connection errors
- Verify your MongoDB connection string is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

### Session/authentication issues
- Clear browser cookies and try again
- Verify `NEXTAUTH_SECRET` is set and consistent
- Check that `NEXTAUTH_URL` matches your current environment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues or questions, please open an issue in the repository.
