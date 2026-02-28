import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../i18n/routing';
import { Button } from '@/components/ui/button';

type Props = {
  params: { locale: string };
};

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <div>
      <h1>{t('hello')}</h1>
      <Button variant="outline">Click me</Button>
    </div>
  );
}
