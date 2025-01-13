export const SPOTIFY_CONFIG = {
  CLIENT_ID: "your_client_id", // À remplacer par votre Client ID
  REDIRECT_URI: window.location.origin + "/callback",
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  RESPONSE_TYPE: "token",
  SCOPES: [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-playback-state",
    "user-modify-playback-state",
  ].join(" "),
};

export const getSpotifyAuthUrl = () => {
  return `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?client_id=${
    SPOTIFY_CONFIG.CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    SPOTIFY_CONFIG.REDIRECT_URI
  )}&response_type=${SPOTIFY_CONFIG.RESPONSE_TYPE}&scope=${encodeURIComponent(
    SPOTIFY_CONFIG.SCOPES
  )}`;
};