import { Layout, Menu, Row, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { IconContext } from 'react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_WIDTH } from './../../shared/config/theme/themeConfig/themeConfig';
import { sidebarItems, doctorSidebarItems, adminSidebarItems, collapsedSidebarItems, patientSidebarItems } from './routes';
import { useState, useEffect } from 'react';
import React from 'react';
import './Sidebar.css';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
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

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setVisible(false); // Close the drawer after navigation
  };

  const menuItems =
    userRole === 'doctor'
      ? doctorSidebarItems
      : userRole === 'administrator'
      ? adminSidebarItems
      : userRole !== 'doctor' && userRole !== 'administrator'
      ? patientSidebarItems
      : sidebarItems;

  return (
    <>
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        className="menu-button"
      />
      <Drawer
        title="HappyMed"
        placement="left"
        onClose={onClose}
        visible={visible}
        width={SIDEBAR_WIDTH}
      >
        <IconContext.Provider value={{ size: '16' }}>
          <Menu
            mode="inline"
            className="menu"
            items={menuItems}
            onClick={handleMenuClick}
            selectedKeys={[pathname]}
            defaultOpenKeys={[pathname]}
          />
        </IconContext.Provider>
      </Drawer>
      <Layout.Sider
        width={SIDEBAR_WIDTH}
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        className="sidebar-desktop"
      >
        <Row className="brand">HappyMed</Row>
        <IconContext.Provider value={{ size: '16' }}>
          <Menu
            mode="inline"
            className="menu"
            items={menuItems}
            onClick={handleMenuClick}
            selectedKeys={[pathname]}
            defaultOpenKeys={[pathname]}
          />
        </IconContext.Provider>
      </Layout.Sider>
    </>
  );
};