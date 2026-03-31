import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Eye, EyeOff, ShieldCheck, ShoppingBag, Heart } from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const updateForm = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Email və şifrəni daxil edin');
      return;
    }
    try {
      await login(form.email, form.password);
      toast.success('Uğurla daxil oldunuz!');
      navigate('/hesab');
    } catch (err: any) {
      toast.error(err.message || 'Giriş uğursuz oldu');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
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
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success('Hesab yaradıldı! Xoş gəlmisiniz!');
      navigate('/hesab');
    } catch (err: any) {
      toast.error(err.message || 'Qeydiyyat uğursuz oldu');
    }
  };

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-4">
              {mode === 'login' ? 'Hesaba daxil ol' : 'Yeni hesab yarat'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === 'login'
                ? 'Sifarişlərinizi izləyin, seçilənlərinizi saxlayın'
                : 'Qeydiyyatdan keçin və alış-verişə başlayın'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Daxil ol
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'register' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Qeydiyyat
            </button>
          </div>

          {/* Form */}
          <div className="bg-card rounded-xl border p-6">
            <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
              <div className="space-y-4">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Ad</Label>
                      <Input
                        id="firstName"
                        placeholder="Ad"
                        value={form.firstName}
                        onChange={(e) => updateForm('firstName', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input
                        id="lastName"
                        placeholder="Soyad"
                        value={form.lastName}
                        onChange={(e) => updateForm('lastName', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@numune.az"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                {mode === 'register' && (
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      placeholder="+994 50 XXX XX XX"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="password">Şifrə</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => updateForm('password', e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <Label htmlFor="confirmPassword">Şifrəni təsdiqlə</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => updateForm('confirmPassword', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-full font-semibold" size="lg">
                  {mode === 'login' ? 'Daxil ol' : 'Hesab yarat'}
                </Button>
              </div>
            </form>

            {mode === 'login' && (
              <button className="text-sm text-primary hover:underline mt-3 block mx-auto">
                Şifrəni unutmusan?
              </button>
            )}
          </div>

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
