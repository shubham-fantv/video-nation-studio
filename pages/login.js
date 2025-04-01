import React, { useState, useEffect } from "react";

const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Verify token and get user info
      fetchUserInfo(token);
    }
  }, []);

  // Fetch user information using the token
  const fetchUserInfo = async (token) => {
    try {
      // Replace with your API endpoint that returns user info
      const response = await fetch("https://api.videonation.xyz/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token might be invalid or expired
        localStorage.removeItem("auth_token");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  // Handle the Google login process
  const handleGoogleLogin = () => {
    setLoading(true);

    // Define popup dimensions and position
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    // Open the popup
    const popup = window.open(
      "https://api.videonation.xyz/api/v1/auth/google",
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Poll the popup location to detect the callback URL
    const popupTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupTimer);
        setLoading(false);
        return;
      }

      try {
        // This will throw an error if the popup is on a different domain due to CORS
        const popupUrl = popup.location.href;

        // Check if the popup URL contains the callback path
        if (popupUrl && popupUrl.includes("/api/v1/auth/google/callback")) {
          clearInterval(popupTimer);

          // Read response from the page content (assuming it's JSON)
          const responseText = popup.document.body.innerText;
          try {
            const responseData = JSON.parse(responseText);
            if (responseData.success && responseData.token) {
              localStorage.setItem("auth_token", responseData.token);
              fetchUserInfo(responseData.token);
              popup.close();
            }
          } catch (parseError) {
            setError("Failed to parse authentication response");
          }

          setLoading(false);
          popup.close();
        }
      } catch (e) {
        // Ignore CORS errors when checking the URL
        // This is expected when the popup navigates to Google's domain
      }
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <div className="auth-container text-white">
      {loading ? (
        <div>Authenticating...</div>
      ) : user ? (
        <div>
          <p>Welcome, {user.name || "User"}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleGoogleLogin} disabled={loading} className="google-login-button">
            <span className="google-icon">G</span>
            Sign in with Google
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
