import React, { useState, useCallback, useEffect } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import { LOCK_SCREEN_LOGO } from "../types";

interface LockScreenProps {
  onUnlock: (password: string) => boolean;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(() => {
    if (onUnlock(password)) {
      setError(false);
      setPassword("");
    } else {
      setError(true);
    }
  }, [password, onUnlock]);

  useEffect(() => {
    if (password.length > 0) {
      setError(false);
    }
  }, [password]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col items-center justify-center font-sans text-slate-800 px-4">
      <img
        src={LOCK_SCREEN_LOGO}
        alt="Hotel Talavera Logo"
        className="w-48 h-auto mb-8 select-none"
        draggable={false}
      />

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-serif text-center mb-6">Pantalla de Bloqueo</h2>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            autoFocus
            placeholder="Ingrese contraseña administrativa"
            className={`input input-bordered w-full px-4 py-2 rounded ${
              error ? "border-red-600" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            aria-label="Contraseña para desbloquear"
          />

          {error && (
            <p className="text-red-600 flex items-center gap-2 text-sm">
              <AlertTriangle size={16} />
              Contraseña incorrecta
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="bg-gold-500 hover:bg-gold-600 text-white font-semibold py-2 rounded transition-colors"
            aria-label="Desbloquear aplicación"
          >
            Desbloquear &nbsp; <Lock className="inline-block w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;