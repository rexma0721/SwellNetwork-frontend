import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
import { useWeb3React } from 'web3-react-core';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setIsWalletModalOpen } from '../../state/modal/modalSlice';

interface IProps {
  watchField: string;
  ethBalance: CurrencyAmount<Currency> | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export const StakeButtons: FC<IProps> = ({ watchField, ethBalance }) => {
  const { account } = useWeb3React();
  const dispatch = useAppDispatch();
  const { selectedNodeOperator } = useAppSelector((state) => state.nodeOperator);
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  let amount = Number(watch(watchField));
  const [isBalanceInsufficient, setIsBalanceInsufficient] = useState(false);
  if (amount === null || amount === undefined || typeof amount === 'string') {
    amount = 0;
  }
  useEffect(() => {
    if (account && ethBalance && amount >= 0) {
      const parsedEthBalance = ethers.utils.parseEther(ethBalance?.toSignificant());
      const parsedAmount = ethers.utils.parseEther(amount.toString());
      if (parsedEthBalance.lt(parsedAmount)) {
        setIsBalanceInsufficient(true);
      } else {
        setIsBalanceInsufficient(false);
      }
    }
  }, [account, amount, ethBalance]);

  return (
    <>
      {account ? (
        // eslint-disable-next-line react/jsx-max-props-per-line
        <LoadingButton
          disabled={isSubmitting || isBalanceInsufficient || selectedNodeOperator === null}
          fullWidth
          loading={isSubmitting}
          sx={{ marginBottom: '20px' }}
          type="submit"
          variant="contained"
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {selectedNodeOperator === null ? 'Select a Node Operator' : 'Stake'}
        </LoadingButton>
      ) : (
        <Button fullWidth onClick={() => dispatch(setIsWalletModalOpen(true))} size="large">
          Connect wallet
        </Button>
      )}
    </>
  );
};
