# SecureAuth – User Authentication & JWT

A beginner-friendly full-stack authentication project for the Workora Labs internship task.

## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT creation and verification
- JWT stored in an **HTTP-only cookie** (not readable by frontend JavaScript)
- Protected `GET /api/profile` route
- Logout by clearing the authentication cookie
- MySQL persistence, parameterized SQL queries and basic login/register rate limiting
- Responsive HTML, CSS and JavaScript frontend

## Technology

Node.js, Express, MySQL, bcryptjs, jsonwebtoken, HTML, CSS and JavaScript.

## Requirements

- Node.js 18 or newer
- MySQL Server 8 or compatible MySQL installation
- VS Code (recommended)

## 1. Create the database

Open MySQL Workbench or the MySQL command line and run the SQL in `database/schema.sql`.

The script creates the `workora_auth` database and the `users` table.

## 2. Configure environment variables

In the project root, make a copy of `.env.example` and name the copy `.env`.

Update `DB_USER` and `DB_PASSWORD` to match your local MySQL setup. Change `JWT_SECRET` to a long, random secret (at least 32 characters). Do not share or commit `.env`.

Example:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=workora_auth
JWT_SECRET=use_a_long_random_secret_string_here_123456
JWT_EXPIRES_IN=1d
```

## 3. Install and run

Open this folder in VS Code. In the terminal:

```bash
npm install
npm run dev
```

For normal start (without auto-restart):

```bash
npm start
```

Open **http://localhost:5000** in your browser.

## 4. Test the application

1. Select **Create account** and register with a name, email and password (8–72 characters).
2. Log in using the same email and password.
3. The protected dashboard displays the account profile.
4. Click **Log out**. The protected profile route should no longer be accessible.

## API endpoints

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Create account; hashes password with bcrypt | No |
| POST | `/api/auth/login` | Verify password and issue JWT cookie | No |
| POST | `/api/auth/logout` | Clear JWT cookie | No |
| GET | `/api/profile` | Return the signed-in user's profile | Yes |
| GET | `/api/health` | Check server and database connection | No |

### Example registration JSON

```json
{
  "name": "Sangamesh",
  "email": "sangamesh@example.com",
  "password": "examplePass123"
}
```

### Example login JSON

```json
{
  "email": "sangamesh@example.com",
  "password": "examplePass123"
}
```

The login response sets a cookie named `token`. It is marked `HttpOnly` and `SameSite=Strict`; in production it is also marked `Secure`.

## Project structure

```text
user-auth-jwt-project/
├── database/
│   └── schema.sql
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── routes/
│       ├── authRoutes.js
│       └── userRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Notes before deployment

- Use a managed MySQL database for a hosted deployment and configure its connection values in the hosting provider's environment-variable settings.
- Set `NODE_ENV=production` in production so the authentication cookie uses the `Secure` flag. Serve the app over HTTPS.
- Set a unique, high-entropy `JWT_SECRET`; never commit `.env` or expose secrets in screenshots or source code.
- This is an internship learning project, not a complete production identity platform. For a production system, add CSRF protection appropriate to the cookie setup, email verification, password reset, account lockout/monitoring, and stronger operational logging.

## Submission checklist

- [ ] App runs locally
- [ ] Registration and login tested
- [ ] Wrong password is rejected
- [ ] Protected profile works only when logged in
- [ ] Logout clears the session
- [ ] Push source code to your GitHub repository
- [ ] Deploy the app and add production environment variables
- [ ] Test the deployed URL and submit GitHub + live app URLs to the internship portal
