# 📚 Book Store Web Application

A full-stack MERN application for managing an online bookstore with user authentication, role-based admin dashboard, and PDF book reading capabilities.
---

## 🏗️ Project Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Client   │────────▶│  Express API    │────────▶│  MongoDB Atlas  │
│  (Port 5173)    │◀────────│  (Port 5002)    │◀────────│   (Cloud DB)    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Firebase Auth  │         │   Admin Routes  │
│   (Google SSO)  │         │  (Role-based)   │
└─────────────────┘         └─────────────────┘
```

---

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- Firebase Authentication (Email/Password + Google Sign-In)
- Role-based access control (User/Admin)
- Secret key system for admin registration
- 2-hour session timeout with auto-logout

### 📖 **User Features**
- Browse and search book catalog
- View detailed book information
- Rate books (1-5 stars)
- Read PDF books in-browser
- Responsive design for all devices

### 👨‍💼 **Admin Dashboard**
- Upload and manage books (CRUD operations)
- User management (promote/demote admins)
- Real-time analytics (users, books, ratings, views)
- Product inventory tracking
- Modern grid-based dashboard UI

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide Icons** - Icon library
- **React PDF** - PDF rendering

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Firebase Admin** - Authentication

### Deployment
- **Vercel** - Hosting (both client & server)
- **MongoDB Atlas** - Cloud database

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Firebase project

### 1️⃣ Clone Repository
```bash
git clone https://github.com/TirtharajBarma/Book-Store-WebApp.git
cd Book-Store-WebApp
```

### 2️⃣ Setup Server

```bash
cd server
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_SECRET_KEY=bookstore_admin_2025
```

Start server:
```bash
npm start
# Server runs on http://localhost:5002
```

### 3️⃣ Setup Client

```bash
cd ../client
npm install
```

Create Firebase config at `src/firebase/firebase.config.js`:
```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  // ... other config
};
```

Start client:
```bash
npm run dev
# Client runs on http://localhost:5173
```

### 4️⃣ Access Application

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5002`

---

## 📂 Project Structure

```
Book-Store-WebApp/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── dashboard/       # Admin dashboard pages
│   │   ├── context/         # React context (Auth)
│   │   ├── firebase/        # Firebase config
│   │   ├── shop/            # Book browsing & details
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── server/                  # Express backend
│   ├── index.js            # Main server file
│   ├── scripts/            # Utility scripts
│   │   ├── check_users.js  # View all users
│   │   └── make_admin.js   # Promote user to admin
│   └── package.json
│
└── README.md
```

---

## 🎯 How It Works

### User Flow
1. **Browse** → User visits homepage and browses books
2. **Authentication** → Sign up/Login via email or Google
3. **Interact** → Rate books, read PDFs (requires login)
4. **Session** → Auto-logout after 2 hours or browser close

### Admin Flow
1. **Register** → Sign up with admin secret key (`bookstore_admin_2025`)
2. **Dashboard** → Access admin panel with analytics
3. **Manage** → Upload, edit, delete books
4. **Users** → Promote/demote user roles
5. **Analytics** → View statistics (books, users, ratings)

### Data Flow
```
User Action → React Component → API Request → Express Route → MongoDB Query → Response → UI Update
```

---

## 🔑 Admin Access

To become an admin during registration:
1. Go to **Sign Up** page
2. Fill in your details
3. Enter admin secret key: `bookstore_admin_2025`
4. Complete registration

---

## 📊 Database Collections

### `books`
- Book information (title, author, category, price, PDF URL)
- Ratings and views tracking

### `users`
- User profiles (UID, email, name, photo)
- Role (user/admin)
- Login timestamps

### `analytics`
- Real-time statistics
- View counts and rating aggregations

---

## 🌍 Deployment

### Deploy to Vercel

**Server:**
```bash
cd server
vercel --prod
```

**Client:**
```bash
cd client
vercel --prod
```

Update `client/src/utils/constants.js` with your server URL.

---

## 🔧 Environment Variables

### Server (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/BookInventory
ADMIN_SECRET_KEY=bookstore_admin_2025
PORT=5002
```

### Client (firebase.config.js)
```javascript
apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
```

---

## 📸 Screenshots

- Modern authentication pages with gradient backgrounds
- Responsive grid-based admin dashboard
- Mobile-friendly sidebar navigation
- In-browser PDF reader
- Toast notifications for all actions

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Tirtharaj Barma**
- GitHub: [@TirtharajBarma](https://github.com/TirtharajBarma)

---

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database
- Firebase for authentication
- Vercel for hosting
- Tailwind CSS for styling framework

---

**⭐ Star this repo if you find it helpful!**
