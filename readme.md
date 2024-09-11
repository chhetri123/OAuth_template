# OAuth Authentication Template with Passport.js

This project is a flexible OAuth template built with **Passport.js** and **Express.js**. It allows you to integrate multiple OAuth providers (e.g., Google, Facebook, Twitter, GitHub, etc.) by simply adding your `Client ID`, `Client Secret`, and `Callback URL`.

## Features

- Supports multiple OAuth providers (Google, Facebook, Twitter, GitHub, and more)
- Easy to extend with new OAuth strategies
- Fully reusable code with minimal configuration
- Uses Passport.js for OAuth strategies and Express.js for API routing
- Token-based authentication ( Mannual JWT and can be configured into session-based authentication)
- Modular structure for clean code and scalability

## How It Works

1. Add your **OAuth client ID** and **client secret** for the desired provider.
2. Set up the **callback URL** route in the project.
3. The template will handle authentication with the provider, retrieving user profile data (e.g., email, name).

## Folder Structure

```
/oauth-template
│
├── /config
│   └── config.js                 # Add the enviroment variables
├── /routes
│   └── auth.js                   # Authentication routes for each provider
├── /controller
│   └── auth.controller.js        # Controller to handle OAuth callbacks
├── /middlewares
│   └── oauth.middleware.js       # based on the provider add , create a middleware
├── dev.env                       # Dev Environment variables for OAuth credentials
├── prod.env                      # Production Environment variables for OAuth credentials
├── index.js                      # Main server file
├── package.json                  # Project dependencies
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/chhetri123/OAuth_template.git
cd oauth-template
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
DB_URL=
PORT=8001
JWT_SECRET=
JWT_EXPIRATION=
JWT_ISSUER=


# Example for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8001/api/auth/google/callback

# Example for GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8001/api/auth/github/callback


SESSION_SECRET=your_session_secret
```

### 4. Add OAuth Strategy

Each OAuth provider will need its own strategy setup. Open the `password.js` file in the `/utils` folder and add your strategy, or use one of the pre-configured providers (Google, Facebook, GitHub).

```js
// Example: Google OAuth Strategy
google: {
    Strategy: GoogleStrategy,
    clientID: config.google_client_id,
    clientSecret: config.google_client_secret,
    callbackURL: config.google_callback_url,
  },
```

### 5. Add Callback Route

You need to add the callback route in the `auth.route.js` file under `/routes`. Each OAuth provider will require a route like this:

```js
// Example: Google OAuth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" })
);
```

### 6. Start the Server

Run the server using the following command:

```bash
npm start
```

By default, the server will run on `http://localhost:8001`.

### 7. Test Authentication

You can test the OAuth login using Postman or a browser by navigating to the authentication routes. For example:

- **Google OAuth**: `http://localhost:8001/api/auth/google`
- **GitHub OAuth**: `http://localhost:8001/api/auth/github`

## Future Enhancements

- **Add More Providers**: Easily extend this template with more providers such as Twitter, LinkedIn, etc.
- **Error Handling**: Improve error handling and user feedback for failed authentications.
- **Database Integration**: Integrate a database (MongoDB, PostgreSQL, etc.) to store user information after successful authentication.

## License

This project is open-source and available under the MIT License.
