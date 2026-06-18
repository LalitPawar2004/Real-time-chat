# 🔒 Real Time Chat

A real-time end-to-end encrypted chat application built with the MERN stack and Socket.io. Messages are encrypted using AES-256-GCM before transmission, ensuring only the intended recipients can read them.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![Encryption](https://img.shields.io/badge/Encryption-AES--256--GCM-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔐 **End-to-End Encryption** – AES-256-GCM encryption via Web Crypto API
- ⚡ **Real-time Messaging** – Instant delivery with Socket.io
- 📱 **Fully Responsive** – Works on desktop, tablet, and mobile
- 🟢 **Online Presence** – See who's online in real-time
- ✓✓ **Read Receipts** – Sent, delivered, and read status
- ⌨️ **Typing Indicators** – Know when someone is typing
- 🖼️ **Image Sharing** – Send and receive images securely
- 👥 **Group Chats** – Create and manage group conversations
- 🔑 **JWT Authentication** – Secure login and registration
- 🏠 **Landing Page** – Professional homepage with feature showcase

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   MongoDB   │
│  (Vercel)   │◀────│  (Render)   │◀────│  (Atlas)    │
│  React+Vite │     │ Express+IO  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
        │
        ▼
 ┌─────────────┐
 │  Encryption │  (Client-side only)
 │  AES-256    │  Server never sees plaintext
 └─────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Bootstrap 5, React Router 6 |
| **Backend** | Node.js, Express, Socket.io |
| **Database** | MongoDB with Mongoose |
| **Encryption** | Web Crypto API (AES-256-GCM) |
| **Auth** | JWT, bcryptjs |
| **File Upload** | Multer |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 📁 Project Structure

```
secureChat/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.jsx   # Main chat area
│   │   │   │   ├── Sidebar.jsx      # Conversation list
│   │   │   │   └── NewChatModal.jsx # New conversation modal
│   │   │   └── ProtectedRoute.jsx   # Auth guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   ├── ChatContext.jsx      # Chat & encryption logic
│   │   │   └── SocketContext.jsx    # Socket.io connection
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   └── Chat.jsx            # Main chat layout
│   │   ├── utils/
│   │   │   └── encryption.js       # AES encryption utilities
│   │   ├── App.jsx                 # Routes
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   # Login/Register logic
│   │   │   ├── chatController.js   # Chat CRUD
│   │   │   └── userController.js   # User search
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT middleware
│   │   │   └── upload.js           # Multer config
│   │   ├── models/
│   │   │   ├── Conversation.js     # Conversation schema
│   │   │   ├── Message.js          # Message schema
│   │   │   └── User.js             # User schema
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── chat.js
│   │   │   └── user.js
│   │   ├── utils/
│   │   │   └── generateToken.js    # JWT helper
│   │   └── index.js                # Server entry point
│   └── package.json
│
└── uploads/                         # Uploaded images
```

## 🔐 How Encryption Works

1. **Key Derivation** – A 256-bit key is derived using PBKDF2 with 100,000 iterations
2. **Encryption** – Messages are encrypted using AES-256-GCM before sending
3. **Transmission** – Only encrypted ciphertext travels over Socket.io
4. **Storage** – MongoDB stores encrypted text; server never has plaintext
5. **Decryption** – Recipient's browser decrypts the message locally

```
Sender:                    Network/Server:          Recipient:
┌──────────┐              ┌──────────┐             ┌──────────┐
│ "Hello"  │──encrypt()──▶│ "a7x9k2" │──decrypt()─▶│ "Hello"  │
└──────────┘              └──────────┘             └──────────┘
```

> ⚠️ **Note:** For production, replace the shared secret with proper ECDH key exchange to ensure unique keys per conversation.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Environment Variables

**Server (`server/.env`)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/securechat
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env`)**
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd secureChat

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start development servers
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🌐 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`
6. Set root directory to `server`

### Frontend (Vercel)

1. Import project to Vercel
2. Set root directory to `client`
3. Framework preset: Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`

### MongoDB (Atlas)

1. Create a free cluster on MongoDB Atlas
2. Whitelist your Render IP or allow all (0.0.0.0/0)
3. Copy connection string to `MONGO_URI` env variable

## 📱 Responsive Behavior

| Screen Size | Layout |
|-------------|--------|
| **Desktop** (>768px) | Sidebar (320px) + Chat window side by side |
| **Mobile** (<768px) | Full-screen sidebar OR full-screen chat with back button |

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** with bcryptjs (10 salt rounds)
- **AES-256-GCM Encryption** for messages
- **CORS** restricted to frontend origin
- **Socket.io Auth** middleware validates JWT on connection
- **Protected Routes** on frontend via React Router

## 🎯 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/users` | Search users | Yes |
| GET | `/api/chat/conversations` | Get conversations | Yes |
| POST | `/api/chat/conversations` | Create conversation | Yes |
| GET | `/api/chat/conversations/:id/messages` | Get messages | Yes |
| POST | `/api/chat/upload` | Upload image | Yes |

## 🎨 Color Palette

| Element | Color |
|---------|-------|
| Primary | `#0d6efd` (Bootstrap Blue) |
| Sent Message | `#d9fdd3` (Light Green) |
| Received Message | `#ffffff` (White) |
| Background | `#e5ddd5` (WhatsApp-style) |
| Encryption Badge | `#198754` (Green) |

## 📝 License

MIT License - Feel free to use and modify.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ using React, Express, and Socket.io**
