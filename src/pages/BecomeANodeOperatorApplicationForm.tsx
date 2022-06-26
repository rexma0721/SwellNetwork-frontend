/* eslint-disable react/jsx-max-props-per-line */
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useLazyQuery, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, styled, Typography } from '@mui/material';
import { useWeb3React } from 'web3-react-core';

import InputController from '../components/common/InputController';
import { GET_NODE_OPERATOR_BY_USER, SIGN_UP_USER } from '../graphql';
import { useAppDispatch } from '../state/hooks';
import { setIsWalletModalOpen } from '../state/modal/modalSlice';
import { INodeOperator } from '../state/nodeOperator/NodeOperator.interface';
import { BecomeANodeOperatorSchema } from '../validations/become-a-node-operator.schema';

const FormContainer = styled('form')(() => ({
  maxWidth: 440,
  width: '100%',
  margin: 'auto',
}));

const FormGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr) )',
  gridGap: '0 10px',
  alignItems: 'start',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr) )',
  },
  [theme.breakpoints.down('sm')]: {
    gridGap: 'unset',
  },
}));
const FormHeading = styled('p')({
  marginBottom: '20px',
});

const options = [
  { label: 'Individual', value: 'INDIVIDUAL' },
  { label: 'Institutional', value: 'INSTITUTIONAL' },
];

const BecomeANodeOperatorApplicationForm: FC = () => {
  const { account } = useWeb3React();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<any>();

  const [fetchUserData, { loading, error: userDataFetchingError, data: fetchedUserData }] = useLazyQuery(
    GET_NODE_OPERATOR_BY_USER,
    {
      variables: {
        wallet: account,
      },
    }
  );

  const method = useForm<INodeOperator>({
    mode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: true,
    resolver: yupResolver(BecomeANodeOperatorSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = method;

  // fetch form data
  useEffect(() => {
    if (account) {
      fetchUserData();
      if (!loading && !userDataFetchingError && fetchedUserData) {
        setFormData(fetchedUserData.nodeOperatorByUser);
      }
    }
  }, [account, fetchUserData, fetchedUserData, loading, userDataFetchingError]);

  // reset
  useEffect(() => {
    if (formData) {
      reset({
        serverDetails: {
          location: formData.location,
          noOfNodes: formData.nodes,
          cpu: formData.cpu,
          ram: formData.ram,
          networkBandwidth: formData.network,
          storage: formData.storage,
        },
        operatorDetails: {
          type: formData.category,
          name: formData.name,
          yearsOfExperience: formData.yearsOfExperience,
          email: formData.email ?? '',
          website: formData.website ?? '',
          socialMediaUrl: formData.social ?? '',
          description: formData.description,
        },
      });
    }
  }, [formData, reset]);

  const [createUser, newUser] = useMutation(SIGN_UP_USER);

  const onSubmit = (data: INodeOperator) => {
    try {
      if (account) {
        createUser({
          variables: {
            userCreateInput: {
              wallet: account,
              nodeOperator: {
                location: data.serverDetails.location,
                nodes: data.serverDetails.noOfNodes,
                cpu: data.serverDetails.cpu,
                ram: data.serverDetails.ram,
                network: data.serverDetails.networkBandwidth,
                storage: data.serverDetails.storage,
                category: data.operatorDetails.type,
                name: data.operatorDetails.name,
                yearsOfExperience: data.operatorDetails.yearsOfExperience,
                email: data.operatorDetails.email ?? null,
                website: data.operatorDetails.website ?? null,
                social: data.operatorDetails.socialMediaUrl ?? null,
                description: data.operatorDetails.description,
              },
            },
          },
        });
        if (!newUser.loading && !newUser.error) {
          navigate('/register-with-ethdo');
        }
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };
  return (
    <>
      <Typography component="h2" sx={{ mb: '40px', textAlign: 'center' }} variant="h2">
        Become a Node Operator
      </Typography>
      <FormProvider {...method}>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <Box component="h3" sx={{ fontSize: '22px', marginBottom: '32px', textAlign: ['center', 'left'] }}>
            Application form
          </Box>
          <FormHeading>Tell us about your server</FormHeading>
          <InputController label="Location" name="serverDetails.location" placeholder="Location" required />
          <InputController
            label="Number of nodes"
            name="serverDetails.noOfNodes"
            numberFormat
            placeholder="Number of nodes"
            required
          />
          <FormGrid>
            <InputController
              label="CPU"
              name="serverDetails.cpu"
              numberFormat
              placeholder="CPU"
              required
              type="number"
            />
            <InputController
              label="RAM"
              name="serverDetails.ram"
              numberFormat
              placeholder="RAM"
              required
              type="number"
            />
          </FormGrid>
          <FormGrid sx={{ marginBottom: '20px' }}>
            <InputController
              label="Network bandwidth"
              name="serverDetails.networkBandwidth"
              numberFormat
              placeholder="Network bandwidth"
              required
              type="number"
            />
            <InputController
              label="Storage"
              name="serverDetails.storage"
              numberFormat
              placeholder="Storage"
              required
              type="number"
            />
          </FormGrid>
          <FormHeading>Your details</FormHeading>
          <InputController
            label="Individual or institutional"
            name="operatorDetails.type"
            numberFormat
            options={options}
            placeholder="Individual or institutional"
            required
            select
          />
          <InputController label="Your name" name="operatorDetails.name" placeholder="Your name" required />
          <InputController
            label="Years of experience"
            name="operatorDetails.yearsOfExperience"
            numberFormat
            placeholder="Years of experience"
            required
          />
          <InputController label="Your email" name="operatorDetails.email" placeholder="Your email" type="email" />
          <InputController label="Your website" name="operatorDetails.website" placeholder="Your website" />
          <InputController
            label="Your social media url"
            name="operatorDetails.socialMediaUrl"
            placeholder="Your social media url"
          />
          <InputController
            InputProps={{ multiline: true, rows: 2 }}
            label="Description"
            name="operatorDetails.description"
            placeholder="Description"
            required
          />
          {account ? (
            <LoadingButton disabled={isSubmitting} fullWidth loading={isSubmitting} type="submit" variant="contained">
              Next Step
            </LoadingButton>
          ) : (
            <Button fullWidth onClick={() => dispatch(setIsWalletModalOpen(true))} size="large">
              Connect wallet
            </Button>
          )}
        </FormContainer>
      </FormProvider>
    </>
  );
};

export default BecomeANodeOperatorApplicationForm;
