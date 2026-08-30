# 📚 DocVault

DocVault is a full-stack document management application that allows authenticated users to securely upload, manage, preview, download, search, edit, and delete their documents.

## ✨ Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 🛡️ Protected routes
* 📤 Document upload
* 📋 View personal documents
* 🔍 Search documents
* 👁️ Document preview
* ⬇️ Document download
* ✏️ Edit document title
* 🗑️ Delete documents
* 📦 File size validation
* 🚪 Secure logout
* 📱 Responsive UI

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer

## 📁 Project Structure

```text
DocVault/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd DocVault
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Never commit your `.env` file to GitHub.

## ▶️ Running the Project

### Start Backend

From the `server` directory:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

From the `client` directory:

```bash
npm run dev
```

The frontend will run on the Vite development URL shown in your terminal.

## 🔒 Authentication

DocVault uses JWT-based authentication.

Protected API routes require a valid access token.

Users can:

* Register
* Login
* Access their documents
* Logout

## 📄 Document Management

Authenticated users can:

1. Upload documents
2. View uploaded documents
3. Search documents
4. Preview documents
5. Download documents
6. Edit document titles
7. Delete documents

Uploaded files are stored on the server and document metadata is stored in MongoDB.

## 🚧 Future Improvements

* Forgot password / reset password
* Email-based password reset
* Better file type support
* User profile management
* Cloud file storage
* Document sharing
* Folders and categories
* Pagination
* Advanced search and filtering

## 👨‍💻 Author

Built as a full-stack web development project using the MERN stack.
