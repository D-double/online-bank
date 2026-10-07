import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '@/pages/HomePage';
import { CardsPage } from '@/pages/CardsPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { ProviderPage } from '@/pages/ProviderPage';
import { TransferPage } from '@/pages/TransferPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { ReceiptPage } from '@/pages/ReceiptPage';
import { ProfilePage } from '@/pages/ProfilePage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/cards', element: <CardsPage /> },
      { path: '/payments', element: <PaymentsPage /> },
      { path: '/payments/:providerId', element: <ProviderPage /> },
      { path: '/transfer', element: <TransferPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: '/history/:transactionId', element: <ReceiptPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
