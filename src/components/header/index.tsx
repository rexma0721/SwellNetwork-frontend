import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from 'web3-react-core';

import { useAppDispatch } from '../../state/hooks';
import { setIsWalletModalOpen } from '../../state/modal/modalSlice';
import { SwellIcon, SwellLogo } from '../../theme/uiComponents';
import AppMenu from './AppMenu';
import MoreMenu from './Menu';
import { SideWalletWidget } from './SideWalletWidget';

const AppHeader = styled('div')({
  display: 'grid',
  gridTemplateColumns: '120px 1fr 120px',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Header: FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(`(max-width:${theme.breakpoints.values.sm}px)`);
  const smDesktop = useMediaQuery('(max-width: 1200px)');
  const navigate = useNavigate();
  const { account, error } = useWeb3React();
  // const { address } = useAppSelector((state) => state.walletConnect);
  const dispatch = useAppDispatch();
  return (
    <AppHeader
      sx={{
        p: ['10px', '24px 20px', '24px 30px'],
        gridTemplateColumns: ['auto auto', '120px 1fr 120px'],
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <span onClick={() => navigate('/')} role="button" tabIndex={0}>
        {matches ? <SwellIcon size="md" /> : <SwellLogo sx={{ width: 104, height: 'auto' }} />}
      </span>
      <AppMenu />
      <Box
        sx={{
          display: 'flex',
          whiteSpace: 'nowrap',
          justifySelf: 'flex-end',
          alignItems: account ? '' : 'center',
          height: '36px',
          gap: smDesktop ? '6px' : '10px',
          flexDirection: account && smDesktop ? 'row-reverse' : '',
        }}
      >
        <MoreMenu />
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes, no-nested-ternary */}
        {account ? (
          <SideWalletWidget />
        ) : error ? (
          <Button color="error" onClick={() => dispatch(setIsWalletModalOpen(true))}>
            {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
          </Button>
        ) : (
          <Button
            color="info"
            onClick={() => dispatch(setIsWalletModalOpen(true))}
            sx={{
              [theme.breakpoints.down('lg')]: {
                padding: '7px 10px',
                fontSize: theme.typography.fontSize,
              },
            }}
          >
            Connect wallet
          </Button>
        )}
      </Box>
    </AppHeader>
  );
};

export default Header;
