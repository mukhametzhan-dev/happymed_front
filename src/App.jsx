import { StyleProvider } from '@ant-design/cssinjs';
import { IconContext } from 'react-icons';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/navigation/router';
import ErrorBoundary from './shared/components/ErrorBoundary/ErrorBoundary';
import React from 'react';

function App() {
  return (
    <ErrorBoundary>
      <StyleProvider layer>
        <IconContext.Provider value={{ size: '20' }}>
          <RouterProvider router={router} />
        </IconContext.Provider>
      </StyleProvider>
    </ErrorBoundary>
  );
}

export default App;
