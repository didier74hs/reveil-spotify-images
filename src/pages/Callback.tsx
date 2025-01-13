import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";

const Callback = () => {
  const navigate = useNavigate();
  const { token } = useSpotifyAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Connexion en cours...</p>
    </div>
  );
};

export default Callback;