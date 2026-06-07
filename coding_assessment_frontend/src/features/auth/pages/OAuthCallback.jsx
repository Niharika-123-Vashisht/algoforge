import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../../../utils/token.js";
import LoadingState from "../../../components/LoadingState.jsx";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");
    const err = params.get("error");

    if (err) {
      setError("Google login failed.");
      return;
    }

    if (access && refresh) {
      setTokens(access, refresh);
      window.location.replace("/problems");
      return;
    }

    setError("Missing token data.");
  }, [navigate]);

  if (error) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-sm">
        {error}
      </div>
    );
  }

  return <LoadingState label="Signing you in..." />;
}
