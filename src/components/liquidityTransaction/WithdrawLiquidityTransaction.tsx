import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';

import LiquidityTransaction, { LiquidityTransactionType } from '.';
import { useSwNftContract } from '../../hooks/useContract';
import { displayErrorMessage } from '../../utils/errors';
import { liquidityTransactionFormSchema as schema } from '../../validations/liquidityTransactionFormSchema';

// eslint-disable-next-line import/prefer-default-export
export const WithdrawLiquidityTransaction: FC = () => {
  const method = useForm({
    mode: 'onSubmit',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    resolver: yupResolver(schema),
  });
  const { handleSubmit, reset } = method;
  const swNFTContract = useSwNftContract();
  const { id: selectedPositionId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async (data: any) => {
    try {
      if (data && data.amount && swNFTContract) {
        const withdrawAmount = ethers.utils.parseEther(data.amount.toString());
        const tx = await swNFTContract.withdraw(selectedPositionId, withdrawAmount);
        const receipt = await tx.wait();
        if (receipt.status) {
          enqueueSnackbar('Withdrawal successful', { variant: 'success' });
          reset({ amount: '' });
        } else {
          enqueueSnackbar('Withdrawal unsuccessful', { variant: 'error' });
        }
      }
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    }
  };
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <LiquidityTransaction type={LiquidityTransactionType.WITHDRAW} />
      </form>
    </FormProvider>
  );
};
