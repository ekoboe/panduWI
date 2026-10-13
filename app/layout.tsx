import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PanduWI - Panduan Widyaiswara Informasi | Dr. Eko Subiyantoro',
  description:
    'Asisten AI Cerdas & Web Dashboard Dr. Eko Subiyantoro, S.Pd., S.ST., MT. untuk Pembelajaran AIoT, IoT, Cyber-Physical Systems, dan Kurikulum PBL/MBL.',
  openGraph: {
    title: 'PanduWI - Panduan Widyaiswara Informasi | Dr. Eko Subiyantoro',
    description:
      'Asisten AI Cerdas & Web Dashboard Dr. Eko Subiyantoro, S.Pd., S.ST., MT. untuk Pembelajaran AIoT, IoT, Cyber-Physical Systems, dan Kurikulum PBL/MBL.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PanduWI - Panduan Widyaiswara Informasi | Dr. Eko Subiyantoro',
    description:
      'Asisten AI Cerdas & Web Dashboard Dr. Eko Subiyantoro, S.Pd., S.ST., MT. untuk Pembelajaran AIoT, IoT, Cyber-Physical Systems, dan Kurikulum PBL/MBL.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`scroll-smooth ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body
        className="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
