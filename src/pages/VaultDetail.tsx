import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowBack, TransitEnterexit } from '@mui/icons-material';
import { alpha, Box, Card, CardContent, CardHeader, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useWeb3React } from 'web3-react-core';

import VaultDetailCard from '../components/common/VaultDetailCard';
import VaultDetailCardRow from '../components/common/VaultDetailCardRow';
import VaultTransactionTabPanel from '../components/vaultTransaction/VaultTransactionTabPanel';
import { useVaultDetail } from '../hooks/useVault';
import { SwellIcon } from '../theme/uiComponents';
import { shortenAddress } from '../utils';

const VaultDetail: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { index } = useParams<{ index: string }>();
  const { account } = useWeb3React();
  const matches = useMediaQuery(`(max-width:${theme.breakpoints.values.sm}px)`);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { loading, vaultDetail } = useVaultDetail((Number(index) - 1)!, account);
  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);
  if (loading) {
    return <></>;
  }
  return (
    <>
      <Typography
        component="span"
        onClick={() => navigate('/vaults')}
        role="button"
        sx={{ alignItems: 'center', marginBottom: '10px', display: 'block' }}
      >
        <ArrowBack />
        Back to all vaults
      </Typography>
      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '20px' }}>
        <SwellIcon size="sm" />
        <Typography component="h3" sx={{ alignItems: 'center', fontSize: '22px', marginBottom: 0 }} variant="h3">
          {vaultDetail && vaultDetail.address && shortenAddress(vaultDetail.address)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Box sx={{ maxWidth: ['100%', '42%'] }}>
          <Card
            sx={{
              color: theme.palette.common.white,
              background: theme.palette.background.blueGradient,
              border: 0,
              mb: '20px',
            }}
          >
            <CardHeader
              sx={{ '& .MuiTypography-root': { m: 0, fontSize: '16px' }, border: `1px solid ${alpha('#fff', 0.3)}` }}
              title="Vault overview"
            />
            <CardContent>
              <VaultDetailCardRow name="APR" value={`${vaultDetail?.averageAPR}%`} />
              <VaultDetailCardRow
                name="Total assets"
                value={
                  <>
                    <SwellIcon color="default" sx={{ marginRight: '5px' }} />
                    {vaultDetail?.balance}
                  </>
                }
              />
              <VaultDetailCardRow name="Vault type" value="Vault type" />
              <VaultDetailCardRow
                name="Website"
                value={
                  <>
                    vaultname.com
                    <TransitEnterexit
                      sx={{
                        transform: 'rotate(180deg)',
                        fontSize: '16px',
                      }}
                    />
                  </>
                }
              />
            </CardContent>
          </Card>
          {matches && <VaultTransactionTabPanel />}
          <VaultDetailCard sx={{ marginBottom: '30px' }} title="About">
            The Swell Curve Vault involves providing liquidity to a swETH and ETH liquidity pool on Curve. Liquidity
            providers will receive LP tokens in return which can be further staked in a Curve Gauge. The relevant
            transactions against the liquidity pool compound base ETH staking yield through the trading fees denominated
            in CRV tokens which are paid out to liquidity providers as well as liquidity mining incentives earned in
            swDAO. On withdrawal, these tokens will be converted back to swETH for single-asset simplicity.
          </VaultDetailCard>
          <VaultDetailCard title="Strategy">
            This strategy utilizes underlying swETH in your swNFT to provide liquidity in the Swell Curve Vault. The
            Swell Curve Vault involves providing liquidity to the CUrve sweTH pool to receive pool trading fees in CRV.
            On top of this, liquidity providers will receive swDAO rewards proportional to provide liquidity. Throughout
            this process, the existing swETH staking rewards are retained to continuously benefit from ETH staking
            rewards Additional benefits include governance token ownership in Swell Network DAO with the swDAO liquidity
            mining incentive program.
          </VaultDetailCard>
        </Box>
        {!matches && <VaultTransactionTabPanel />}
      </Box>
    </>
  );
};

export default VaultDetail;
