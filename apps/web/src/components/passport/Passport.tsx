import { useNavigate, useLocation } from 'react-router-dom';
import { KeyOutlined } from '@ant-design/icons';
import { Connector, ConnectButton } from '@ant-design/web3';

import { useIsAdmin } from '../../hooks';

const adminRoutePath = '/cellar';

function Passport() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const extraItems = isAdmin && location.pathname.indexOf(adminRoutePath) === -1 ? [
    {
      label: 'Enter Cellar',
      key: 'cellar',
      icon: <KeyOutlined />,
      onClick: () => navigate(adminRoutePath),
    }
  ] : [];

  return (
    <Connector modalProps={{ mode: 'simple' }}>
      <ConnectButton type="text" size="middle" profileModal={false} actionsMenu={{ extraItems }} />
    </Connector>
  );
}

export default Passport;
