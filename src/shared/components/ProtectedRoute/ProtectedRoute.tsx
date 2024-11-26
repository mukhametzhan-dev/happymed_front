import { Navigate } from 'react-router-dom';
import { publicRoutesMap } from '../../../shared/navigation';
import { appSessionStorage } from '../../../shared/utils/appSessionStorage/appSessionStorage';
import React from 'react';

export const ProtectedRoute = ({ children }) => {
  const isValid = appSessionStorage.isTokenValid();

  if (!isValid) {
    return <Navigate to={publicRoutesMap.login} replace />;
  }
  return children;
};
