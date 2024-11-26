import { Outlet } from 'react-router-dom';
import React from 'react';
import { publicRoutesMap } from '../../../shared/navigation';
import { AppSuspense } from '../../../shared/components/AppSuspense/AppSuspense';
import { AuthLayout } from '../../../shared/layouts/AuthLayout/AuthLayout';
import { Login } from '../../../pages/Login/Login';
import { Registration } from '../../../pages/Registration/Registration';
import Forget from "../../../pages/Forget/Forget";
import ResetPassword from "../../../pages/ResetPassword/ResetPassword";
import RegistrationAdmin from '../../../pages/RegistrationAdmin/RegistrationAdmin';


export const publicRoutes = [
  {
    element: (
      <AuthLayout>
        <AppSuspense>
          <Outlet />
        </AppSuspense>
      </AuthLayout>
    ),
    children: [
      {
        path: publicRoutesMap.login,
        element: <Login />,
      },
      {
        path: publicRoutesMap.registration,
        element: <Registration />,
      },
      {
        path: publicRoutesMap.forget,
        element: <Forget />,
      },
      {
        path: publicRoutesMap.reset,
        element: <ResetPassword />, // backender dobavil 21:25
      },
      {
        path: publicRoutesMap.resetPassword, // backender dobavil 21:25
        element: <ResetPassword />,
      },
      {
        path: publicRoutesMap.registrationAdmin,
        element: <RegistrationAdmin />,
      },

    ],
  },
];

