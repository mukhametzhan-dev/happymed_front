import { AiOutlineUnorderedList } from 'react-icons/ai';
import { CheckSquareOutlined, HistoryOutlined, LogoutOutlined, ReconciliationOutlined, ScheduleOutlined, UserOutlined } from '@ant-design/icons';
import { privateRoutesMap } from '../../shared/navigation';
import React from 'react';
import { MenuProps } from 'antd';
import { ItemType } from 'antd/es/menu/interface';

type MenuItem = Required<MenuProps>['items'][number];

export const sidebarItems: MenuItem[] = [
  {
    key: 'duty',
    type: 'group',
    label: 'Profile',
    children: [
      {
        key: privateRoutesMap.home,
        type: 'item',
        label: 'My profile',
        icon: <AiOutlineUnorderedList />,
      },
      {
        key: privateRoutesMap.logout,
        type: 'item',
        label: 'Logout',
        icon:<LogoutOutlined />,
        onClick: () => {
          localStorage.removeItem('user');
          window.location.href = '/';
        }
      }
    ],
  },
];

export const patientSidebarItems: MenuItem[] = [
  ...sidebarItems,
  {
    key: 'appointment',
    type: 'group',
    label: 'Booking options',
    children: [
      {
        key: privateRoutesMap.appointment,
        type: 'item',
        label: 'Make an appointment',
        icon: <CheckSquareOutlined />,
      },
      {
        key: privateRoutesMap.appointments,
        type: 'item',
        label: 'Appointments',
        icon: <HistoryOutlined />, 
      }
    ],
  },
];

export const doctorSidebarItems: MenuItem[] = [
  ...sidebarItems,
  {
    key: 'schedule',
    type: 'group',
    label: 'Schedule',
    children: [
      {
        key: privateRoutesMap.schedule,
        type: 'item',
        label: 'Schedule',
        icon: <ScheduleOutlined />,
      },
    ],
  },

  {
    key: 'myapps',
    type: 'group',
    label: 'Appointments',
    children: [

      {
        key: privateRoutesMap.myapps,
        type: 'item',
        label: 'Appointments',
        icon: <ReconciliationOutlined /> ,
      },
    ],
  }
];

export const adminSidebarItems: MenuItem[] = [
  ...sidebarItems,
  {
    key: 'manage',
    type: 'group',
    label: 'Manage',
    children: [
      {
        key: privateRoutesMap.manage,
        type: 'item',
        label: 'Manage',
        icon: <UserOutlined />,
      },
    ],
  },
];

export const collapsedSidebarItems = sidebarItems.reduce<ItemType[]>(
  (menu, group) => {
    if (group && group.type === 'group' && group.children) {
      return [...menu, ...group.children];
    }
    return menu;
  },
  []
);