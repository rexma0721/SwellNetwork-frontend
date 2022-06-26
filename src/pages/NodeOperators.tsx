import React, { useEffect } from 'react';

import { Card, Typography } from '@mui/material';

import NodeOperatorCard from '../components/nodeOperators/NodeOperatorCard';
import { useAppDispatch } from '../state/hooks';
import nodeOperatorsList from '../state/nodeOperator/nodeOperator';
import { setNodeOperators } from '../state/nodeOperator/nodeOperatorSlice';

const NodeOperators: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setNodeOperators(nodeOperatorsList));
  }, [dispatch]);
  return (
    <>
      <Typography
        component="h2"
        sx={{
          marginBottom: '40px',
          textAlign: 'center',
        }}
        variant="h2"
      >
        Node Operators
      </Typography>
      <Card
        sx={{
          padding: ['20px', '60px 25px'],
        }}
      >
        <NodeOperatorCard sx={{ maxWidth: '550px', marginInline: 'auto' }} />
      </Card>
    </>
  );
};

export default NodeOperators;
