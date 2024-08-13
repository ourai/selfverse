import { useNavigate, useLocation } from 'react-router-dom';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Connector, ConnectButton } from '@ant-design/web3';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { useIdentityContext } from '../identity';

const adminRoutePath = '/cellar';

function Passport() {
  const identity = useIdentityContext();
  const location = useLocation();
  const navigate = useNavigate();

  const extraItems = [];

  if (identity.address) {
    if (identity.owner || identity.admin) {
      if (location.pathname.indexOf(adminRoutePath) === -1) {
        extraItems.push({
          label: 'Enter Cellar',
          key: 'cellar',
          icon: <KeyOutlined />,
          onClick: () => navigate(adminRoutePath),
        });
      }
    } else if (identity.visitor) {
      extraItems.push({
        label: 'Visit Profile',
        key: 'profile',
        icon: <UserOutlined />,
        onClick: () => navigate('/profile'),
      });
    }
  }

  return (
    <Connector modalProps={{ mode: 'simple' }}>
      <ConnectButton
        type="text"
        size="middle"
        profileModal={false}
        actionsMenu={{ extraItems }}
        avatar={identity.address ? {
          icon: <Jazzicon seed={jsNumberForAddress(identity.address)} diameter={20} />
        } : undefined}
      />
    </Connector>
  );
}

export default Passport;
