import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isWalletModalOpen: false,
  isNodeOperatorModalOpen: false,
  isConfirmStakeModalOpen: false,
  isDepositLiquidityTransactionModalOpen: false,
  isWithdrawLiquidityTransactionModalOpen: false,
  isNodeOperatorInfoModalOpen: false,
  isVaultTransactionModalOpen: false,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setIsWalletModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWalletModalOpen = action.payload;
    },
    setIsNodeOperatorModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNodeOperatorModalOpen = action.payload;
    },
    setIsConfirmStakeModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isConfirmStakeModalOpen = action.payload;
    },
    setIsDepositLiquidityTransactionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isDepositLiquidityTransactionModalOpen = action.payload;
    },
    setIsWithdrawLiquidityTransactionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWithdrawLiquidityTransactionModalOpen = action.payload;
    },
    setIsNodeOperatorInfoModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNodeOperatorInfoModalOpen = action.payload;
    },
    setIsVaultTransactionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isVaultTransactionModalOpen = action.payload;
    },
  },
});

export const {
  setIsWalletModalOpen,
  setIsConfirmStakeModalOpen,
  setIsDepositLiquidityTransactionModalOpen,
  setIsWithdrawLiquidityTransactionModalOpen,
  setIsNodeOperatorInfoModalOpen,
  setIsNodeOperatorModalOpen,
  setIsVaultTransactionModalOpen,
} = applicationSlice.actions;

export default applicationSlice.reducer;
