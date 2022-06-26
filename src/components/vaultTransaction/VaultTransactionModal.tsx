import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card } from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useWeb3React } from 'web3-react-core';

import { useSwNftContract } from '../../hooks/useContract';
import { useV3Positions } from '../../hooks/useV3Positions';
import { useVaults } from '../../hooks/useVault';
import { useAppDispatch } from '../../state/hooks';
import { setIsVaultTransactionModalOpen } from '../../state/modal/modalSlice';
import { displayErrorMessage } from '../../utils/errors';
import { vaultTransactionModalSchema } from '../../validations/vault-transaction-modal.schema';
import { VaultTransactionType } from '../common/ChoosePosition';
import InputController from '../common/InputController';
import MultiSelect from '../common/MultiSelect';
import { BatchAction } from '../liquidityTransaction/BatchAction';
import IOption from '../modal/liquidityTransactionModal/IOption';
import { PrepopulateInputBasedOnSelectedPosition } from './PrepolulateInputBasedOnSelectedPosition';

interface VaultTransactionProps {
  type: VaultTransactionType;
}

const VaultTransactionModal: FC<VaultTransactionProps> = ({ type }) => {
  const method = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(vaultTransactionModalSchema),
  });
  const dispatch = useAppDispatch();
  const { handleSubmit, watch, reset, setValue } = method;
  const { enqueueSnackbar } = useSnackbar();
  const swNFTContract = useSwNftContract();
  const [isPendingTransaction, setPendingTransaction] = useState(false);
  const { loading, vaults } = useVaults();
  const { account } = useWeb3React();
  const { loading: loadingPositions, positions } = useV3Positions(account);
  const [positionOptions, setPositionOptions] = useState<IOption[]>([]);
  const strategyId = watch('strategy');
  const enterPositions: IOption[] =
    positions
      ?.filter((position) => Number(ethers.utils.formatEther(position.baseTokenBalance)) > 0)
      .map((position) => ({
        label: position.tokenId.toString(),
        value: position.tokenId.toString(),
      })) || [];

  const fetchExitOptions = useCallback(() => {
    const fetchedOptions = positions
      ?.filter(
        (position) => Number(ethers.utils.formatEther(position.value.sub(position.baseTokenBalance).toString())) > 0
      )
      .map((position) => ({
        label: position.tokenId.toString(),
        value: position.tokenId.toString(),
      }));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setPositionOptions(fetchedOptions!);
  }, [positions]);

  useEffect(() => {
    if (!loading && !loadingPositions && strategyId) {
      fetchExitOptions();
    }
    // eslint-disable-next-line
  }, [strategyId]);

  const options: IOption[] =
    !loading && vaults ? vaults.map((vault, i) => ({ label: vault, value: i.toString() })) : [];

  const onEnterVaultBatchAction = async (data: any) => {
    try {
      setPendingTransaction(true);
      if (
        swNFTContract &&
        data &&
        data.amount &&
        data.amount !== '' &&
        data.strategy &&
        data.positions &&
        data.positions.length > 0
      ) {
        const amount = ethers.utils.parseEther(data.amount.toString());
        const tx = await swNFTContract.batchAction(
          data.positions.map((positionId: string) => ({
            tokenId: positionId,
            action: BatchAction.ENTER,
            amount,
            strategy: BigNumber.from(data.strategy),
          }))
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          reset();
          setValue('amount', '');
          dispatch(setIsVaultTransactionModalOpen(false));
          enqueueSnackbar('Transaction successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Transaction unsuccessful', { variant: 'error' });
        }
      }
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    } finally {
      setPendingTransaction(false);
    }
  };
  const onExitVaultBatchAction = async (data: any) => {
    try {
      setPendingTransaction(true);
      if (
        swNFTContract &&
        data &&
        data.amount &&
        data.amount !== '' &&
        data.strategy &&
        data.positions &&
        data.positions.length > 0
      ) {
        const amount = ethers.utils.parseEther(data.amount.toString());
        const tx = await swNFTContract.batchAction(
          data.positions.map((positionId: string) => ({
            tokenId: positionId,
            action: BatchAction.EXIT,
            amount,
            strategy: BigNumber.from(data.strategy),
          }))
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          reset();
          setValue('amount', '');
          enqueueSnackbar('Transaction successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Transaction unsuccessful', { variant: 'error' });
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
      onEnterVaultBatchAction(data);
    } else {
      onExitVaultBatchAction(data);
    }
  };

  return (
    <Card
      sx={{
        padding: '22px',
        width: '100%',
      }}
    >
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputController label="Choose vault" name="strategy" options={options} placeholder="Choose vault" select />
          <MultiSelect
            label={type === VaultTransactionType.ENTER ? 'Choose position to enter' : 'Choose position to exit'}
            name="positions"
            options={type === VaultTransactionType.ENTER ? enterPositions : positionOptions}
            placeholder={type === VaultTransactionType.ENTER ? 'Choose position to enter' : 'Choose position to exit'}
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

export default VaultTransactionModal;
