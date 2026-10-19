import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  );
}
