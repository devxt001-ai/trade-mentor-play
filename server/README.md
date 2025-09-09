# Trade Mentor Backend

This is the backend service for the Trade Mentor application, which integrates with the Fyers API to provide real-time stock market data and trading functionality.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   FYERS_CLIENT_ID=your_client_id
   FYERS_PIN=your_pin
   FYERS_TOTP_SECRET=your_totp_secret
   FYERS_REDIRECT_URL=your_redirect_url
   FYERS_APP_ID=your_app_id
   FYERS_SECRET_ID=your_secret_id
   PORT=5000
   NODE_ENV=development
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Authenticate with Fyers API
- `GET /api/auth/token` - Generate access token
- `GET /api/auth/verify` - Verify access token

### Market Data

- `GET /api/market/data` - Get market data for specified symbols
- `GET /api/market/quotes` - Get quotes for specified symbols
- `GET /api/market/history` - Get historical data for a symbol
- `GET /api/market/depth` - Get market depth for a symbol

### Trading

- `POST /api/trading/orders` - Place a new order
- `GET /api/trading/orders` - Get all orders
- `GET /api/trading/orders/:id` - Get status of a specific order
- `PUT /api/trading/orders/:id` - Modify an existing order
- `DELETE /api/trading/orders/:id` - Cancel an order

## Error Handling

All API endpoints return standardized error responses with appropriate HTTP status codes and error messages.

## Caching

The backend implements caching for frequently accessed data to improve performance and reduce API calls to Fyers.