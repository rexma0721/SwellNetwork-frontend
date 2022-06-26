/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowBack } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useWeb3React } from 'web3-react-core';

import PriceInput from '../components/common/PriceInput';
import { useAppDispatch } from '../state/hooks';
import { setIsConfirmStakeModalOpen, setIsWalletModalOpen } from '../state/modal/modalSlice';
import { setStakeAmount, StakingPage } from '../state/stake/stakeSlice';
import { depositStakeFormSchema as schema } from '../validations/depositStakeFormSchema';

const Layout = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
}));

interface IDepositStakeForm {
  amount: number;
}

const DepositEth: React.FC = () => {
  const { account } = useWeb3React();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const matches = useMediaQuery(`@media only screen and (max-width:${theme.breakpoints.values.sm}px)`);
  const navigate = useNavigate();
  const method = useForm<IDepositStakeForm>({
    mode: 'onSubmit',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { amount: 16 },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = method;
  const onSubmit = (data: IDepositStakeForm) => {
    try {
      if (data.amount) {
        dispatch(setStakeAmount({ amount: data.amount, page: StakingPage.DEPOSIT_ETHEREUM }));
        dispatch(setIsConfirmStakeModalOpen(true));
      } else {
        setError('amount', { message: 'Amount must be at least 16 ETH', type: 'manual' });
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };
  return (
    <>
      {matches && (
        <Layout>
          <Typography component="span" onClick={() => navigate('/register-with-ethdo')} role="button">
            <ArrowBack />
            Back to register with Ethdo
          </Typography>
          <Typography component="h2" sx={{ marginBottom: '27px' }} variant="h2">
            Deposit Ethereum
          </Typography>
        </Layout>
      )}
      <Card
        sx={{
          maxWidth: '600px',
          margin: 'auto',
          padding: '20px',
          backgroundColor: theme.palette.common.white,
        }}
      >
        <Box sx={{ maxWidth: '440px', margin: 'auto', textAlign: 'center' }}>
          {!matches && (
            <Typography component="span" onClick={() => navigate('/register-with-ethdo')} role="button">
              <ArrowBack />
              Back to register with Ethdo
            </Typography>
          )}
          <FormProvider {...method}>
            {!matches && (
              <Typography component="h2" sx={{ marginBottom: '27px' }} variant="h2">
                Deposit Ethereum
              </Typography>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <PriceInput
                adornmentType="text"
                disabled
                inputProps={{ min: 16 }}
                name="amount"
                required
                text="*Minimum 16 ETH Requirement"
                value={16}
              />
              {account ? (
                // eslint-disable-next-line react/jsx-max-props-per-line
                <LoadingButton
                  disabled={isSubmitting}
                  fullWidth
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Stake
                </LoadingButton>
              ) : (
                <Button fullWidth onClick={() => dispatch(setIsWalletModalOpen(true))} size="large">
                  Connect wallet
                </Button>
              )}
            </form>
          </FormProvider>
        </Box>
      </Card>
    </>
  );
};
export default DepositEth;
