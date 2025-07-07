import './globals.css';
import type { Metadata } from 'next';
import MatrixBackground from '@/components/layout/matrix-background';
import Navigation from '@/components/layout/navigation';
import { getUserSession } from '@/lib/session';
import { UserProvider } from '@/context/UserContext';
import type { PublicUser } from '@/types/user';
import { GlobalMessageProvider } from '@/components/global-message';

export const metadata: Metadata = {
  title: 'CyberType - Reverse Typing Matrix',
  description: 'this is a reverse typing matrix game that enhances your typing skills through advanced cognitive algorithms and cybernetic enhancement protocols.',
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const User : PublicUser | null = await getUserSession();

  return (
    <html lang="en">
      <body>
        <UserProvider initialUser={User}>
          <GlobalMessageProvider>
            <MatrixBackground>
              <Navigation />
              <div style={{ paddingTop: '48px' }}>
                {children}
              </div>
            </MatrixBackground>
          </GlobalMessageProvider>
        </UserProvider>
      </body>
    </html>
  );
}
