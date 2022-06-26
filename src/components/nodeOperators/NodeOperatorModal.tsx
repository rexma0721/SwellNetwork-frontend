import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setIsNodeOperatorModalOpen } from '../../state/modal/modalSlice';
import nodeOperatorsList from '../../state/nodeOperator/nodeOperator';
import { setNodeOperators } from '../../state/nodeOperator/nodeOperatorSlice';
import { Modal } from '../../theme/uiComponents';
import NodeOperatorCard from './NodeOperatorCard';

const NodeOperatorModal: React.FC = () => {
  const { isNodeOperatorModalOpen } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setNodeOperators(nodeOperatorsList));
  }, [dispatch]);
  return (
    <Modal
      maxWidth="sm"
      onClose={() => dispatch(setIsNodeOperatorModalOpen(false))}
      open={isNodeOperatorModalOpen}
      sx={{
        '& .MuiDialogTitle-root': {
          paddingInline: '30px',
          '& .close-btn': {
            right: '15px',
          },
        },
        '& .MuiDialogContent-root': {
          paddingInline: '25px',
        },
      }}
      title="Select Node Operator"
    >
      <NodeOperatorCard />
    </Modal>
  );
};
export default NodeOperatorModal;
