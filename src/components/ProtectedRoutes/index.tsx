import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from '../../config';
import { useWallet } from '@txnlab/use-wallet';
import PageLoading from '../Layout/PageLoading';
import ProtectedLayout from '../Layout/ProtectedLayout';

const PrivateRoute: React.FC<any> = (): React.ReactElement => {
  // TODO: Check if the wallet has connected or not
  // instead of localstorage
  const { activeAccount, status } = useWallet();

  console.log('activeAccount', activeAccount);
  console.log('status==>>', status);

  if (status === 'initializing') {
    return (
      <PageLoading />
    );
  }

  if (activeAccount?.address && status === 'active') {
    return (
      <ProtectedLayout>
        <Outlet />
      </ProtectedLayout>
    );
  }

  return <Navigate to={routes.connectWallet} />;
};

export default PrivateRoute;
