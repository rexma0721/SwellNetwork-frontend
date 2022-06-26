import { FC, ReactNode } from 'react';

import TransitEnterexitIcon from '@mui/icons-material/TransitEnterexit';
import { Box, Card, CardContent, CardHeader, styled } from '@mui/material';

import { MuiTooltip } from '../../theme/uiComponents';

type RowProps = {
  label: string | ReactNode;
  value: string;
};

const Row = styled(({ label, value, ...props }: RowProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...props}>
    <Box>{label}</Box>
    <small>{value}</small>
  </div>
))({
  display: 'flex',
  justifyContent: 'space-between',
  '&:not(:last-child)': {
    marginBottom: 20,
  },
  '& small': {
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 20,
  },
});

const Statistics: FC = () => (
  <Card>
    <CardHeader
      sx={{
        '& span': {
          display: 'flex',
          marginBottom: 0,
          justifyContent: 'space-between',
          '& svg': {
            transform: 'rotate(180deg)',
          },
        },
      }}
      title={
        <>
          <span>Swell Stats</span>
          <TransitEnterexitIcon />
        </>
      }
    />
    <CardContent>
      <Row label="Total ETH staked with Swell" value="999" />
      <Row
        label={
          <>
            APR <MuiTooltip title="Annual Percentage Rate" />
          </>
        }
        value="999"
      />
      <Row label="Unique staking wallets" value="999" />
      <Row label="TVL" value="$999" />
    </CardContent>
  </Card>
);

export default Statistics;
