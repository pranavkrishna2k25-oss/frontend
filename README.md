# Smart To-Do App Frontend

A modern, responsive React frontend for the Smart To-Do application with full CRUD functionality for task management.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Categories**: Organize tasks by Work, Personal, Study, or Other
- **Deadlines & Reminders**: Set due dates and reminder times
- **Task Status**: Mark tasks as completed or pending
- **Search & Filter**: Find tasks by title, category, or status
- **Dashboard**: Overview of task statistics and recent tasks
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 19** - Frontend framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.jsx       # Login form
│   ├── Register.jsx    # Registration form
│   ├── Dashboard.jsx   # Dashboard overview
│   ├── TaskList.jsx    # Task management
│   ├── TaskItem.jsx    # Individual task display
│   ├── TaskForm.jsx    # Create/edit task form
│   ├── Navbar.jsx      # Navigation bar
│   └── ProtectedRoute.jsx # Route protection
├── context/            # React Context
│   └── AuthContext.jsx # Authentication state
├── services/           # API services
│   ├── api.js         # Axios configuration
│   └── taskService.js # Task API calls
├── App.jsx            # Main app component
├── main.jsx          # App entry point
└── index.css         # Global styles
```

## API Endpoints

The frontend communicates with the following backend endpoints:

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Features in Detail

### Authentication
- Secure JWT-based authentication
- Automatic token refresh
- Protected routes
- Persistent login state

### Task Management
- **Create Tasks**: Add title, category, deadline, and reminder
- **Edit Tasks**: Modify existing task details
- **Delete Tasks**: Remove tasks with confirmation
- **Mark Complete**: Toggle task completion status
- **Search**: Find tasks by title
- **Filter**: Filter by category and status

### Dashboard
- Task statistics overview
- Recent tasks display
- Visual progress indicators
- Quick access to task management

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design patterns

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.