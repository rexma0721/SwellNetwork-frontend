/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react';

import { Box, Card, CardContent, CardHeader, styled } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setIsNodeOperatorInfoModalOpen } from '../../../state/modal/modalSlice';
import { Modal, SwellIcon } from '../../../theme/uiComponents';

/*
// @TODO
create redux store for open modal 
store wallet data into redux store
*/

type RowProps = {
  label: string;
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
    fontSize: 13,
    marginLeft: 20,
  },
});

const InfoCardHeader = styled(CardHeader)(() => ({
  padding: 0,
  '& .MuiTypography-root': {
    paddingBottom: '10px',
    paddingLeft: '10px',
    margin: '0px',
    fontWeight: 500,
    fontSize: '16px',
  },
}));
const InfoCardContent = styled(CardContent)(({ theme }) => ({
  border: `2px solid ${theme.palette.grey[300]}`,
  borderRadius: '8px',
  marginBottom: '20px',
  padding: '16px',
  '& .MuiCardContent-root': {
    border: `2px solid ${theme.palette.grey[300]}`,
    borderRadius: '8px',
  },
}));

const NodeOperatorInfoModal: FC = () => {
  const { isNodeOperatorInfoModalOpen } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { nodeOperatorInfoToDisplay } = useAppSelector((state) => state.nodeOperator);
  return (
    // eslint-disable-next-line no-console
    <Modal
      icon={<SwellIcon size="sm" />}
      onClose={() => dispatch(setIsNodeOperatorInfoModalOpen(false))}
      open={isNodeOperatorInfoModalOpen}
      sx={{
        '& .MuiTypography-root': {
          paddingBottom: '30px',
        },
      }}
      title={nodeOperatorInfoToDisplay?.operatorDetails.name ?? 'Node Operator'}
    >
      <Card
        sx={{
          border: (theme) => `0px solid ${theme.palette.grey[100]}`,
          borderRadius: '8px',
        }}
      >
        <InfoCardHeader title="Server information" />
        <InfoCardContent>
          <Row label="Location" value={nodeOperatorInfoToDisplay?.serverDetails.location || 'N/A'} />
          <Row label="CPU" value={nodeOperatorInfoToDisplay?.serverDetails.cpu || 'N/A'} />
          <Row label="RAM" value={nodeOperatorInfoToDisplay?.serverDetails.ram || 'N/A'} />
          <Row label="Network bandwidth" value={nodeOperatorInfoToDisplay?.serverDetails.networkBandwidth || 'N/A'} />
          <Row label="Storage" value={nodeOperatorInfoToDisplay?.serverDetails.storage || 'N/A'} />
        </InfoCardContent>
      </Card>
      <Card>
        <InfoCardHeader title="Operator details" />
        <InfoCardContent>
          <Row label="Type" value={nodeOperatorInfoToDisplay?.operatorDetails.type || 'N/A'} />
          <Row label="Name" value={nodeOperatorInfoToDisplay?.operatorDetails.name || 'N/A'} />
          <Row
            label="Years of experience"
            value={nodeOperatorInfoToDisplay?.operatorDetails.yearsOfExperience.toString() || 'N/A'}
          />
          <Row label="Website" value={nodeOperatorInfoToDisplay?.operatorDetails.website || 'N/A'} />
          <Row label="Socials" value={nodeOperatorInfoToDisplay?.operatorDetails.socialMediaUrl || 'N/A'} />
        </InfoCardContent>
      </Card>
    </Modal>
  );
};

export default NodeOperatorInfoModal;
