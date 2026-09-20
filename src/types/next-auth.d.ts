import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'RETAILER' | 'ADMIN';
      phone?: string;
      isApproved: boolean;
      isActive: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'USER' | 'RETAILER' | 'ADMIN';
    phone?: string;
    isApproved: boolean;
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'USER' | 'RETAILER' | 'ADMIN';
    phone?: string;
    isApproved: boolean;
    isActive: boolean;
  }
}
