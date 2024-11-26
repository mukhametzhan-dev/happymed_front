import { Navigate } from 'react-router-dom';
import { invalidRoutesMap, publicRoutesMap } from '../../../shared/navigation';
import React from 'react';

export const invalidRoutes = [
  {
    path: invalidRoutesMap.initial,
    element: <Navigate to={publicRoutesMap.login} replace />,
  },
  {
    path: invalidRoutesMap.all,
    element: <Navigate to={publicRoutesMap.login} replace />,
  },
];
