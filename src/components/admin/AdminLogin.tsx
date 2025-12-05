import { useState } from "react";
import { Shield, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_PIN = "1980";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onSuccess();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div 
        className={`relative w-full max-w-md ${isShaking ? 'animate-shake' : ''}`}
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-brand mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">ZLAQA Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your PIN to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent" />
                Security PIN
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                maxLength={4}
                className={`text-center text-2xl tracking-[0.5em] font-mono h-14 ${
                  error ? 'border-destructive ring-destructive/20 ring-2' : 'border-border'
                }`}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1 justify-center">
                  <AlertCircle className="h-3 w-3" />
                  Invalid PIN. Please try again.
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-brand hover:opacity-90 text-foreground font-semibold"
              disabled={pin.length !== 4}
            >
              Access Dashboard
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Protected admin area. Unauthorized access prohibited.
          </p>
        </div>
      </div>

      {/* Add shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
