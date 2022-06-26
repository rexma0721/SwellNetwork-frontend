import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useWeb3React } from 'web3-react-core';

import LiquidityTransaction, { LiquidityTransactionType } from '.';
import { useSWETHContract, useSwNftContract } from '../../hooks/useContract';
import { displayErrorMessage } from '../../utils/errors';
import { liquidityTransactionFormSchema as schema } from '../../validations/liquidityTransactionFormSchema';

// eslint-disable-next-line import/prefer-default-export
export const DepositLiquidityTransaction: FC = () => {
  const { account, chainId } = useWeb3React();
  const method = useForm({
    mode: 'onSubmit',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { handleSubmit, reset } = method;
  const swNFTContract = useSwNftContract();
  const swETHContract = useSWETHContract();
  const { id: selectedPositionId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async (data: any) => {
    try {
      if (account && chainId && data && data.amount && swETHContract && swNFTContract) {
        const depositAmount = ethers.utils.parseEther(data.amount.toString());
        const tx = await swNFTContract.deposit(selectedPositionId, depositAmount);
        const receipt = await tx.wait();
        if (receipt.status) {
          reset({ amount: '' });
          enqueueSnackbar('Deposit successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Deposit unsuccessful', { variant: 'error' });
        }
      }
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    }
  };
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <LiquidityTransaction type={LiquidityTransactionType.DEPOSIT} />
      </form>
    </FormProvider>
  );
};
