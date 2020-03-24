import Util from '../../util/Util';

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
}

export const mockUser: User = {
  id: '191615925336670208',
  username: 'Havoc',
  discriminator: '7078',
  avatar: 'a_dde53f5afa943f4a2628d47045ef92c3',
  bot: false,
  system: false
};

export default Util.mockData(mockUser);
