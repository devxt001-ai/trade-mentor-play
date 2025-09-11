import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { fyersModel as FyersAPI } from "fyers-api-v3";
import NodeCache from "node-cache";
import { authenticator } from "otplib";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://gruioififeukeqmlwuup.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydWlvaWZpZmV1a2VxbWx3dXVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA5NDkxNywiZXhwIjoyMDcyNjcwOTE3fQ.service_role_key_placeholder";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cache for storing tokens (TTL: 1 hour)
const tokenCache = new NodeCache({ stdTTL: 3600 });

// Environment variables
const APP_ID = process.env.FYERS_APP_ID || "6BQQUK21RL-100";
const SECRET_KEY = process.env.FYERS_SECRET_ID || "0OITL01M6R";
const REDIRECT_URI =
  process.env.FYERS_REDIRECT_URI ||
  "https://127.0.0.1:3000/";
const TOTP_SECRET = process.env.FYERS_TOTP_SECRET || "J3272VEVVSUWMIXJCBNFEJH7AAI2CBRS";

// Initialize Fyers API
const fyers = new FyersAPI();
fyers.setAppId(APP_ID);
fyers.setRedirectUrl(REDIRECT_URI);

console.log("🔧 Auth Service Configuration:");
console.log("- APP_ID:", APP_ID);
console.log("- REDIRECT_URI:", REDIRECT_URI);
console.log("- Supabase URL:", supabaseUrl);

/**
 * Generate TOTP code using the provided secret
 * @returns {string} TOTP code
 */
const generateTOTP = () => {
  return authenticator.generate(TOTP_SECRET);
};

/**
 * Generate unique 7-character alphanumeric client ID
 */
const generateClientId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Register new user with Supabase Auth and generate client ID
 */
const registerUser = async (email, password, fullName) => {
  try {
    console.log("👤 Registering new user:", email);

    // Create user with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      throw new Error(`Auth registration failed: ${authError.message}`);
    }

    // Generate unique client ID
    let clientId;
    let isUnique = false;

    while (!isUnique) {
      clientId = generateClientId();
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("client_id")
        .eq("client_id", clientId)
        .single();

      if (!existingProfile) {
        isUnique = true;
      }
    }

    // Create user profile with client ID
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: authData.user.id,
        email,
        full_name: fullName,
        client_id: clientId,
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    console.log("✅ User registered successfully with client ID:", clientId);

    return {
      success: true,
      user: {
        id: authData.user.id,
        email,
        full_name: fullName,
        client_id: clientId,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
        fyers_access_token: profileData.fyers_access_token || null,
      },
    };
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
};

/**
 * Login user with email/client_id and password
 */
const loginUser = async (identifier, password) => {
  try {
    console.log("🔐 Attempting login for:", identifier);

    let email = identifier;

    // Check if identifier is a client ID (7 chars alphanumeric)
    if (/^[A-Z0-9]{7}$/.test(identifier)) {
      console.log("🆔 Login with client ID detected");

      // Get email from client ID
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("client_id", identifier)
        .single();

      if (profileError || !profile) {
        throw new Error("Invalid client ID");
      }

      email = profile.email;
      console.log("📧 Found email for client ID:", email);
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();

    if (profileError) {
      throw new Error(`Profile fetch failed: ${profileError.message}`);
    }

    console.log("✅ User logged in successfully");

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: profile.email,
        full_name: profile.full_name,
        client_id: profile.client_id,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        fyers_access_token: profile.fyers_access_token || null,
      },
      session: authData.session,
    };
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
};

/**
 * Generate Fyers OAuth URL
 */
const generateFyersAuthUrl = async (userId) => {
  try {
    console.log("🔗 Generating Fyers OAuth URL for user:", userId);

    // Generate state parameter for security
    const state = `${userId}_${Date.now()}`;

    // Generate Fyers auth URL
    const authUrl = fyers.generateAuthCode();

    console.log("✅ Generated Fyers auth URL:", authUrl);

    return {
      success: true,
      authUrl,
      state,
    };
  } catch (error) {
    console.error("❌ Error generating Fyers auth URL:", error.message);
    throw error;
  }
};

/**
 * Exchange Fyers auth code for access token
 */
const exchangeFyersAuthCode = async (authCode, userId) => {
  try {
    console.log("🎫 Exchanging Fyers auth code for access token");

    // Use Fyers API to generate access token
    const tokenResponse = await fyers.generate_access_token({
      secret_key: SECRET_KEY,
      auth_code: authCode,
    });

    if (tokenResponse.s !== "ok") {
      throw new Error(`Fyers token exchange failed: ${tokenResponse.message}`);
    }

    // Store token in cache with user association
    const cacheKey = `fyers_token_${userId}`;
    tokenCache.set(cacheKey, {
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Also store the access token in the user's profile in the database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        fyers_access_token: tokenResponse.access_token,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("❌ Failed to update profile with Fyers token:", updateError.message);
      // Don't throw error here as the token is still cached and functional
    }

    console.log("✅ Fyers token generated, cached, and stored in database successfully");

    return {
      success: true,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
    };
  } catch (error) {
    console.error("❌ Fyers token exchange error:", error.message);
    throw error;
  }
};

/**
 * Get Fyers access token for user
 */
const getFyersToken = (userId) => {
  const cacheKey = `fyers_token_${userId}`;
  const tokenData = tokenCache.get(cacheKey);

  if (!tokenData) {
    throw new Error(
      "No Fyers token found. Please complete Fyers authentication."
    );
  }

  if (Date.now() > tokenData.expires_at) {
    tokenCache.del(cacheKey);
    throw new Error("Fyers token expired. Please re-authenticate.");
  }

  return tokenData.access_token;
};

/**
 * Verify Supabase session token
 */
const verifySession = async (sessionToken) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(sessionToken);

    if (error || !user) {
      throw new Error("Invalid session token");
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw new Error("Profile not found");
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: profile.email,
        full_name: profile.full_name,
        client_id: profile.client_id,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        fyers_access_token: profile.fyers_access_token || null,
      },
    };
  } catch (error) {
    console.error("❌ Session verification error:", error.message);
    throw error;
  }
};

/**
 * Logout user and clear tokens
 */
const logoutUser = async (userId, sessionToken) => {
  try {
    // Sign out from Supabase
    await supabase.auth.admin.signOut(sessionToken);

    // Clear Fyers token from cache
    const cacheKey = `fyers_token_${userId}`;
    tokenCache.del(cacheKey);

    console.log("✅ User logged out successfully");

    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    throw error;
  }
};

// Export all functions
export {
  registerUser,
  loginUser,
  generateFyersAuthUrl,
  exchangeFyersAuthCode,
  getFyersToken,
  verifySession,
  logoutUser,
};
