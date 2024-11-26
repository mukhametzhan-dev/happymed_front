import { Spin } from 'antd';
import { Suspense } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

export const AppSuspense = ({ children }) => {
  return <Suspense fallback={<Spin />}>{children}</Suspense>;
};

AppSuspense.propTypes = {
  children: PropTypes.node.isRequired,
};
