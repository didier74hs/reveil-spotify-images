import { Button } from "./ui/button";
import { getSpotifyAuthUrl } from "../config/spotify";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";

const SpotifyAuthButton = () => {
  const { token, logout } = useSpotifyAuth();

  if (token) {
    return (
      <Button variant="outline" onClick={logout} className="w-full">
        Se déconnecter de Spotify
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => window.location.href = getSpotifyAuthUrl()}
      className="w-full"
    >
      Se connecter à Spotify
    </Button>
  );
};

export default SpotifyAuthButton;