export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

export type SocialAuthProvider = 'google' | 'facebook';

export type AuthErrorCode = 'NOT_CONFIGURED' | 'NETWORK' | 'UNKNOWN';

export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: AuthErrorCode; message?: string } };

type EnvKey =
  | 'NEXT_PUBLIC_API_BASE_URL'
  | 'NEXT_PUBLIC_AUTH_LOGIN_PATH'
  | 'NEXT_PUBLIC_AUTH_SIGNUP_PATH'
  | 'NEXT_PUBLIC_AUTH_LOGOUT_PATH'
  | 'NEXT_PUBLIC_AUTH_SOCIAL_PATH'
  | 'NEXT_PUBLIC_AUTH_INTEGRATION_ENABLED';

function isIntegrationEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_INTEGRATION_ENABLED === 'true';
}

function getEnv(key: EnvKey): string | undefined {
  return process.env[key];
}

function resolveEndpoint(pathKey: EnvKey): AuthResult<string> {
  if (!isIntegrationEnabled()) {
    return { ok: false, error: { code: 'NOT_CONFIGURED' } };
  }

  const baseUrl = getEnv('NEXT_PUBLIC_API_BASE_URL');
  const path = getEnv(pathKey);

  if (!baseUrl || !path) {
    return { ok: false, error: { code: 'NOT_CONFIGURED' } };
  }

  try {
    return { ok: true, data: new URL(path, baseUrl).toString() };
  } catch {
    return { ok: false, error: { code: 'UNKNOWN' } };
  }
}

// Scaffold only: returns NOT_CONFIGURED until Sensei provides real endpoints.
export async function login(_input: LoginInput): Promise<AuthResult<void>> {
  void _input;
  const endpoint = resolveEndpoint('NEXT_PUBLIC_AUTH_LOGIN_PATH');
  if (!endpoint.ok) return endpoint;
  return { ok: false, error: { code: 'NOT_CONFIGURED', message: endpoint.data } };
}

export async function signup(_input: SignupInput): Promise<AuthResult<void>> {
  void _input;
  const endpoint = resolveEndpoint('NEXT_PUBLIC_AUTH_SIGNUP_PATH');
  if (!endpoint.ok) return endpoint;
  return { ok: false, error: { code: 'NOT_CONFIGURED', message: endpoint.data } };
}

export async function logout(): Promise<AuthResult<void>> {
  const endpoint = resolveEndpoint('NEXT_PUBLIC_AUTH_LOGOUT_PATH');
  if (!endpoint.ok) return endpoint;
  return { ok: false, error: { code: 'NOT_CONFIGURED', message: endpoint.data } };
}

export async function startSocialAuth(
  provider: SocialAuthProvider,
): Promise<AuthResult<{ redirectUrl: string }>> {
  const endpoint = resolveEndpoint('NEXT_PUBLIC_AUTH_SOCIAL_PATH');
  if (!endpoint.ok) return endpoint;
  const url = new URL(endpoint.data);
  url.searchParams.set('provider', provider);
  return { ok: true, data: { redirectUrl: url.toString() } };
}
