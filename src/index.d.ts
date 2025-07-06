import { SessionUser } from './interfaces/users';
import { AccountMenuItem } from './lib/menus/accountMenu';
import { MainNavItem } from './lib/menus/mainNav';

declare module 'fastify' {
  interface FastifyReply {
    locals: {
      mainNav: MainNavItem[];
      accountMenu: AccountMenuItem[];
      helpers: any;
      user?: SessionUser;
      csrfToken: string;
      webpackManifest: Record<string, string>;
    };
  }

  interface FastifyRequest {
    isAuthenticated(): boolean;
    isUnauthenticated(): boolean;
    login(): Promise<boolean>;
    logout(): void;
  }
}

declare module '@fastify/secure-session' {
  interface SessionData {
    user?: SessionUser;
  }
}
