# Eventura Project - UML Class Diagram & Object-Oriented Design

## UML Class Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                              User                                    │
├─────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                      │
│ - name: String [0..1]                                               │
│ - email: String {unique}                                            │
│ - image: String [0..1]                                              │
│ - emailVerified: Date [0..1]                                        │
│ - projects: String[] (Project IDs)                                  │
│ - createdAt: Date                                                   │
│ - updatedAt: Date                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ + createUser(userData): User                                        │
│ + getUserByEmail(email): User                                       │
│ + addProjectToUser(userId, projectId): void                        │
│ + removeProjectFromUser(userId, projectId): void                   │
│ + getAllUsers(): User[]                                             │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    │ owns *
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                             Project                                  │
├─────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                      │
│ - name: String                                                       │
│ - userId: String (Owner's email)                                    │
│ - description: String [0..1]                                        │
│ - members: Member[] {composition}                                   │
│ - subgroups: Subgroup[] {composition}                              │
│ - createdAt: Date                                                   │
│ - updatedAt: Date                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ + createProject(projectData): Project                              │
│ + getProjectById(id): Project                                       │
│ + getUserProjects(userEmail): Project[]                            │
│ + updateProject(id, updates): Project                              │
│ + deleteProject(id): boolean                                        │
│ + addMember(projectId, userEmail, role): void                      │
│ + removeMember(projectId, userEmail): void                         │
│ + isUserOwner(projectId, userEmail): boolean                       │
│ + isUserMember(projectId, userEmail): boolean                      │
│ + addSubgroup(projectId, subgroup): void                           │
│ + removeSubgroup(projectId, subgroupId): void                      │
│ + updateSubgroups(projectId, subgroups): void                      │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    │ has *
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            Member                                    │
├─────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                      │
│ - userId: String (User's email)                                     │
│ - role: Enum('owner', 'member')                                     │
│ - addedAt: Date                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ + createMember(userId, role): Member                               │
│ + isOwner(): boolean                                                │
└─────────────────────────────────────────────────────────────────────┘
        │
        │ references 1
        │
        └──────────────> User (via email)


┌─────────────────────────────────────────────────────────────────────┐
│                           Subgroup                                   │
├─────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                      │
│ - id: String (Generated ID)                                         │
│ - title: String                                                      │
│ - tasks: Task[] {composition}                                       │
│ - createdAt: Date                                                   │
│ - updatedAt: Date                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ + createSubgroup(title): Subgroup                                  │
│ + updateTitle(title): void                                          │
│ + addTask(task): void                                               │
│ + removeTask(taskId): void                                          │
│ + getTasks(): Task[]                                                │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    │ contains *
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                             Task                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                      │
│ - id: String (Generated ID)                                         │
│ - task: String (Description)                                        │
│ - assignedTo: String (User email)                                   │
│ - deadline: Date [0..1]                                             │
│ - status: Enum('', 'todo', 'in-progress', 'done')                  │
│ - priority: Enum('', 'low', 'medium', 'high')                      │
│ - comment: String                                                    │
├─────────────────────────────────────────────────────────────────────┤
│ + createTask(taskData): Task                                        │
│ + updateTask(field, value): void                                    │
│ + assignToUser(userEmail): void                                     │
│ + setStatus(status): void                                           │
│ + setPriority(priority): void                                       │
│ + setDeadline(date): void                                           │
│ + isOverdue(): boolean                                              │
└─────────────────────────────────────────────────────────────────────┘
        │
        │ assigned to 0..1
        │
        └──────────────> User (via email)


┌─────────────────────────────────────────────────────────────────────┐
│                          Invitation                                  │
├─────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                      │
│ - projectId: String                                                  │
│ - projectName: String                                                │
│ - inviterEmail: String                                               │
│ - inviterName: String [0..1]                                        │
│ - inviteeEmail: String                                               │
│ - status: Enum('pending', 'accepted', 'rejected')                  │
│ - token: String {unique}                                            │
│ - expiresAt: Date                                                   │
│ - createdAt: Date                                                   │
│ - updatedAt: Date                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ + createInvitation(invitationData): Invitation                     │
│ + sendInvitation(projectId, userEmail): Invitation                │
│ + acceptInvitation(token): boolean                                  │
│ + rejectInvitation(token): boolean                                  │
│ + getInvitationByToken(token): Invitation                          │
│ + getUserInvitations(userEmail): Invitation[]                      │
│ + isExpired(): boolean                                              │
│ + generateToken(): String                                           │
│ + expireOldInvitations(): void                                      │
└─────────────────────────────────────────────────────────────────────┘
        │                           │
        │ for 1                     │ from/to
        │                           │
        ▼                           ▼
    Project                       User


┌─────────────────────────────────────────────────────────────────────┐
│                      <<Service>> AuthService                        │
├─────────────────────────────────────────────────────────────────────┤
│ + authenticateWithGoogle(credentials): Session                     │
│ + getSession(request): Session                                      │
│ + signOut(): void                                                   │
│ + isAuthenticated(request): boolean                                │
│ + getCurrentUser(request): User                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    <<Service>> EmailService                         │
├─────────────────────────────────────────────────────────────────────┤
│ - transporter: SMTPTransporter                                      │
│ - config: EmailConfig                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + sendInvitationEmail(invitation): boolean                         │
│ + createEmailTemplate(data): HTML                                   │
│ + verifyConnection(): boolean                                       │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                 <<Singleton>> DatabaseConnection                    │
├─────────────────────────────────────────────────────────────────────┤
│ - instance: DatabaseConnection                                      │
│ - connection: MongooseConnection                                    │
│ - isConnected: boolean                                              │
├─────────────────────────────────────────────────────────────────────┤
│ + getInstance(): DatabaseConnection                                │
│ + connect(): Connection                                             │
│ + disconnect(): void                                                │
│ + getConnection(): Connection                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Relationship Summary

### 1. **User ↔ Project** (One-to-Many, Bidirectional)
- **Ownership:** A User owns multiple Projects (User.projects[])
- **Membership:** A User can be a member of multiple Projects (Project.members[])
- **Navigation:** Bidirectional - can find Projects from User and User from Project
- **Multiplicity:** 1 User → * Projects (as owner), * Users ↔ * Projects (as members)

### 2. **Project ↔ Member** (Composition)
- **Type:** Strong composition - Member cannot exist without Project
- **Embedded:** Members are stored as subdocuments within Project
- **Multiplicity:** 1 Project → * Members
- **Lifecycle:** Members are deleted when Project is deleted

### 3. **Project ↔ Subgroup** (Composition)
- **Type:** Strong composition - Subgroup cannot exist without Project
- **Embedded:** Subgroups are stored as subdocuments within Project
- **Multiplicity:** 1 Project → * Subgroups
- **Lifecycle:** Subgroups are deleted when Project is deleted

### 4. **Subgroup ↔ Task** (Composition)
- **Type:** Strong composition - Task cannot exist without Subgroup
- **Embedded:** Tasks are stored as subdocuments within Subgroup
- **Multiplicity:** 1 Subgroup → * Tasks
- **Lifecycle:** Tasks are deleted when Subgroup is deleted

### 5. **Task → User** (Association)
- **Type:** Weak reference via email
- **Relationship:** assignedTo field references User.email
- **Multiplicity:** 1 Task → 0..1 User (optional assignment)
- **Navigation:** Unidirectional - Task knows User, but User doesn't track Tasks

### 6. **Invitation → Project** (Association)
- **Type:** Reference via projectId
- **Multiplicity:** * Invitations → 1 Project
- **Navigation:** Unidirectional - Invitation knows Project

### 7. **Invitation → User** (Association)
- **Type:** Reference via email (inviterEmail, inviteeEmail)
- **Multiplicity:** * Invitations → 1 Inviter User, * Invitations → 1 Invitee User
- **Navigation:** Unidirectional - Invitation knows Users

---

## Class Details

### **User Class**
**Purpose:** Represents authenticated users in the system

**Key Responsibilities:**
- Store user profile information from Google OAuth
- Maintain list of projects user owns or is a member of
- Provide email as unique identifier across system

**Design Patterns:**
- Repository pattern for data access
- Email as natural key instead of ObjectId for clarity

---

### **Project Class**
**Purpose:** Central entity representing a collaborative project workspace

**Key Responsibilities:**
- Manage project metadata (name, description)
- Maintain member list with roles
- Organize work into subgroups containing tasks
- Enforce ownership and membership authorization

**Design Patterns:**
- Aggregate root pattern - Project is the root of Project-Subgroup-Task hierarchy
- Composition pattern - owns Subgroups and Members
- Factory pattern - creates default structure on initialization

**Business Rules:**
- Owner (userId) is automatically added to members[] with role='owner'
- Only owner can delete project or manage members
- Both owner and members can update tasks and subgroups

---

### **Member Class**
**Purpose:** Represents a user's membership in a project with specific role

**Key Responsibilities:**
- Link user to project via email
- Define access level (owner vs member)
- Track when user was added

**Design Patterns:**
- Value object pattern - part of Project aggregate
- Role-based access control (RBAC)

---

### **Subgroup Class**
**Purpose:** Logical grouping of related tasks within a project

**Key Responsibilities:**
- Organize tasks into categories
- Provide structure to project work
- Track when subgroup was created/modified

**Design Patterns:**
- Composite pattern - contains collection of Tasks
- Part of Project aggregate

---

### **Task Class**
**Purpose:** Represents a single unit of work within a project

**Key Responsibilities:**
- Store task description and metadata
- Track assignment to team member
- Manage status, priority, deadline
- Allow comments/notes

**Design Patterns:**
- Entity pattern with rich domain logic
- State pattern for status management
- Strategy pattern for priority levels

**Key Features:**
- Optional deadline with overdue checking
- Four status levels (empty, todo, in-progress, done)
- Three priority levels (low, medium, high)
- Assignable to any project member

---

### **Invitation Class**
**Purpose:** Manages the invitation workflow for adding users to projects

**Key Responsibilities:**
- Create secure invitation tokens
- Link inviter, invitee, and project
- Track invitation lifecycle (pending → accepted/rejected)
- Enforce expiration (7 days)

**Design Patterns:**
- State machine pattern - status transitions
- Token-based security pattern
- Command pattern - accept/reject actions

**Security Features:**
- Unique random token (32-byte hex)
- Expiration mechanism
- Single-use tokens
- Email verification through OAuth

---

### **AuthService (Service Class)**
**Purpose:** Handles authentication and session management

**Key Responsibilities:**
- Integrate with NextAuth for Google OAuth
- Validate user sessions on API requests
- Provide current user context

**Design Patterns:**
- Service layer pattern
- Facade pattern - simplifies auth complexity
- Singleton pattern - single NextAuth configuration

---

### **EmailService (Service Class)**
**Purpose:** Handles email sending functionality

**Key Responsibilities:**
- Send invitation emails with acceptance links
- Generate HTML email templates
- Manage SMTP connection

**Design Patterns:**
- Service layer pattern
- Template method pattern - email generation
- Strategy pattern - different email types

---

### **DatabaseConnection (Singleton Class)**
**Purpose:** Manages database connection lifecycle

**Key Responsibilities:**
- Establish connection to MongoDB
- Prevent multiple connections in serverless environment
- Provide connection instance to models

**Design Patterns:**
- Singleton pattern - single connection instance
- Connection pooling
- Lazy initialization

---

## Key Design Decisions

### 1. **Embedded vs Referenced Documents**

**Embedded (Composition):**
- Member, Subgroup, Task are embedded in Project
- **Rationale:** These entities don't exist independently and are always accessed with their parent
- **Trade-off:** Limits scalability for very large projects but improves query performance

**Referenced (Association):**
- User-Project relationship uses references (email and ObjectId array)
- **Rationale:** Users and Projects are independent entities with their own lifecycle
- **Trade-off:** Requires maintaining bidirectional consistency

### 2. **Email as Identifier**

**Decision:** Use email strings instead of ObjectId for user references
**Rationale:**
- Email is unique and user-facing
- Simplifies debugging and data inspection
- Google OAuth guarantees email uniqueness
**Trade-off:** Slightly larger storage footprint, but negligible at scale

### 3. **Authorization Model**

**Decision:** Role-based with two roles (owner, member)
**Rationale:**
- Simple enough for small teams
- Clear ownership for administrative tasks
- Members have equal editing rights
**Future Enhancement:** More granular permissions (read-only, task-only, etc.)

### 4. **Invitation Workflow**

**Decision:** Two-step process (send invitation → accept/reject)
**Rationale:**
- Users must opt-in to project membership
- Prevents spam project additions
- Provides audit trail
**Alternative Considered:** Direct member addition (now implemented alongside invitations)

### 5. **Task Assignment**

**Decision:** Optional single assignment (0..1 multiplicity)
**Rationale:**
- Keeps tasks simple for small teams
- Unassigned tasks represent backlog
**Future Enhancement:** Multiple assignees, task dependencies

---

## API Layer Architecture

```
┌────────────────────────────────────────────────────┐
│              Client (React/Next.js)                │
│  - HomePage, ProjectPage, InvitationsPage         │
│  - UI Components, Forms, Modals                    │
└────────────────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     ▼
┌────────────────────────────────────────────────────┐
│              Middleware Layer                      │
│  - Authentication check                            │
│  - Session validation                              │
│  - Route protection                                │
└────────────────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│              API Route Handlers                    │
│  - /api/projects/*                                 │
│  - /api/invitations/*                              │
│  - /api/users/*                                    │
└────────────────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│              Business Logic Layer                  │
│  - Authorization checks                            │
│  - Data validation                                 │
│  - Business rules enforcement                      │
└────────────────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│              Data Access Layer                     │
│  - Mongoose Models                                 │
│  - Database queries                                │
│  - Transaction handling                            │
└────────────────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│              MongoDB Database                      │
│  - Users collection                                │
│  - Projects collection                             │
│  - Invitations collection                          │
└────────────────────────────────────────────────────┘
```

---

## Sequence Diagrams

### **Sequence 1: User Creates Project and Adds Member**

```
User          UI          API          ProjectService     UserService     Database
 │             │            │                 │                │             │
 │─ Create ──>│            │                 │                │             │
 │            │─ POST ────>│                 │                │             │
 │            │   /api/    │                 │                │             │
 │            │  projects  │                 │                │             │
 │            │            │── create() ────>│                │             │
 │            │            │                 │─ find owner ─>│             │
 │            │            │                 │                │─ query ───>│
 │            │            │                 │                │<─ user ────│
 │            │            │                 │<─ user ────────│             │
 │            │            │                 │─ save() ──────────────────>│
 │            │            │                 │<─ project ──────────────────│
 │            │            │                 │─ addProject() ─>│           │
 │            │            │                 │                 │─ update ─>│
 │            │            │<─ project ──────│                 │<──────────│
 │            │<─ 201 ─────│                 │                 │           │
 │<─ Navigate │            │                 │                 │           │
 │            │            │                 │                 │           │
 │─ Invite ─>│            │                 │                 │           │
 │  Member    │            │                 │                 │           │
 │            │─ POST ────>│                 │                 │           │
 │            │   /api/    │                 │                │             │
 │            │invitations │                 │                │             │
 │            │   /send    │                 │                │             │
 │            │            │── verify owner ─>                │             │
 │            │            │── createInvite() ────────────────────────────>│
 │            │            │<─ invitation ──────────────────────────────────│
 │            │            │── sendEmail() ───>EmailService                │
 │            │<─ 200 ─────│                                                │
 │<─ Success ─│            │                                                │
```

### **Sequence 2: User Accepts Invitation**

```
Invitee      Email        UI          API          InvitationService  ProjectService  Database
   │           │           │            │                 │                 │            │
   │<─ Email ─│           │            │                 │                 │            │
   │  with    │           │            │                 │                 │            │
   │  token   │           │            │                 │                 │            │
   │           │           │            │                 │                 │            │
   │─ Click ─────────────>│            │                 │                 │            │
   │           │           │─ GET ────>│                 │                 │            │
   │           │          /accept?token│                 │                 │            │
   │           │           │            │                 │                 │            │
   │           │           │<─ page ───│                 │                 │            │
   │           │           │            │                 │                 │            │
   │─ Accept ─────────────>│            │                 │                 │            │
   │           │           │─ POST ───>│                 │                 │            │
   │           │           │  /api/     │                 │                 │            │
   │           │           │invitations │                 │                 │            │
   │           │           │ /respond   │                 │                 │            │
   │           │           │            │─ findByToken() ─>                 │            │
   │           │           │            │                 │─ query ────────────────────>│
   │           │           │            │                 │<─ invitation ───────────────│
   │           │           │            │                 │                 │            │
   │           │           │            │─ checkExpired() ─>                │            │
   │           │           │            │<─ valid ─────────                 │            │
   │           │           │            │                 │                 │            │
   │           │           │            │─ addMember() ──────────────────>│            │
   │           │           │            │                                  │─ update ──>│
   │           │           │            │                                  │<───────────│
   │           │           │            │                 │                 │            │
   │           │           │            │─ updateStatus('accepted') ────────────────────>│
   │           │           │            │<──────────────────────────────────────────────│
   │           │           │<─ 200 ────│                 │                 │            │
   │<─ Success ────────────│            │                 │                 │            │
```

### **Sequence 3: User Updates Task**

```
User          UI          API          ProjectService     Database
 │             │            │                 │                │
 │─ Edit Task ─>│           │                 │                │
 │             │─ PUT ────>│                 │                │
 │             │   /api/    │                 │                │
 │             │ projects/  │                 │                │
 │             │   {id}     │                 │                │
 │             │            │─ authorize() ─>│                │
 │             │            │  (check member) │                │
 │             │            │                 │─ query ──────>│
 │             │            │                 │<─ project ────│
 │             │            │<─ authorized ───│                │
 │             │            │                 │                │
 │             │            │─ updateProject() ─>             │
 │             │            │  (with new      │               │
 │             │            │   subgroups[])  │─ update ─────>│
 │             │            │                 │<──────────────│
 │             │            │<─ updated ──────│                │
 │             │<─ 200 ─────│                 │                │
 │<─ Updated ─ │            │                 │                │
```

---

## State Diagrams

### **Invitation State Machine**

```
                    ┌─────────────────┐
                    │   [Created]     │
                    │   status:       │
                    │   'pending'     │
                    └────────┬────────┘
                             │
                   Created & Email Sent
                             │
                             ▼
                    ┌─────────────────┐
               ┌───>│   Pending       │<────┐
               │    │   Awaiting      │     │
               │    │   Response      │     │ Reminder
               │    └────────┬────────┘     │ (Future)
               │             │               │
               │    User clicks accept/reject│
               │             │
     Expired   │             ▼
     (7 days)  │    ┌────────────────┐
               │    │   Processing   │
               │    └───────┬────────┘
               │            │
               │    ┌───────┴────────┐
               │    │                │
               │    ▼                ▼
          ┌────┴────────┐    ┌──────────────┐
          │  Rejected   │    │   Accepted   │
          │  (Expired   │    │   User is    │
          │  or Manual) │    │   member now │
          └─────────────┘    └──────────────┘
               (End)              (End)
```

### **Task Status Lifecycle**

```
        ┌─────────────┐
        │   Created   │
        │   status:'' │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐         ┌──────────────┐
   ┌───>│  To Do      │────────>│ In Progress  │────┐
   │    │  'todo'     │         │ 'in-progress'│    │
   │    └─────────────┘         └──────────────┘    │
   │            │                       │            │
   │            │                       │            │
   └────────────┼───────────────────────┘            │
         Reset  │                                    │
                │                                    │
                ▼                                    │
        ┌──────────────┐                            │
        │     Done     │<───────────────────────────┘
        │    'done'    │
        └──────┬───────┘
               │
               │ Reopen (set back to any status)
               │
               └──────> (Any Status)
```

---

## Design Principles Applied

### **SOLID Principles**

1. **Single Responsibility Principle (SRP)**
   - Each model handles only its own data and behavior
   - Services are separated (AuthService, EmailService)
   - API routes handle only HTTP concerns, delegate to services

2. **Open/Closed Principle (OCP)**
   - Models use Mongoose schemas which are extensible
   - Can add new fields without modifying existing logic
   - Middleware pattern allows adding auth/validation layers

3. **Liskov Substitution Principle (LSP)**
   - Member subclass can substitute Project reference
   - Task subclass can substitute Subgroup reference

4. **Interface Segregation Principle (ISP)**
   - TypeScript interfaces define minimal contracts
   - IUser, IProject, ITask interfaces separate concerns

5. **Dependency Inversion Principle (DIP)**
   - API routes depend on service abstractions
   - Database connection is abstracted via Mongoose
   - Auth logic separated into service layer

### **Additional Patterns**

1. **Repository Pattern** - Data access abstracted through Mongoose models
2. **Factory Pattern** - Object creation logic in model constructors
3. **Singleton Pattern** - Database connection
4. **Facade Pattern** - NextAuth simplifies OAuth complexity
5. **Composite Pattern** - Project → Subgroup → Task hierarchy
6. **State Pattern** - Invitation and Task status management
7. **Strategy Pattern** - Different priority/status behaviors

---

## Scalability Considerations

### **Current Limitations**

1. **Embedded Documents**
   - Tasks/Subgroups stored in Project document
   - MongoDB document size limit: 16MB
   - **Impact:** Large projects with thousands of tasks may hit limit

2. **Lack of Transactions**
   - User-Project relationship updates happen separately
   - **Risk:** Inconsistent data if one operation fails

3. **N+1 Query Problem**
   - Fetching all users to show in dropdowns
   - **Impact:** Slow as user count grows

### **Recommended Enhancements**

1. **Pagination**
   - Add pagination to project lists
   - Lazy load tasks in large subgroups

2. **Separate Task Collection**
   - Move tasks to separate collection
   - Reference via taskIds array
   - Enables independent scaling

3. **Caching Layer**
   - Redis cache for frequently accessed projects
   - Cache project member lists
   - Cache user lists for assignment dropdowns

4. **Full-Text Search**
   - MongoDB Atlas Search for task/project search
   - Elasticsearch for advanced querying

5. **Event-Driven Architecture**
   - Emit events on project changes
   - Decouple invitation email sending
   - Enable real-time notifications

---

## Security Architecture

### **Authentication Flow**

```
User → Google OAuth → NextAuth → JWT Token → Stored in Cookie
                                      ↓
                            Verified on each request
                                      ↓
                            Session extracted and used
```

### **Authorization Checks**

```
Request → Extract Session → Verify User → Check Permissions → Execute
              ↓                                    ↓
          If no session                    If unauthorized
              ↓                                    ↓
          401 Error                           403 Error
```

### **Security Layers**

1. **Transport:** HTTPS in production
2. **Authentication:** Google OAuth, JWT sessions
3. **Authorization:** Role-based (owner/member)
4. **Input Validation:** Required on all API endpoints (should be enhanced)
5. **Token Security:** Random 32-byte tokens for invitations
6. **Expiration:** 7-day limit on invitations
7. **Route Protection:** Middleware guards protected pages

---

## Conclusion

This object-oriented design provides a solid foundation for the Eventura project management system. The architecture emphasizes:

- **Clear separation of concerns** through proper entity design
- **Scalability** through composition and service layers
- **Security** through authentication and authorization patterns
- **Maintainability** through adherence to SOLID principles
- **Extensibility** through open patterns and abstractions

The system is well-suited for small to medium teams managing multiple projects collaboratively. For enterprise-scale deployments, consider the scalability enhancements outlined above.
