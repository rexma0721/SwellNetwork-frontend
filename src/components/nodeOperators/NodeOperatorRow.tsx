import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowForward, InfoOutlined } from '@mui/icons-material';
import { Box, Card, IconButton, useTheme } from '@mui/material';

import { useAppDispatch } from '../../state/hooks';
import { setIsNodeOperatorInfoModalOpen, setIsNodeOperatorModalOpen } from '../../state/modal/modalSlice';
import { INodeOperator } from '../../state/nodeOperator/NodeOperator.interface';
import { setNodeOperatorInfoToDisplay, setSelectedNodeOperator } from '../../state/nodeOperator/nodeOperatorSlice';

interface IProps {
  nodeOperator: INodeOperator;
}

const NodeOperatorRow: React.FC<IProps> = ({ nodeOperator }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const infoHandler = () => {
    dispatch(setNodeOperatorInfoToDisplay(nodeOperator));
    dispatch(setIsNodeOperatorInfoModalOpen(true));
  };

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.common.white,
        border: `1px solid ${theme.palette.grey[100]}`,
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        gap: '10px',
        justifyContent: 'space-between',
        '& > svg': {
          color: theme.palette.primary.main,
          width: '42px',
          height: '42px',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
        <Box
          sx={{
            height: '35px',
            width: '35px',
            minWidth: '35px',
            backgroundColor: theme.palette.grey[200],
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
              alignItems: 'unset',
              justifyContent: 'unset',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              '& > span': {
                fontSize: '18px',
              },
            }}
          >
            <span>{nodeOperator.name}</span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
            }}
          >
            <Box
              onClick={infoHandler}
              sx={{
                padding: '5px 8px',
                display: 'flex',
                alignItems: 'center',
                border: `1px solid ${theme.palette.grey[200]}`,
                borderRadius: '8px',
                '& > span': {
                  color: theme.palette.primary.main,
                },
                [theme.breakpoints.down('sm')]: { border: 0, padding: 0 },
              }}
            >
              <IconButton
                sx={{
                  width: 14,
                  height: 14,
                  padding: 0,
                  margin: '0 1px',
                  verticalAlign: 'middle',
                  '& svg': {
                    width: 14,
                    height: 14,
                  },
                }}
              >
                <InfoOutlined />
              </IconButton>
              <span role="button">More info</span>
            </Box>
          </Box>
        </Box>
      </Box>
      <span role="button">
        <ArrowForward
          onClick={() => {
            dispatch(setSelectedNodeOperator(nodeOperator));
            dispatch(setIsNodeOperatorModalOpen(false));
            navigate('/stake');
          }}
        />
      </span>
    </Card>
  );
};

export default NodeOperatorRow;
