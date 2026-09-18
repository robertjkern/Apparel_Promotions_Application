import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, User, Lock, Mail, Building, Phone, ShieldCheck, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Mode = 'signin' | 'signup';

// Simple math-based human verification
function useCaptcha() {
  const [a] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [b] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [answer, setAnswer] = useState('');
  const [verified, setVerified] = useState(false);

  const expected = a + b;

  const verify = () => {
    if (parseInt(answer, 10) === expected) {
      setVerified(true);
    }
  };

  return { a, b, answer, setAnswer, verify, verified, expected };
}

export default function Login() {
  const [mode, setMode] = useState<Mode>('signin');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', company: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const captcha = useCaptcha();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && !captcha.verified) {
      setError('Please complete the human verification first.');
      return;
    }

    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(form.email, form.password);
      setLoading(false);
      if (error) {
        setError(error);
        return;
      }
      navigate('/portal');
    } else {
      const { error } = await signUp(form.email, form.password, form.fullName, form.company, form.phone);
      setLoading(false);
      if (error) {
        setError(error);
        return;
      }
      navigate('/portal');
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setForm({ email: '', password: '', fullName: '', company: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sky-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-gray-900">PromoCraft</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-500 text-center">
            {mode === 'signin' ? 'Sign in to access your customer portal' : 'Register to start placing custom orders'}
          </p>

          {/* Mode tabs */}
          <div className="mt-6 flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="Jane Smith"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={form.company}
                        onChange={e => setForm({ ...form, company: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="(512) 555-0142"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Human verification */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Human Verification</label>
                {captcha.verified ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-emerald-700 font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <ShieldCheck className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{captcha.a} + {captcha.b} =</span>
                    <input
                      type="number"
                      value={captcha.answer}
                      onChange={e => captcha.setAnswer(e.target.value)}
                      onBlur={captcha.verify}
                      className="w-20 px-2 py-1 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="?"
                    />
                    <button
                      type="button"
                      onClick={captcha.verify}
                      className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors shadow-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sky-600 hover:text-sky-700 font-semibold"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return <Check className={className} />;
}
