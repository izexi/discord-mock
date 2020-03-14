interface Me {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  email: string | null;
  verified: boolean;
  locale: string;
  mfa_enabled: boolean;
  flags: number;
  system?: boolean;
}

export default {
  id: '0123456789876543210',
  username: 'Mock Client',
  avatar: null,
  discriminator: '7078',
  bot: true,
  email: null,
  verified: true,
  locale: 'en-US',
  mfa_enabled: true,
  flags: 0
} as Me;
