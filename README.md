# URL Shortener and Analytics API

This project is a URL shortener application with advanced analytics features. It allows users to shorten URLs and track usage data such as unique clicks, device types, operating systems, and more. The API is built using Node.js, Express, and MongoDB.

## Features

- **Shorten URLs:** Create custom short URLs.
- **URL Analytics:** Get detailed analytics for each shortened URL, including:
  - Total clicks
  - Unique users (based on IP)
  - Clicks by device type and operating system
  - Daily clicks (last 7 days)
- **User Authentication:** Google OAuth integration for user authentication.
- **Refresh Token:** Support for refreshing access tokens.
- **API Documentation:** Interactive API documentation using Swagger.

## Technologies Used

- **Backend Framework:** Node.js, Express
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** Passport.js (Google OAuth)
- **API Documentation:** Postman
- **Validation:** Zod
- **Rate Limiting:** Custom middleware
- **CORS:** Configured for specific origins

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB instance (local or hosted, e.g., MongoDB Atlas)
- Google Cloud Console credentials for OAuth

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/suraj171299/URL_Shortener_Project.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=8080(local development)
   MONGO_URI=your_mongo_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:8080,http://your-hosted-url.com
   API_KEY=api key for ipinfo
   BASE_URL="base url of your app"
   ACCESS_TOKEN_SECRET=your_access_token
   ACCESS_TOKEN_EXPIRY=your_token_expiry
   REFRESH_TOKEN_SECRET=your_refresh_token
   REFRESH_TOKEN_EXPIRY=your_token_expiry 
   REDIS_URL=your_redis_url
   ```

4. Start the server:
   ```bash
   npm start
   ```

### API Endpoints

#### **Authentication**
- `GET /api/auth/google` - Initiates Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/refresh-token` - Refreshes the access token

#### **URL Shortening**
- `POST /api/shorten` - Shorten a URL (Optional: Custom Alias)
  ```json
  {
    "longUrl": "https://example.com",
    "customAlias": "exampleAlias",
    "topic": "exampleTopic"
  }
  ```
- `GET /api/shorten/:alias` - Redirect to the original URL

#### **Analytics**
- `GET /api/analytics/alias/:alias` - Analytics for a specific alias
- `GET /api/analytics/topic/:topic` - Analytics for all URLs under a topic
- `GET /api/analytics/overall` - Overall analytics for the application

### Analytics Details

- **Unique Clicks:** Determined by unique IP addresses.
- **Clicks by Device Type:** Tracked and categorized by device.
- **Clicks by OS:** Detailed clicks by the operating system.
- **Daily Clicks:** Data tracked for the past 7 days.

### Middleware

- **Validation:** Zod schemas for input validation.
- **Rate Limiting:** Custom middleware to limit requests.
- **CORS:** Configured to allow requests from specific origins.

### API Documentation

- Postman documentation is available at `https://documenter.getpostman.com/view/17115273/2sAYJ7gzNL`.

## Development

### Running in Development Mode

1. Start the server in development mode:
   ```bash
   npm run dev
   ```

2. Access the API at `http://localhost:8080`.

### Testing

- Used tools like Postman to test the endpoints.

## Deployment

1. Deploy the application to a hosting platform (e.g., Heroku, AWS, or Render).
2. Update the `.env` file with the production database and OAuth credentials.
3. Ensure the `CORS_ORIGIN` variable includes your production domain.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

