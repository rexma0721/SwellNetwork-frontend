import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, BoxProps, Typography, useTheme } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setIsNodeOperatorModalOpen } from '../../state/modal/modalSlice';
import { swellDefaultNode } from '../../state/nodeOperator/nodeOperator';
import { setSelectedNodeOperator } from '../../state/nodeOperator/nodeOperatorSlice';
import { SwellIcon } from '../../theme/uiComponents';
import VerifiedUser from '../common/VerifiedUser';
import NodeCard from './NodeCard';
import NodeOperatorRow from './NodeOperatorRow';

const NodeOperatorCard: React.FC<BoxProps> = ({ ...props }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isNodeOperatorModalOpen } = useAppSelector((state) => state.modal);
  const { nodeOperators } = useAppSelector((state) => state.nodeOperator);
  return (
    <Box {...props}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          justifyContent: 'center',
          color: '#000',
          fontSize: '40px',
          gap: '20px',
          marginBottom: '30px',
          [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
          },
        }}
      >
        <NodeCard
          onClick={() => {
            dispatch(setSelectedNodeOperator(swellDefaultNode));
            dispatch(setIsNodeOperatorModalOpen(false));
            if (!isNodeOperatorModalOpen) navigate('/stake');
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              [theme.breakpoints.down('sm')]: {
                justifyContent: 'space-between',
              },
            }}
          >
            <SwellIcon size="md" />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                '& > span': {
                  fontSize: '20px',
                  fontWeight: '600',
                },
              }}
            >
              <span>Swell Network</span>
              <VerifiedUser />
            </Box>
          </Box>
          <span role="button">
            <ArrowForwardIcon className="forward-icon" />
          </span>
        </NodeCard>
        <NodeCard
          onClick={() => {
            dispatch(setIsNodeOperatorModalOpen(false));
            navigate('/become-a-node-operator');
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& > span': {
                fontSize: '18px',
                fontWeight: '600',
              },
            }}
          >
            <span>Become a Node Operator</span>
          </Box>
          <span role="button">
            <ArrowForwardIcon className="forward-icon" />
          </span>
        </NodeCard>
      </Box>
      <Typography
        component="p"
        sx={{
          textAlign: 'center',
          marginBottom: '17px',
          fontSize: '13px',
        }}
      >
        Other node operators on Swell
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '10px',
          '& .MuiPaper-root': {
            borderRadius: '15px !important',
          },
        }}
      >
        {nodeOperators.map((nodeOperator) => (
          <NodeOperatorRow key={`node_${nodeOperator.name}_${nodeOperator.isVerified}`} nodeOperator={nodeOperator} />
        ))}
      </Box>

      <LoadingButton size="small" sx={{ width: '100%', fontSize: '13px' }}>
        Load More
      </LoadingButton>
    </Box>
  );
};

export default NodeOperatorCard;
