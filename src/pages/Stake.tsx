import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, styled, Typography } from '@mui/material';
import { useWeb3React } from 'web3-react-core';

import PriceInput from '../components/common/PriceInput';
import Web3Status from '../components/common/Web3Status';
import { StakeButtons } from '../components/stake/StakeButtons';
import TransactionDetails from '../components/stake/TransactionDetails';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setIsConfirmStakeModalOpen, setIsNodeOperatorModalOpen } from '../state/modal/modalSlice';
import { setStakeAmount, StakingPage } from '../state/stake/stakeSlice';
import { useNativeCurrencyBalances } from '../state/wallet/hooks';
import { EthereumIcon, ListColumn } from '../theme/uiComponents';
import { stakeFormSchema as schema } from '../validations/stakeFormSchema';

const Row = styled(ListColumn)({
  paddingInline: '11px',
});

interface IStakeForm {
  amount: number;
}

const Stake: FC = () => {
  const { account } = useWeb3React();
  const method = useForm<IStakeForm>({
    mode: 'onSubmit',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      amount: undefined,
    },
  });
  const dispatch = useAppDispatch();
  const { selectedNodeOperator } = useAppSelector((state) => state.nodeOperator);
  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? ''];
  const { handleSubmit, setError } = method;
  const onSubmit = (data: IStakeForm) => {
    try {
      if (data.amount) {
        dispatch(setStakeAmount({ amount: data.amount, page: StakingPage.STAKE }));
        dispatch(setIsConfirmStakeModalOpen(true));
      } else {
        setError('amount', { message: 'Amount must be at least 1 ETH', type: 'manual' });
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2">Stake ETH</Typography>
        <Card sx={{ padding: ['20px 10px', '22px'], maxWidth: '400px', margin: '20px auto', width: '100%' }}>
          <Web3Status sx={{ marginBottom: '26px', marginInline: 'auto' }} />
          <Row>
            Available to stake
            <span>
              <EthereumIcon sx={{ height: 12, width: 12, marginRight: '5px' }} />
              <span>{userEthBalance?.toFixed(3) ?? '0.000'}</span>
            </span>
          </Row>
          <Row sx={{ marginBottom: '24px' }}>
            Annual percentage rate
            <span>4%</span>
          </Row>
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <PriceInput
                adornmentType="node"
                name="amount"
                tooltip="Must be at least 1 ETH and must be an integer(whole number)"
              />
              <StakeButtons ethBalance={userEthBalance} watchField="amount" />
            </form>
            <TransactionDetails watchField="amount" />
          </FormProvider>

          <Row sx={{ alignItems: 'flex-start' }}>
            Node Operator
            <Box
              component="span"
              sx={{
                flexFlow: 'column !important',
                alignItems: 'flex-end !important',
                gap: '0 !important',
              }}
            >
              {selectedNodeOperator?.name}
              <Button
                onClick={() => dispatch(setIsNodeOperatorModalOpen(true))}
                size="small"
                sx={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  display: 'block',
                  textDecoration: 'underline',
                  padding: 0,
                  minWidth: 0,
                }}
                variant="text"
              >
                Change
              </Button>
            </Box>
          </Row>
        </Card>
      </Box>
    </>
  );
};

export default Stake;
