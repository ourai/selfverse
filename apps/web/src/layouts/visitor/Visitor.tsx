import { Link, Outlet } from 'react-router-dom';
import { Layout, Flex, Space } from 'antd';

import Container from '../../components/container';
import Passport from '../../components/passport';

function VisitorLayout() {
  const containerStyle = { maxWidth: 1280, margin: '0 auto' };

  return (
    <Container>
      <Layout>
        <Layout.Header style={{ backgroundColor: '#ccc' }}>
          <Flex align="center" justify="space-between" style={containerStyle}>
            <div style={{ fontSize: 24 }}>
              <Link to="/">Selfverse</Link>
            </div>
            <Space>
              <Link to="/works">Works</Link>
              <Link to="/donation">Donation</Link>
              <Passport />
            </Space>
          </Flex>
        </Layout.Header>
        <Layout.Content>
          <div style={{ ...containerStyle, padding: 24 }}>
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Container>
  )
}

export default VisitorLayout;
