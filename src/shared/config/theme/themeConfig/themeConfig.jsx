import { theme as defaultTheme } from 'antd';

export const HEADER_HEIGHT = 70;
export const SIDEBAR_WIDTH = 250;

export const theme = {
  algorithm: defaultTheme.defaultAlgorithm,
  cssVar: {
    prefix: 'app-',
  },
  components: {
    Layout: {
      headerPadding: 16,
      headerHeight: HEADER_HEIGHT,
      headerBg: '#ffffff',
    },
    Table: {
      headerBg: '#ffffff',
      padding: 18,
    },
    Timeline: {
      itemPaddingBottom: 48,
    },
  },
  token: {
    colorText: '#1a3353',
    colorPrimary: '#366ef6',
    colorInfo: '#366ef6',
    // borderRadius: 10,
  },
};
