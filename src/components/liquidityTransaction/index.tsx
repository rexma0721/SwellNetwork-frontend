import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, BoxProps, Button, Card, styled } from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useWeb3React } from 'web3-react-core';

import { SWNFT_ADDRESS } from '../../constants/addresses';
import { SWETH } from '../../constants/tokens';
import { useSWETHContract } from '../../hooks/useContract';
import { useV3PositionsFromTokenIds } from '../../hooks/useV3Positions';
import { useTokenBalance } from '../../lib/hooks/useCurrencyBalance';
import { useAppDispatch } from '../../state/hooks';
import { setIsWalletModalOpen } from '../../state/modal/modalSlice';
import { ListColumn, SwellIcon } from '../../theme/uiComponents';
import { displayErrorMessage } from '../../utils/errors';
import PriceInput from '../common/PriceInput';
import Web3Status from '../common/Web3Status';

const Row = styled(ListColumn)({
  fontSize: 13,
  fontWeight: '500',
  span: {
    fontWeight: '300',
  },
  padding: '5px 0',
});

export enum LiquidityTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

interface LiquidityTransactionProps extends BoxProps {
  type: LiquidityTransactionType;
}

const LiquidityTransaction: FC<LiquidityTransactionProps> = ({ type, sx, ...props }) => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const { id: selectedPositionId } = useParams();
  const { account, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const swETHContract = useSWETHContract();
  const swETHBalance = useTokenBalance(account ?? undefined, chainId ? SWETH[chainId] : undefined);

  const [isApproved, setApproved] = useState<boolean>(type !== LiquidityTransactionType.DEPOSIT);
  const [isApprovalInProgress, setApprovalInProgress] = useState<boolean>(false);
  let selectedPositions: string[] = useMemo(() => [], []);
  if (selectedPositionId) {
    selectedPositions = [selectedPositionId];
  } else {
    const watchPositions = watch('positions');
    if (watchPositions && watchPositions.length > 0) {
      selectedPositions = watchPositions;
    } else {
      selectedPositions = [];
    }
  }

  const watchAmount = watch('amount');
  const [available, setAvailable] = useState<string>('0.00');

  // fetch data of all the selected positions
  const { loading, positions: selectedPositionsData } = useV3PositionsFromTokenIds(
    selectedPositions.map((selectedPosition) => BigNumber.from(selectedPosition))
  );
  const [isBalanceInsufficient, setBalanceInsufficient] = useState(false);
  const [isAmountGreaterThanAvailableBalance, setIsAmountGreaterThanAvailableBalance] = useState(false);

  // check if insufficient balance
  const checkIfBalanceInsufficient = useCallback(() => {
    if (type === LiquidityTransactionType.DEPOSIT) {
      if (
        account &&
        swETHBalance &&
        watchAmount &&
        watchAmount !== '' &&
        selectedPositions &&
        selectedPositions.length > 0
      ) {
        const parsedSwEthBalance = ethers.utils.parseEther(swETHBalance?.toSignificant());
        const parsedAmount = ethers.utils.parseEther(watchAmount.toString());
        if (parsedSwEthBalance.lt(parsedAmount.mul(selectedPositions.length))) {
          setBalanceInsufficient(true);
          enqueueSnackbar('Insufficient Balance', { variant: 'error' });
        } else {
          setBalanceInsufficient(false);
        }
      }
      if (watchAmount === '') {
        setBalanceInsufficient(false);
      }
    }
  }, [account, enqueueSnackbar, selectedPositions, swETHBalance, type, watchAmount]);

  useEffect(() => {
    checkIfBalanceInsufficient();
  });

  // calculate available value
  useEffect(() => {
    if (
      !loading &&
      selectedPositions &&
      selectedPositions.length > 0 &&
      selectedPositionsData &&
      selectedPositionsData.length > 0 &&
      selectedPositions.length === selectedPositionsData.length &&
      swETHBalance
    ) {
      if (type === LiquidityTransactionType.DEPOSIT) {
        const availableBalance = ethers.utils.parseEther(swETHBalance?.toFixed(0).split('.')[0]);
        setAvailable(ethers.utils.formatEther(availableBalance).split('.')[0]);
      } else if (type === LiquidityTransactionType.WITHDRAW) {
        let availableBalance = BigNumber.from('0');
        selectedPositionsData.forEach((position, index) => {
          const positionBaseTokenBalance = BigNumber.from(
            ethers.utils.formatEther(position.baseTokenBalance.toString()).split('.')[0]
          );
          if (!index) {
            availableBalance = positionBaseTokenBalance;
          } else if (availableBalance.gte(positionBaseTokenBalance)) {
            availableBalance = positionBaseTokenBalance;
          }
        });
        setAvailable(availableBalance.toString());
      }
    } else {
      setAvailable('0.00');
    }
  }, [loading, selectedPositions, selectedPositionsData, swETHBalance, type]);

  // check if amount greater than available value
  useEffect(() => {
    if (type === LiquidityTransactionType.WITHDRAW && account && !isSubmitting && watchAmount && watchAmount !== '') {
      const amount = BigNumber.from(watchAmount);
      const availableBalance = BigNumber.from(available.split('.')[0]);
      if (amount.gt(availableBalance)) {
        setIsAmountGreaterThanAvailableBalance(true);
        enqueueSnackbar('Entered amount is greater than available to withdraw', { variant: 'error' });
      } else {
        setIsAmountGreaterThanAvailableBalance(false);
      }
    }
  }, [account, available, enqueueSnackbar, isSubmitting, type, watchAmount]);

  const fetchApprovalStatus = useCallback(async () => {
    if (
      account &&
      chainId &&
      watchAmount &&
      watchAmount !== '' &&
      selectedPositions &&
      selectedPositions.length > 0 &&
      swETHContract
    ) {
      const depositAmount = ethers.utils.parseEther(watchAmount.toString());
      const requiredAllowance = depositAmount.mul(selectedPositions.length);
      const allowance = await swETHContract.allowance(account, SWNFT_ADDRESS[chainId]);
      const approvalStatus = allowance.gte(requiredAllowance);
      setApproved(approvalStatus);
    }
  }, [account, chainId, selectedPositions, swETHContract, watchAmount]);

  useEffect(() => {
    if (type === LiquidityTransactionType.DEPOSIT && chainId && watchAmount !== '') {
      fetchApprovalStatus();
    }
  }, [chainId, fetchApprovalStatus, type, watchAmount]);

  const approveHandler = async () => {
    setApprovalInProgress(true);
    try {
      if (swETHContract && chainId && watchAmount && watchAmount !== '') {
        const requiredAllowance = ethers.utils.parseEther(watchAmount.toString()).mul(selectedPositions.length);
        const tx = await swETHContract.approve(SWNFT_ADDRESS[chainId], requiredAllowance);
        const receipt = await tx.wait();
        setApproved(!!receipt.status);
        if (receipt.status) {
          enqueueSnackbar('Approval successful', { variant: 'success' });
        } else {
          enqueueSnackbar('Approval unsuccessful', { variant: 'error' });
        }
      }
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    } finally {
      setApprovalInProgress(false);
    }
  };

  return (
    <Box {...props} sx={{ textAlign: 'center', ...sx }}>
      <Card
        sx={{
          padding: '22px',
          maxWidth: '400px',
          margin: '20px auto',
          width: '100%',
        }}
      >
        <Web3Status sx={{ marginBottom: '26px', marginInline: 'auto' }} variant="outlined" />
        <Row>
          Available to {type === LiquidityTransactionType.DEPOSIT ? 'add' : 'withdraw'}
          <span>
            <SwellIcon size="xs" />
            {available ?? '0.00'}
          </span>
        </Row>
        {type === LiquidityTransactionType.DEPOSIT && (
          <Row>
            Annual percentage rate
            <span>4%</span>
          </Row>
        )}
        <PriceInput
          adornmentType="node"
          icon="swell"
          maxAmount={BigNumber.from(available.split('.')[0])}
          name="amount"
          required
          sx={{ marginTop: '24px' }}
          tooltip="Must be at least 1 swETH and must be an integer(whole number)"
        />
        {/* eslint-disable-next-line no-nested-ternary */}
        {account ? (
          isApproved ? (
            <LoadingButton
              disabled={isSubmitting || isBalanceInsufficient || isAmountGreaterThanAvailableBalance}
              fullWidth
              loading={isSubmitting}
              sx={{ marginBottom: '10px', textTransform: 'none' }}
              type="submit"
              variant="contained"
            >
              {type === LiquidityTransactionType.DEPOSIT ? 'Add Liquidity' : 'Remove Liquidity'}
            </LoadingButton>
          ) : (
            <LoadingButton
              disabled={isBalanceInsufficient || isApprovalInProgress}
              fullWidth
              loading={isApprovalInProgress}
              onClick={approveHandler}
              size="large"
              variant="contained"
            >
              Approve
            </LoadingButton>
          )
        ) : (
          <Button fullWidth onClick={() => dispatch(setIsWalletModalOpen(true))} size="large">
            Connect wallet
          </Button>
        )}
      </Card>
    </Box>
  );
};

export default LiquidityTransaction;
