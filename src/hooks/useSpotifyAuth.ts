import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export const useSpotifyAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        ?.split("=")[1];

      if (token) {
        setToken(token);
        localStorage.setItem("spotify_token", token);
        window.location.hash = "";
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté à Spotify",
        });
      }
    }

    const storedToken = localStorage.getItem("spotify_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("spotify_token");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté de Spotify",
    });
  };

  return { token, logout };
};