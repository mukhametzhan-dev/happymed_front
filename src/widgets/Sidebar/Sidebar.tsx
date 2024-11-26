import { Layout, Menu, Row } from 'antd';
import { IconContext } from 'react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_WIDTH } from './../../shared/config/theme/themeConfig/themeConfig';
import { sidebarItems, doctorSidebarItems, adminSidebarItems, collapsedSidebarItems } from './routes';
import { useState, useEffect } from 'react';
import React from 'react';
import './Sidebar.css';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  return (
    <Layout.Sider
      width={SIDEBAR_WIDTH}
      collapsed={collapsed}
      onCollapse={(collapsed) => setCollapsed(collapsed)}
    >
      <Row className="brand">HappyMed</Row>
      <IconContext.Provider value={{ size: '16' }}>
        <Menu
          mode="inline"
          className="menu"
          items={
            collapsed
              ? collapsedSidebarItems
              : userRole === 'doctor'
              ? doctorSidebarItems
              : userRole === 'administrator'
              ? adminSidebarItems
              : sidebarItems
          }
          onClick={({ key }) => {
            console.log('key:', key);
            navigate(key);
          }}
          selectedKeys={[pathname]}
          defaultOpenKeys={[pathname]}
        />
      </IconContext.Provider>
    </Layout.Sider>
  );
};