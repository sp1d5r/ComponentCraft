import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "../components/shadcn/button"
import { Input } from "../components/shadcn/input"
import { Label } from "../components/shadcn/label"
import { Checkbox } from "../components/shadcn/checkbox"
import { useAuth } from '../contexts/AuthenticationProvider';

export const Authentication: React.FC = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') === 'sign-up' ? 'sign-up' : 'login';
    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === 'sign-up') {
            if (password !== confirmPassword) {
                setError("Passwords don't match");
                return;
            }
            register(email, password, name, 
                () => navigate('/dashboard'),
                (error) => setError(error.message)
            );
        } else {
            login(email, password, 
                () => navigate('/dashboard'),
                (error) => setError(error.message)
            );
        }
    };

    return (
      <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-8">
            <div>
              <h2 className="text-3xl font-medium tracking-tight">
                {mode === 'sign-up' ? 'Create your account' : 'Welcome back'}
              </h2>
            </div>

            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 h-12 rounded-lg font-normal"
                onClick={() => loginWithGoogle(() => navigate('/dashboard'), (error) => setError(error.message))}
              >
                <img src="/google-logo.webp" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Enter email address"
                className="h-12 rounded-lg bg-gray-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              {mode === 'sign-up' && (
                <Input
                  type="text"
                  placeholder="Your name"
                  className="h-12 rounded-lg bg-gray-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <Input
                type="password"
                placeholder="Password"
                className="h-12 rounded-lg bg-gray-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {mode === 'sign-up' && (
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="h-12 rounded-lg bg-gray-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full h-12 rounded-lg font-normal">
                {mode === 'sign-up' ? 'Create account' : 'Continue'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                {mode === 'sign-up' ? 'Already have an account? ' : "Don't have an account? "}
                <a 
                  href={mode === 'sign-up' ? '/authentication?mode=login' : '/authentication?mode=sign-up'} 
                  className="text-black font-medium"
                >
                  {mode === 'sign-up' ? 'Sign in' : 'Sign up'}
                </a>
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to ComponentCraft's{' '}
              <a href="/terms" className="underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Right side with scrolling columns */}
        <div className="hidden lg:block relative bg-black overflow-hidden">
          {/* Container for all columns with rotation */}
          <div className="absolute inset-0 transform rotate-[45deg] scale-125">
            {/* Center the content both vertically and horizontally */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center gap-3">
              {[0, 1, 2, 3, 4, 5, 6].map((col) => (
                <div 
                  key={col}
                  className={`flex flex-col gap-3 w-[160px]
                    ${col % 2 === 0 ? 'animate-slide-up' : 'animate-slide-down'}`}
                  style={{
                    animationDelay: `${col * -2}s`
                  }}
                >
                  {/* First set of phones */}
                  <div className="flex flex-col gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-[160px] h-[320px] rounded-[1.5rem] overflow-hidden transform 
                          hover:scale-105 transition-transform duration-600 shadow-2xl"
                      >
                        <img 
                          src={`https://picsum.photos/320/640?random=${col * 6 + i}`}
                          alt="App interface"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="flex flex-col gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={`dup-${i}`} 
                        className="w-[160px] h-[320px] rounded-[1.5rem] overflow-hidden transform 
                          hover:scale-105 transition-transform duration-600 shadow-2xl"
                      >
                        <img 
                          src={`https://picsum.photos/320/640?random=${col * 6 + i + 42}`}
                          alt="App interface"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}