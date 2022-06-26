import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card } from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useSnackbar } from 'notistack';

import { useSwNftContract } from '../../hooks/useContract';
import { displayErrorMessage } from '../../utils/errors';
import { vaultTransactionSchema } from '../../validations/vault-transaction.schema';
import ChoosePosition from '../common/ChoosePosition';
import { PrepopulateInputBasedOnSelectedPosition } from './PrepolulateInputBasedOnSelectedPosition';

export enum VaultTransactionType {
  ENTER = 'ENTER',
  EXIT = 'EXIT',
}

interface VaultTransactionProps {
  type: VaultTransactionType;
}

const VaultTransaction: FC<VaultTransactionProps> = ({ type }) => {
  const method = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(vaultTransactionSchema),
  });
  const { index } = useParams<{ index: string }>();
  const { handleSubmit, reset, setValue } = method;
  const { enqueueSnackbar } = useSnackbar();
  const swNFTContract = useSwNftContract();
  const [isPendingTransaction, setPendingTransaction] = useState(false);

  const onEnterVault = async (data: any) => {
    try {
      if (data && data.amount && swNFTContract) {
        setPendingTransaction(true);
        const amount = ethers.utils.parseUnits(data.amount.toString());
        const tx = await swNFTContract.enterStrategy(
          data.position.name,
          BigNumber.from((Number(index) - 1).toString()),
          amount
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          reset();
          setValue('amount', '');
          enqueueSnackbar('Transaction successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Transaction failed', { variant: 'error' });
        }
      }
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    } finally {
      setPendingTransaction(false);
    }
  };
  const onExitVault = async (data: any) => {
    try {
      if (data && data.amount && swNFTContract) {
        setPendingTransaction(true);
        const amount = ethers.utils.parseEther(data.amount.toString());
        const tx = await swNFTContract.exitStrategy(
          data.position.name,
          BigNumber.from((Number(index) - 1).toString()),
          amount
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          reset();
          setValue('amount', '');
          enqueueSnackbar('Transaction successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Transaction failed', { variant: 'error' });
        }
      }
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    } finally {
      setPendingTransaction(false);
    }
  };
  const onSubmit = (data: any) => {
    if (type === VaultTransactionType.ENTER) {
      onEnterVault(data);
    } else {
      onExitVault(data);
    }
  };

  return (
    <Card
      sx={{
        padding: {
          xs: '22px 0',
          sm: '22px 15px',
          lg: '22px',
        },
        width: '100%',
      }}
    >
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ChoosePosition
            name="position"
            placeholder={type === VaultTransactionType.ENTER ? 'Choose position to enter' : 'Choose position to exit'}
            vaultTransactionType={type}
          />
          <PrepopulateInputBasedOnSelectedPosition
            adornmentType="node"
            icon="swell"
            name="amount"
            tooltip="Must be at least 1 swETH and must be an integer(whole number)"
            watchField="position"
          />
          <LoadingButton
            disabled={isPendingTransaction}
            fullWidth
            loading={isPendingTransaction}
            sx={{ marginBottom: '20px', textTransform: 'none' }}
            type="submit"
            variant="contained"
          >
            {type === VaultTransactionType.ENTER ? 'Enter vault' : 'Exit vault'}
          </LoadingButton>
        </form>
      </FormProvider>
    </Card>
  );
};

export default VaultTransaction;
