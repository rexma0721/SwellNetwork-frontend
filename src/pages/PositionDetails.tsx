import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber } from '@ethersproject/bignumber';
import { ArrowBack } from '@mui/icons-material';
import { Box, styled, Typography, useTheme } from '@mui/material';
import { useWeb3React } from 'web3-react-core';

import LiquidityTransactionTabPanel from '../components/liquidityTransaction/LiquidityTransactionTabPanel';
import NFTPosition from '../components/nFTPosition';
import { usePositionTokenURI } from '../hooks/usePositionTokenURI';
import { useV3PositionFromTokenId } from '../hooks/useV3Positions';
import { useAllVaultsWithPositions } from '../hooks/useVault';
import { SwellIcon } from '../theme/uiComponents';
import Vault from './Vault';

const Row = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridGap: 20,
  marginBottom: 20,
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '2fr 3fr',
  },
  [theme.breakpoints.between('sm', 'md')]: {
    gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

const PositionDetails: FC = () => {
  const navigate = useNavigate();
  const { account } = useWeb3React();
  const theme = useTheme();
  const { id: tokenIdFromUrl } = useParams();
  const parsedTokenId = tokenIdFromUrl ? BigNumber.from(tokenIdFromUrl) : undefined;
  const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId);
  const metadata = usePositionTokenURI(parsedTokenId);

  const [balances, loadingBalances] = useAllVaultsWithPositions(positionDetails?.tokenId || BigNumber.from(0));
  const totalSwEthInVault = Object.values(balances).reduce(
    (previousValue, currentValue) => previousValue.add(currentValue),
    BigNumber.from(0)
  );
  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);
  if (loading || loadingBalances) {
    return <></>;
  }
  return (
    <>
      {/* eslint-disable-next-line react/jsx-max-props-per-line */}
      <Typography
        component="span"
        onClick={() => navigate('/')}
        role="button"
        sx={{ alignItems: 'center', [theme.breakpoints.down('md')]: { display: 'block', textAlign: 'center' } }}
      >
        <ArrowBack sx={{ fontSize: '15px', marginRight: '5px' }} />
        Back to all positions
      </Typography>
      <Box
        sx={{
          display: 'flex',
          margin: '10px 0px 21px 0px',
          [theme.breakpoints.down('md')]: { justifyContent: 'center' },
        }}
      >
        <SwellIcon size="sm" />
        <Typography
          component="h3"
          sx={{
            alignItems: 'center',
            marginLeft: '6px',
            marginRight: '9px',
          }}
          variant="h3"
        >
          {tokenIdFromUrl}
        </Typography>
      </Box>
      <Row>
        <NFTPosition
          loading={loading}
          metadata={metadata}
          positionDetails={positionDetails}
          totalSwEthInVault={totalSwEthInVault}
        />
        <LiquidityTransactionTabPanel />
      </Row>
      <Vault />
    </>
  );
};

export default PositionDetails;
