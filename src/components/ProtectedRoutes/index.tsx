import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from '../../config';
import { useWallet } from '@txnlab/use-wallet';
import PageLoading from '../Layout/PageLoading';
import ProtectedLayout from '../Layout/ProtectedLayout';
import { getTokenFromStorage } from '../../services/storage.service';

const PrivateRoute: React.FC<any> = (): React.ReactElement => {
  // TODO: Check if the wallet has connected or not
  // instead of localstorage
  const { status } = useWallet();

  const accessToken = getTokenFromStorage();

  // console.log('activeAccount', activeAccount);
  // console.log('status==>>', status);

  if (status === 'initializing') {
    return (
      <PageLoading />
    );
  }

  if (accessToken?.trim()) {
    return (
      <ProtectedLayout>
        <Outlet />
      </ProtectedLayout>
    );
  }

  return <Navigate to={routes.connectWallet} />;
};

export default PrivateRoute;
