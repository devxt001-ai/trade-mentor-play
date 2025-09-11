# Fyers API Setup Guide

## Current Status

The application is currently configured to use **mock authentication and data** for demonstration purposes. This allows the app to run without requiring real Fyers API credentials or completing the OAuth flow.

## Mock vs Real Authentication

### Mock Authentication (Current)
- ✅ Works immediately without setup
- ✅ Returns realistic mock market data
- ✅ Perfect for development and testing
- ❌ Not real market data
- ❌ Cannot place real trades

### Real Authentication (Production)
- ✅ Real market data from Fyers
- ✅ Can place actual trades
- ❌ Requires Fyers account and API credentials
- ❌ Requires manual OAuth flow completion

## Setting Up Real Fyers Authentication

### Step 1: Get Fyers API Credentials

1. Create a Fyers trading account at [https://fyers.in](https://fyers.in)
2. Apply for API access through Fyers support
3. Once approved, you'll receive:
   - `CLIENT_ID`
   - `APP_ID` 
   - `SECRET_ID`
   - Your trading `PIN`
   - `TOTP_SECRET` (for 2FA)

### Step 2: Update Environment Variables

Replace the mock values in `.env` with your real credentials:

```env
# Replace these with your actual Fyers credentials
FYERS_CLIENT_ID="your_client_id"
FYERS_APP_ID="your_app_id"
FYERS_SECRET_ID="your_secret_id"
FYERS_PIN="your_trading_pin"
FYERS_TOTP_SECRET="your_totp_secret"
FYERS_REDIRECT_URI="https://trade.fyers.in/api-login/redirect-uri/index.html"
```

### Step 3: Complete OAuth Flow

The Fyers API requires a manual OAuth flow:

1. **Generate Auth URL**: The app generates an authorization URL
2. **User Login**: User visits the URL and logs into Fyers
3. **Get Auth Code**: Fyers redirects with an authorization code
4. **Exchange for Token**: App exchanges the code for an access token

### Step 4: Modify Authentication Service

To use real authentication, update `server/services/authService.js`:

1. Remove the mock token generation
2. Implement the full OAuth flow
3. Handle the authorization code from the redirect
4. Store and refresh tokens properly

## API Endpoints

### Authentication
- `POST /api/auth/test` - Test authentication (returns mock token)
- `POST /api/auth/login` - Login with Fyers (needs implementation)

### Market Data
- `GET /api/market/quotes?symbols=NSE:TCS-EQ,NSE:INFY-EQ` - Get stock quotes
- `GET /api/market/data?symbols=NSE:TCS-EQ,NSE:INFY-EQ` - Get market data
- `GET /api/market/stocks` - Get available stocks

## Testing the Current Setup

```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/test

# Test market data
curl "http://localhost:5000/api/market/quotes?symbols=NSE:TCS-EQ,NSE:INFY-EQ"

# Test quotes
curl "http://localhost:5000/api/market/data?symbols=NSE:TCS-EQ,NSE:INFY-EQ"
```

## Important Notes

1. **Mock Data**: Current implementation returns realistic but fake market data
2. **Rate Limits**: Real Fyers API has rate limits - implement proper caching
3. **Error Handling**: Add robust error handling for network issues
4. **Security**: Never commit real API credentials to version control
5. **Testing**: Always test with paper trading before live trading

## Troubleshooting

### Common Issues

1. **"Authentication failed"** - Check if credentials are correct
2. **"Invalid Request"** - Ensure using correct API endpoints and methods
3. **"Rate limit exceeded"** - Implement proper request throttling
4. **"Token expired"** - Implement token refresh logic

### Debug Mode

The current implementation includes detailed logging. Check server console for:
- Authentication flow steps
- API request/response details
- Error messages and stack traces

## Production Checklist

- [ ] Obtain real Fyers API credentials
- [ ] Update environment variables
- [ ] Implement complete OAuth flow
- [ ] Add token refresh mechanism
- [ ] Implement proper error handling
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Test with paper trading
- [ ] Security audit

---

**Current Status**: ✅ Mock authentication working, ready for development
**Next Step**: Obtain Fyers API credentials for production use