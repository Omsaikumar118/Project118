# Calendar Application for Communication Tracking

A React-based Calendar Application that enables efficient tracking of communication with companies, ensuring timely follow-ups and consistent engagement. The application provides a centralized platform for logging past interactions, planning future communications, and managing engagement schedules.

## Live Demo

Visit the live application at: [https://project118.netlify.app/](https://project118.netlify.app/)


### Admin Module
- *Company Management*
  - Add, edit, and delete companies
  - Track company details (name, location, contact info)
  - Set communication periodicity
  - Manage LinkedIn profiles and contact information

- *Communication Method Management*
  - Define and customize communication methods
  - Set sequence and mandatory flags
  - Organize methods by priority

### User Module
- *Dashboard*
  - Real-time statistics
  - Color-coded notifications for due communications
  - Quick access to pending tasks

- *Communication Tracking*
  - Log and monitor all communications
  - Schedule future interactions
  - Track communication history

### Notification System
- Real-time notifications for:
  - Upcoming communications
  - Overdue follow-ups
  - Important updates
  - Status changes

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.14.0

### Installation

1. Clone the repository:
   bash
   git clone [your-repository-url]
   

2. Install dependencies:
   bash
   cd calendar-app
   npm install
   

3. Create a .env file in the root directory:
   env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_JWT_SECRET=your_jwt_secret
   

4. Start the development server:
   bash
   npm run dev
   

## Built With

- React 18.2.0
- Redux Toolkit for state management
- React Router for navigation
- Express.js for backend
- React Icons for UI elements
- Date-fns for date manipulation

## Project Structure

calendar-app/
├── src/
│   ├── modules/
│   │   ├── admin/          # Admin module components
│   │   └── user/           # User module components
│   ├── store/              # Redux store configuration
│   ├── utils/              # Utility functions
│   └── App.js             # Main application component
├── server/                 # Backend server files
└── public/                # Static assets


## Configuration

The application can be configured through environment variables:
- REACT_APP_API_URL: Backend API URL
- REACT_APP_JWT_SECRET: JWT secret for authentication


### Admin Dashboard
- Statistics display showing:
  - Total Companies: Overview of managed companies
  - Active Communications: Current ongoing communications
  - Pending Follow-ups: Tasks requiring attention
  - Completed Follow-ups: Successfully completed tasks

### Company Management
- Comprehensive company profiles
- Communication history tracking
- Status monitoring
- Contact information management

### Communication Methods
- Customizable communication channels
- Priority-based sequencing
- Mandatory step enforcement
- Method effectiveness tracking

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or create an issue in the repository.
