import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { styled } from '@mui/material';
import { BigNumber, ethers } from 'ethers';

import { useAllVaultsWithPositions } from '../../hooks/useVault';
import { List, ListColumn, ListHeader, SwellIcon } from '../../theme/uiComponents';
import { PositionDetails } from '../../types/position';

const DataContainer = styled(ListColumn)(() => ({
  padding: 0,
  '& .MuiChip-root': {
    fontSize: 10,
    '& span': {
      fontWeight: 600,
    },
  },
  '& > span': {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 1,
  },
}));

const PositionContent = styled('div')(({ theme }) => ({
  display: 'grid',
  justifyContent: 'space-evenly',
  marginBottom: 20,
  padding: '10px 0',
  gridGap: '0px 15px',
  paddingRight: '20px',
  gridTemplateColumns: 'repeat(4, 1fr)',
  [theme.breakpoints.between('sm', 'md')]: {
    gridGap: '0px 10px',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    paddingRight: '0px',
  },
}));

interface PositionListItemProps {
  position: PositionDetails;
}

const PositionsListItem: FC<PositionListItemProps> = ({ position }) => {
  const navigate = useNavigate();
  const formattedTokenId = position.tokenId.toString().split('.')[0];
  const formattedBaseTokenBalance = ethers.utils.formatEther(position.baseTokenBalance).split('.')[0];
  const viewDetailedPosition = () => {
    navigate(`/position/${formattedTokenId}`);
    window.scrollTo({ top: 0 });
  };
  const [balances] = useAllVaultsWithPositions(position.tokenId);
  const totalSwEthInVault = Object.values(balances).reduce(
    (previousValue, currentValue) => previousValue.add(currentValue),
    BigNumber.from(0)
  );
  return (
    <List onClick={viewDetailedPosition} sx={{ cursor: 'pointer' }}>
      <ListHeader>
        <DataContainer>
          <SwellIcon size="sm" />
          <span>{formattedTokenId}</span>
        </DataContainer>
        <DataContainer>
          <span role="button">
            <ArrowForwardIcon />
          </span>
        </DataContainer>
      </ListHeader>
      <PositionContent>
        <ListColumn>
          swETH available
          <span>
            <SwellIcon size="xs" />
            {formattedBaseTokenBalance}
          </span>
        </ListColumn>
        <ListColumn>
          swETH in vault
          <span>
            <SwellIcon size="xs" />
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
            <SwellIcon size="xs" />0
          </span>
        </ListColumn>
      </PositionContent>
    </List>
  );
};

export default PositionsListItem;
