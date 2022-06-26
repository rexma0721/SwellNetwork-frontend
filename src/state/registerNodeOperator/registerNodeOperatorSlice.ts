import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INodeOperator } from '../nodeOperator/NodeOperator.interface';

export interface IRegisterWithEthdoFields {
  // validatorPublicKeys: string;
  publicKey: string;
  totalEth: string;
  signature: string;
  depositDataRoot: string;
  isSubmitted?: boolean;
}

interface IFormValues {
  becomeAVerifiedNodeOperator: INodeOperator;
  formValues: IRegisterWithEthdoFields[];
}

const initialState: IFormValues = {
  becomeAVerifiedNodeOperator: {} as INodeOperator,
  formValues: [...Array(16)].map(() => ({ isSubmitted: false } as IRegisterWithEthdoFields)),
};

export const registerEthdoStepperSlice = createSlice({
  name: 'registerEthDo',
  initialState,
  reducers: {
    setBecomeAVerifiedNodeOperator: (state, action: PayloadAction<INodeOperator>) => {
      state.becomeAVerifiedNodeOperator = action.payload;
    },
    setFormValues: (
      state,
      action: PayloadAction<{
        index: number;
        formValues: IRegisterWithEthdoFields;
      }>
    ) => {
      state.formValues[action.payload.index] = action.payload.formValues;
    },
  },
});

export const { setBecomeAVerifiedNodeOperator, setFormValues } = registerEthdoStepperSlice.actions;

export default registerEthdoStepperSlice.reducer;
