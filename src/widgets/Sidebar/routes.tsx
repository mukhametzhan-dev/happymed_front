import { AiOutlineUnorderedList } from 'react-icons/ai';
import { ScheduleOutlined, UserOutlined } from '@ant-design/icons';
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