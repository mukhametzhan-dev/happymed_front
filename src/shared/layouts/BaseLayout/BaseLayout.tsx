import { Layout } from 'antd';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import './BaseLayout.css';
import React from 'react';

export const BaseLayout = ({ children, className }) => {
  return <Layout className={clsx('layout', className)}>{children}</Layout>;
};

BaseLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
