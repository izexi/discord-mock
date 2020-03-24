import Util from '../../util/Util';

export interface Channel {
  id: string;
  name: string;
  position: number;
  nsfw: boolean;
  rate_limit_per_user: number;
  bitrate?: number;
  user_limit?: number;
  // TODO: Type interface for perms
  permission_overwrites: [];
  parent_id?: string;
}

export const mockChannel: Channel = {
  id: Util.generateID(),
  name: 'mock',
  position: 0,
  nsfw: false,
  rate_limit_per_user: 0,
  permission_overwrites: []
};
export default Util.mockData(mockChannel);
