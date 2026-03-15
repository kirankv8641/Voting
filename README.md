# 🗳️ Voting System API

A backend voting system built with **Node.js, Express, and MongoDB** that allows users to vote for candidates while ensuring each user can vote only once. The system also supports authentication and role-based access control for admins.

---

## 🚀 Features


* User authentication using **JWT**
* Admin can create and manage candidates
* Users can vote for a candidate
* Each user can **vote only once**
* Vote counting and results API
* Secure routes using middleware
* MongoDB database integration

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT Authentication**
* **Postman (API testing)**

---

## 📂 Project Structure

```
Voting
│
├── models
│   ├── user.js
│   └── candidate.js
│
├── routes
│   ├── userRoutes.js
│   └── candidateRoutes.js
│
├── jwt.js
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

1️⃣ Clone the repository

```
git clone https://github.com/kirankv8641/Voting.git
```

2️⃣ Navigate to the project folder

```
cd Voting
```

3️⃣ Install dependencies

```
npm install
```

4️⃣ Create `.env` file

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

5️⃣ Start the server

```
npm start
```

---

## 📡 API Endpoints

### Authentication

**Register User**

```
POST /signup
```

**Login**

```
POST /login
```

---

### Candidates

**Get All Candidates**

```
GET /candidates
```

**Add Candidate (Admin only)**

```
POST /candidates
```

---

### Voting

**Vote for a Candidate**

```
POST /vote/:candidateId
```

Rules:

* A user can vote **only once**
* Admin **cannot vote**

---

### Vote Results

**Get Vote Count**

```
GET /vote/count
```

---

## 🔒 Security

* JWT authentication middleware
* Role-based access (admin / user)
* Prevent multiple votes from same user

---

## 🧪 Testing

Use **Postman** to test APIs.

Example:

```
Authorization: Bearer <your_token>
```

---

## 📌 Future Improvements

* Voting analytics dashboard
* Candidate images
* Real-time voting results
* Admin panel
* Rate limiting for vote security

---

## 👨‍💻 Author

**Kiran Vishwakarma**

GitHub:
https://github.com/kirankv8641

---

⭐ If you like this project, consider giving it a **star**!
