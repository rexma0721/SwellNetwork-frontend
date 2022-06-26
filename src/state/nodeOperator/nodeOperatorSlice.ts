import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INodeOperator } from './NodeOperator.interface';

const initialState: {
  nodeOperatorInfoToDisplay: INodeOperator | null;
  selectedNodeOperator: INodeOperator | null;
  nodeOperators: INodeOperator[];
} = {
  nodeOperatorInfoToDisplay: null,
  selectedNodeOperator: null,
  nodeOperators: [],
};

export const nodeOperatorSlice = createSlice({
  name: 'nodeOperator',
  initialState,
  reducers: {
    setNodeOperatorInfoToDisplay: (state, action: PayloadAction<INodeOperator>) => {
      state.nodeOperatorInfoToDisplay = action.payload;
    },
    setSelectedNodeOperator: (state, action: PayloadAction<INodeOperator>) => {
      state.selectedNodeOperator = action.payload;
    },
    setNodeOperators: (state, action: PayloadAction<INodeOperator[]>) => {
      state.nodeOperators = action.payload;
    },
  },
});

export const { setNodeOperatorInfoToDisplay, setSelectedNodeOperator, setNodeOperators } = nodeOperatorSlice.actions;

export default nodeOperatorSlice.reducer;
