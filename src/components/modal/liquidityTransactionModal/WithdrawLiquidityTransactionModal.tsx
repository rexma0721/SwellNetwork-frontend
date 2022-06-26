/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useWeb3React } from 'web3-react-core';

import { useSwNftContract } from '../../../hooks/useContract';
import { useV3Positions } from '../../../hooks/useV3Positions';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setIsWithdrawLiquidityTransactionModalOpen } from '../../../state/modal/modalSlice';
import { Modal, SwellIcon } from '../../../theme/uiComponents';
import { displayErrorMessage } from '../../../utils/errors';
import { liquidityTransactionModalFormSchema as schema } from '../../../validations/liquidityTransactionModalFormSchema';
import MultiSelect from '../../common/MultiSelect';
import LiquidityTransaction, { LiquidityTransactionType } from '../../liquidityTransaction';
import { BatchAction } from '../../liquidityTransaction/BatchAction';
import IOption from './IOption';

const WithdrawLiquidityTransactionModal: FC = () => {
  const { account } = useWeb3React();
  const method = useForm({
    mode: 'onSubmit',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });
  const swNFTContract = useSwNftContract();
  const { enqueueSnackbar } = useSnackbar();

  const { isWithdrawLiquidityTransactionModalOpen } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { handleSubmit } = method;

  const submitHandler = async (data: any) => {
    try {
      if (
        account &&
        swNFTContract &&
        data &&
        data.amount &&
        data.amount !== '' &&
        data.positions &&
        data.positions.length > 0
      ) {
        const withdrawAmount = ethers.utils.parseEther(data.amount.toString());
        const tx = await swNFTContract.batchAction(
          data.positions.map((positionId: string) => ({
            tokenId: positionId,
            action: BatchAction.WITHDRAW,
            amount: withdrawAmount,
            strategy: '0',
          }))
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          enqueueSnackbar('Withdrawal successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Withdrawal unsuccessful', { variant: 'error' });
        }
      }
      dispatch(setIsWithdrawLiquidityTransactionModalOpen(false));
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    }
  };
  const [options, setOptions] = useState<IOption[]>([]);
  const { positions, loading } = useV3Positions(account);

  const fetchOptions = useCallback(() => {
    if (!loading && positions && positions.length > 0) {
      const fetchedOptions = positions?.map((position) => ({
        label: position.tokenId.toString(),
        value: position.tokenId.toString(),
      }));
      setOptions(fetchedOptions);
    } else {
      setOptions([]);
    }
  }, [loading, positions]);

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line no-console
    <Modal
      icon={<SwellIcon size="sm" />}
      maxWidth="sm"
      onClose={() => dispatch(setIsWithdrawLiquidityTransactionModalOpen(false))}
      open={isWithdrawLiquidityTransactionModalOpen}
      title="Withdraw Total Position"
    >
      <Typography component="p" sx={{ paddingBottom: 'unset', fontWeight: 500, paddingInline: '8px' }}>
        Choose positions to exit
      </Typography>
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <MultiSelect name="positions" options={options} required />
          <Card
            sx={{
              border: (theme) => `2px solid ${theme.palette.grey[300]}`,
            }}
          >
            <LiquidityTransaction sx={{ '& > div': { padding: 0 } }} type={LiquidityTransactionType.WITHDRAW} />
          </Card>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default WithdrawLiquidityTransactionModal;
