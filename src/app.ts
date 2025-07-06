import Fastify, { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import formBody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import { fastifyAutoload } from '@fastify/autoload';
import fastifyCookie from '@fastify/cookie';
import fastifySecureSession from '@fastify/secure-session';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import ejs from 'ejs';
import path from 'path';
import minifier from 'html-minifier';
import fs from 'node:fs';

import mainNav from './lib/menus/mainNav';
import accountMenu from './lib/menus/accountMenu';
import * as esjHelpers from './lib/ejsHelpers';
import logger from './lib/logger';
import authPlugin from './plugins/auth';

function getLocals(req: FastifyRequest, reply: FastifyReply) {
  const csrfToken = reply.generateCsrf();
  const webpackManifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/dist/manifest.json'), 'utf8'));

  // Global variables for the EJS templates can be set here
  return reply.locals = {
    mainNav,
    accountMenu,
    helpers: esjHelpers,
    user: req.session.get('user'),
    csrfToken,
    webpackManifest,
  };
}

const port = Number(process.env.PORT) || 4000;

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
  ignoreTrailingSlash: true,
});

app.addHook('preHandler', (req: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
  reply.locals = getLocals(req, reply);
  done();
});

app.register(formBody);

app.register(fastifyView, {
  engine: { ejs },
  root: './templates',
  layout: '_layout.ejs',
  options: {
    useHtmlMinifier: minifier,
    htmlMinifierOptions: {
      removeComments: true,
      removeCommentsFromCDATA: true,
      collapseWhitespace: process.env.NODE_ENV === 'production',
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
    },
  },
});

app.register(helmet, {
  global: true,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      /* eslint-disable quotes */
      defaultSrc: ["'self'"],
      'img-src': ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", "'unsafe-inline'", "matomo.alexseifert.com"],
      connectSrc: ["'self'", 'https:', 'wss:', 'matomo.alexseifert.com'],
      /* eslint-enable quotes */
      ...process.env.NODE_ENV === 'development' && {
        'upgrade-insecure-requests': null,
      },
    },
  },
});

// Necessary for @fastify/secure-session
app.register(fastifyCookie);

app.register(fastifySecureSession, {
  secret: process.env.AUTH_SESSION_SECRET,
  salt: process.env.AUTH_SALT,
  cookie: {
    path: '/',
    httpOnly: true,
    // options for setCookie, see https://github.com/fastify/fastify-cookie
  },
});

app.register(authPlugin);

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
});

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
});

app.setNotFoundHandler((req: FastifyRequest, reply: FastifyReply) => {
  reply.view('404.ejs', {
    title: 'Page Not Found!',
  });
});

app.setErrorHandler((error: Error, req: FastifyRequest, reply: FastifyReply) => {
  if ('status' in error && error.status === 404) {
    return reply.callNotFound();
  }

  reply.locals = getLocals(req, reply);

  logger.error(error);

  reply.view('error.ejs', {
    title: 'An Error Occurred!',
  });
});

app.register(fastifyCsrfProtection, {
  sessionPlugin: '@fastify/secure-session',
});

app.listen({ port }, error => {
  if (error) {
    throw error;
  }
});

export default app;
