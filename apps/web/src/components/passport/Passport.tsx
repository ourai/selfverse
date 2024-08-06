import { useNavigate } from 'react-router-dom';
import { Connector, ConnectButton, useAccount } from '@ant-design/web3';

function Passport() {
  const { account } = useAccount();
  const navigate = useNavigate();
  const isAdmin = !!(account && account.address);

  const extraItems = isAdmin ? [
    {
      label: 'Enter the cellar',
      key: 'cellar',
      onClick: () => navigate('/cellar'),
    }
  ] : [];

  return (
    <Connector modalProps={{ mode: 'simple' }}>
      <ConnectButton size="large" profileModal={false} actionsMenu={{ extraItems }} />
    </Connector>
  );
}

export default Passport;
