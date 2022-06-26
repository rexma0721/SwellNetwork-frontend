import { FC } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { BigNumber, ethers } from 'ethers';

import { UsePositionTokenURIResult } from '../../hooks/usePositionTokenURI';
import { List, ListColumn, SwellIcon } from '../../theme/uiComponents';
import { PositionDetails } from '../../types/position';
import NFT from '../common/PositionAnimation';

interface NFTPositionProps {
  loading: boolean;
  metadata: UsePositionTokenURIResult;
  positionDetails: PositionDetails | undefined;
  totalSwEthInVault: BigNumber;
}

const NFTPosition: FC<NFTPositionProps> = ({ loading, metadata, positionDetails, totalSwEthInVault }) => {
  let url = '';
  if (metadata && 'result' in metadata) {
    url = metadata.result.image;
  }
  const formattedBaseTokenBalance = positionDetails
    ? ethers.utils.formatEther(positionDetails.baseTokenBalance).split('.')[0]
    : '0.00';
  return (
    <List
      sx={{
        padding: '12px 5px 16px 5px',
        background: (theme) => theme.palette.background.primaryGradient,
        color: (theme) => theme.palette.common.white,
        marginBottom: 'unset',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        {url ? <NFT height={400} image={url} /> : <Box height={400}>{loading && <CircularProgress />}</Box>}
      </Box>
      <ListColumn>
        Total swETH available
        <span>
          <SwellIcon color="default" size="xs" />
          {formattedBaseTokenBalance}
        </span>
      </ListColumn>
      <ListColumn>
        Total swETH in vault
        <span>
          <SwellIcon color="default" size="xs" />
          {Number(ethers.utils.formatEther(totalSwEthInVault.toString()))}
        </span>
      </ListColumn>
      <ListColumn>
        Average APR
        <span>4%</span>
      </ListColumn>
      <ListColumn>
        Rewards
        <span>
          <SwellIcon color="default" size="xs" />
          0.00
        </span>
      </ListColumn>
    </List>
  );
};

export default NFTPosition;
