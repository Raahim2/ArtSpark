import React, { useEffect, useState } from 'react';
import { Button, Platform } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';
import { WEB_CLIENT_ID  , WEB_CLIENT_SECRET , WEB_REDIRECT_URI } from '@env';


export default function App() {
  const [accessToken, setAccessToken] = useState(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: WEB_CLIENT_ID,
      scopes: ['profile', 'email'],
      redirectUri: Platform.select({
        ios: WEB_REDIRECT_URI,
        android: WEB_REDIRECT_URI,
        default: WEB_REDIRECT_URI,
      }),
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      // Exchange the authorization code for an access token
      fetchAccessToken(code);
    }
  }, [response]);

  const fetchAccessToken = async (code) => {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: WEB_CLIENT_ID,
          client_secret: WEB_CLIENT_SECRET,
          redirect_uri: WEB_REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });
      const data = await response.json();
      setAccessToken(data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  return (
    <Button
      title="Login with Google"
      onPress={() => promptAsync()}
    />
  );
}
