import Util from '../../util/Util';
import mockUsers, { User } from './usersMap';
import mockChannels from './channelsMap';

// TODO: Complete interace types
export interface Message {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: User;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: User[];
  mention_roles: string[];
  mention_channels?: {
    id: string;
    guild_id: string;
    type: number;
    name: string;
  }[];
  nonce?: number | string;
  pinned: boolean;
  webhook_id?: string;
  type: number;
  flags?: number;
}

export const mockMessage: Message = {
  id: Util.generateID(),
  channel_id: [...mockChannels.keys()][0],
  author: [...mockUsers.values()][0],
  content: 'mock',
  timestamp: new Date().toISOString(),
  edited_timestamp: null,
  tts: false,
  mention_everyone: false,
  mentions: [],
  mention_roles: [],
  pinned: false,
  type: 0
};
export default Util.mockData(mockMessage);
