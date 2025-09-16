import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolarCast – AI-Powered Solar Prediction',
  description: 'SolarCast predicts your solar power generation using AI and real-world data. Enter your location and panel details to get accurate, personalized forecasts.',
  keywords: [
    'Solar Prediction',
    'AI Solar Forecast',
    'Renewable Energy',
    'SolarCast',
    'Solar Power Analytics',
    'Sustainable Energy',
    'Solar Panel Output',
  ],
  authors: [{ name: 'Darshit Dudhaiya', url: 'https://www.linkedin.com/in/darshit-dudhaiya/' }],
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    title: 'SolarCast – AI-Powered Solar Prediction',
    description: 'Predict your solar power generation with SolarCast using AI and real-world data.',
    url: 'https://your-vercel-app.vercel.app',
    siteName: 'SolarCast',
    images: [
      {
        url: 'https://your-vercel-app.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SolarCast AI Solar Prediction',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolarCast – AI-Powered Solar Prediction',
    description: 'Predict your solar power generation with SolarCast using AI and real-world data.',
    site: '@YourTwitterHandle', // optional
    creator: '@YourTwitterHandle', // optional
    images: ['https://your-vercel-app.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
