'use client';

import { usePathname } from 'next/navigation';
import LayoutWrapper from './layout-wrapper';

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignInPage = pathname === '/signin';

  return isSignInPage ? children : <LayoutWrapper>{children}</LayoutWrapper>;
}
