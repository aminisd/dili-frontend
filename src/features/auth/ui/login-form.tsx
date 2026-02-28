'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, startSocialAuth, type SocialAuthProvider } from '@/features/auth/auth.service';

export function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState<SocialAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login({ email, password });
      if (!result.ok) {
        if (result.error.code === 'NOT_CONFIGURED') {
          setError(t('errors.notConfigured'));
        } else {
          setError(t('errors.generic'));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider: SocialAuthProvider) => {
    setError(null);
    setSocialSubmitting(provider);

    try {
      const result = await startSocialAuth(provider);
      if (result.ok) {
        window.location.href = result.data.redirectUrl;
        return;
      }

      if (result.error.code === 'NOT_CONFIGURED') {
        setError(t('errors.notConfigured'));
      } else {
        setError(t('errors.generic'));
      }
    } catch {
      setError(t('errors.generic'));
    } finally {
      setSocialSubmitting(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('login.title')}</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="login-email">{t('form.email')}</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">{t('form.password')}</Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('actions.submitting') : t('actions.submit')}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">{t('social.or')}</span>
          </div>
        </div>

        <div className="grid gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialAuth('google')}
            disabled={isSubmitting || socialSubmitting !== null}
          >
            {t('social.google')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialAuth('facebook')}
            disabled={isSubmitting || socialSubmitting !== null}
          >
            {t('social.facebook')}
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        <Link className="text-primary font-medium hover:underline" href={`/${locale}/signup`}>
          {t('links.toSignup')}
        </Link>
      </p>
    </div>
  );
}
