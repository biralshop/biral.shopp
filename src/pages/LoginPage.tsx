import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Eye, EyeOff, ShieldCheck, ShoppingBag, Heart, Mail, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const updateForm = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Email/istifadəçi adı və şifrəni daxil edin');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Uğurla daxil oldunuz!');
      navigate('/hesab');
    } catch (err: any) {
      toast.error(err.message || 'Giriş uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error('Bütün sahələri doldurun');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Şifrə minimum 6 simvol olmalıdır');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Şifrələr uyğun gəlmir');
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        username: form.username || undefined,
        phone: form.phone || undefined,
        password: form.password,
      });
      toast.success('Hesab yaradıldı! Email-ə təsdiq kodu göndərildi.');
      setMode('verify');
    } catch (err: any) {
      toast.error(err.message || 'Qeydiyyat uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (otpCode.length !== 6) {
      toast.error('6 rəqəmli kodu daxil edin');
      return;
    }
    setLoading(true);
    try {
      await authAPI.verifyEmail(otpCode);
      toast.success('Email uğurla təsdiqləndi! 🎉');
      navigate('/hesab');
    } catch (err: any) {
      toast.error(err.message || 'Kod yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authAPI.resendOTP();
      toast.success('Yeni kod email-ə göndərildi!');
    } catch (err: any) {
      toast.error(err.message || '60 saniyə gözləyin');
    }
  };

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              {mode === 'verify' ? <Mail className="h-8 w-8 text-primary" /> : <User className="h-8 w-8 text-primary" />}
            </div>
            <h1 className="text-2xl font-bold mt-4">
              {mode === 'login' ? 'Hesaba daxil ol' : mode === 'register' ? 'Yeni hesab yarat' : 'Email təsdiqlə'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === 'login'
                ? 'Email və ya istifadəçi adı ilə daxil olun'
                : mode === 'register'
                ? 'Qeydiyyatdan keçin və alış-verişə başlayın'
                : `${form.email} ünvanına 6 rəqəmli kod göndərildi`}
            </p>
          </div>

          {/* OTP Verification */}
          {mode === 'verify' && (
            <div className="bg-card rounded-xl border p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${otpCode[i] ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      {otpCode[i] || ''}
                    </div>
                  ))}
                </div>
                <Input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6 rəqəmli kod"
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                  autoFocus
                />
                <Button onClick={handleVerifyEmail} className="w-full font-semibold" size="lg" disabled={loading}>
                  {loading ? 'Yoxlanır...' : 'Təsdiq et'}
                </Button>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>Kod gəlmədi?</span>
                  <button onClick={handleResendOTP} className="text-primary hover:underline font-medium">Yenidən göndər</button>
                </div>
                <button onClick={() => setMode('login')} className="text-sm text-muted-foreground hover:underline">Girişə qayıt</button>
              </div>
            </div>
          )}

          {/* Login/Register */}
          {mode !== 'verify' && (
            <>
              {/* Tabs */}
              <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-6">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'login' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                >Daxil ol</button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'register' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                >Qeydiyyat</button>
              </div>

              <div className="bg-card rounded-xl border p-6">
                <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
                  <div className="space-y-4">
                    {mode === 'register' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Ad *</Label>
                            <Input id="firstName" placeholder="Ad" value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Soyad *</Label>
                            <Input id="lastName" placeholder="Soyad" value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} className="mt-1" required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="username">İstifadəçi adı</Label>
                          <Input id="username" placeholder="məs: biraluser" value={form.username} onChange={(e) => updateForm('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="mt-1" />
                          <p className="text-xs text-muted-foreground mt-1">İstəyə bağlı. Giriş üçün istifadə edə bilərsiniz.</p>
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="email">{mode === 'login' ? 'Email və ya istifadəçi adı' : 'Email *'}</Label>
                      <Input id="email" type={mode === 'login' ? 'text' : 'email'} placeholder={mode === 'login' ? 'email@numune.az və ya username' : 'email@numune.az'} value={form.email} onChange={(e) => updateForm('email', e.target.value)} className="mt-1" required />
                    </div>

                    {mode === 'register' && (
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" placeholder="+994 50 XXX XX XX" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} className="mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">İstəyə bağlı. Profilinizdən sonra təsdiqləyə bilərsiniz.</p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="password">Şifrə *</Label>
                      <div className="relative mt-1">
                        <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => updateForm('password', e.target.value)} className="pr-10" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div>
                        <Label htmlFor="confirmPassword">Şifrəni təsdiqlə *</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} className="mt-1" required />
                      </div>
                    )}

                    <Button type="submit" className="w-full font-semibold" size="lg" disabled={loading}>
                      {loading ? 'Gözləyin...' : mode === 'login' ? 'Daxil ol' : 'Hesab yarat'}
                    </Button>
                  </div>
                </form>

                {mode === 'login' && (
                  <button className="text-sm text-primary hover:underline mt-3 block mx-auto">Şifrəni unutmusan?</button>
                )}
              </div>
            </>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: ShieldCheck, label: 'Təhlükəsiz' },
              { icon: ShoppingBag, label: 'Sifariş izlə' },
              { icon: Heart, label: 'Seçilənlər' },
            ].map((f) => (
              <div key={f.label} className="text-center text-xs text-muted-foreground">
                <f.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
