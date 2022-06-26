/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useWeb3React } from 'web3-react-core';

import { useSWETHContract, useSwNftContract } from '../../../hooks/useContract';
import { useV3Positions } from '../../../hooks/useV3Positions';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setIsDepositLiquidityTransactionModalOpen } from '../../../state/modal/modalSlice';
import { Modal } from '../../../theme/uiComponents';
import { displayErrorMessage } from '../../../utils/errors';
import { liquidityTransactionModalFormSchema as schema } from '../../../validations/liquidityTransactionModalFormSchema';
import MultiSelect from '../../common/MultiSelect';
import LiquidityTransaction, { LiquidityTransactionType } from '../../liquidityTransaction';
import { BatchAction } from '../../liquidityTransaction/BatchAction';
import IOption from './IOption';

const DepositLiquidityTransactionModal: FC = () => {
  const { account, chainId } = useWeb3React();
  const { isDepositLiquidityTransactionModalOpen } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const swNFTContract = useSwNftContract();
  const swETHContract = useSWETHContract();
  const method = useForm({
    mode: 'onSubmit',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { handleSubmit } = method;
  const [options, setOptions] = useState<IOption[]>([]);
  const { positions, loading } = useV3Positions(account);
  const { enqueueSnackbar } = useSnackbar();

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

  const submitHandler = async (data: any) => {
    try {
      if (
        account &&
        chainId &&
        swNFTContract &&
        swETHContract &&
        data &&
        data.amount &&
        data.amount !== '' &&
        data.positions &&
        data.positions.length > 0
      ) {
        const depositAmount = ethers.utils.parseEther(data.amount.toString());
        const tx = await swNFTContract.batchAction(
          data.positions.map((positionId: string) => ({
            tokenId: positionId,
            action: BatchAction.DEPOSIT,
            amount: depositAmount,
            strategy: '0',
          }))
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          dispatch(setIsDepositLiquidityTransactionModalOpen(false));
          enqueueSnackbar('Deposit successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Deposit unsuccessful', { variant: 'error' });
        }
      }
      dispatch(setIsDepositLiquidityTransactionModalOpen(false));
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    }
  };

  return (
    // eslint-disable-next-line no-console
    <Modal
      maxWidth="sm"
      onClose={() => dispatch(setIsDepositLiquidityTransactionModalOpen(false))}
      open={isDepositLiquidityTransactionModalOpen}
      sx={{
        '& .MuiDialogContent-root': {
          paddingTop: 0,
          padding: {
            sm: '0px 28px 20px',
          },
        },
      }}
      title="Deposit Total Position"
    >
      <Typography component="p" sx={{ paddingBottom: 'unset', fontWeight: 500, paddingInline: '8px' }}>
        Choose positions to enter
      </Typography>

      <FormProvider {...method}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <MultiSelect name="positions" options={options} required />

          <Card
            sx={{
              border: (theme) => `2px solid ${theme.palette.grey[300]}`,
            }}
          >
            <LiquidityTransaction sx={{ '& > div': { padding: 0 } }} type={LiquidityTransactionType.DEPOSIT} />
          </Card>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default DepositLiquidityTransactionModal;
