import Util from '../../util/Util';

type GuildFeatures =
  | 'INVITE_SPLASH'
  | 'VIP_REGIONS'
  | 'VIP'
  | 'VANITY_URL'
  | 'URL'
  | 'VERIFIED'
  | 'PARTNERED'
  | 'PUBLIC'
  | 'COMMERCE'
  | 'NEWS'
  | 'DISCOVERABLE'
  | 'FEATURABLE'
  | 'ANIMATED_ICON'
  | 'BANNER'
  | 'PUBLIC_DISABLED';

interface Role {
  id: string;
  name: string;
  permissions: number;
  position: number;
  color: number;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
}

interface Emoji {
  name: string;
  roles: Role[];
  id: string;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
}

interface BaseGuild {
  id: string;
  name: string;
  icon: string | null;
  features: GuildFeatures[];
}

interface PartialGuild extends BaseGuild {
  owner: boolean;
  permissions: number;
}

interface Guild extends BaseGuild {
  description: string | null;
  splash: number | null;
  discovery_splash: string | null;
  emojis: Emoji[];
  banner: string | null;
  owner_id: string;
  application_id: string | null;
  region: string;
  afk_channel_id: string;
  afk_timeout: number;
  system_channel_id: string;
  widget_enabled: boolean;
  widget_channel_id: string;
  verification_level: number;
  roles: Role[];
  default_message_notifications: number;
  mfa_level: number;
  explicit_content_filter: number;
  max_presences: number | null;
  max_members: number;
  vanity_url_code: string | null;
  premium_tier: number;
  premium_subscription_count: number;
  system_channel_flags: number;
  preferred_locale: string;
  rules_channel_id: string | null;
  public_updates_channel_id: string | null;
  embed_enabled: boolean;
  embed_channel_id: string | null;
}

export const mockPartialGuilds: PartialGuild[] = [
  {
    id: '0123456789876543210',
    name: 'foo',
    icon: null,
    owner: false,
    permissions: 2147483647,
    features: []
  },
  {
    id: '9876543210123456789',
    name: 'bar',
    icon: null,
    owner: false,
    permissions: 2147483647,
    features: ['ANIMATED_ICON', 'INVITE_SPLASH']
  }
];

export default Util.mockData(mockPartialGuilds);
