import PropTypes from 'prop-types';
import './AuthLayout.css';
import React from 'react';

export const AuthLayout = ({ children }) => {
  return <main className="authLayout">{children}</main>;
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};
