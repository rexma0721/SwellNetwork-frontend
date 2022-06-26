/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Typography, useTheme } from '@mui/material';

import { setCurrentStep } from '../../state/formStepper/formStepperSlice';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { IRegisterWithEthdoFields, setFormValues } from '../../state/registerNodeOperator/registerNodeOperatorSlice';
import { RegisterWithEthdoSchema } from '../../validations/register-with-ethdo.schema';
import AutocompleteController from '../common/AutocompleteController';
import InputController from '../common/InputController';
import FormStepper from '../stepper/FormStepper';

const validatorPublicKeys = [
  {
    label: '0xb57e2062d1512a648314622284539755c7008faaf283d5e621e587e13d10f87e0877e8325c2b1fe754f16b1ec',
    publicKey: '0xb57e2062d1512a64831462228453975326b65c7008faas283d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    signature:
      '0xb224d558d829c245fe56bff9d28c7fd0d348b8faef8ce220c3657e373f8dc0a0c8512be589ecaa749fe39fc0371380a97aab966606ba7fa89c78dc1703858dfc5d3288880a813e773f1ff379192e1f6b01a6a4a3affee1d50e5b3c849',
    depositDataRoot: '0x81a814655bfc695f5f207d433b4d2e272d764857fee6efd58ba4677c076e60a9',
  },
  {
    label: '0xb57e2062d1512a64831462228457008faaf283d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    publicKey: '0xb57e2062d1512a64831462228453975326b65c7008faaf285d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    signature:
      '0xb224d558d829c245fe56bff9d6795eb8faef8ce220c3657e373f8dc0a0c8512be589ecaa749fe39fc0371380a97aab966606ba7fa89c78dc1703858dfc5d3288880a87743f1ff379192e1f6b01a6a4a3affee1d50e5b3c849',
    depositDataRoot: '0x81a814655bfc695f5f207d433b4d2e272d764857fee6efd58ba4677c076e60a9',
  },
  {
    label: '0xb57e2062d151462228453975326b65c7008faaf283d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    publicKey: '0xb57e2062d1512a64831462228453975326b65c7008faaf28365e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    signature:
      '0xb224d558d829c245fe5628c7fd0d348d6795eb8faef8ce220c3657e373f8dc0a0c8512be589ecaa749fe39fc0371380a97aab966606ba7fa89c78dc1703858dfc5d3288880a813743f1ff379192e1f6b01a6a4a3affee1d50e5b3c849',
    depositDataRoot: '0x81a814655bfc695f5f207d433b4d2e272d764857fee6efd58ba4677c076e60a9',
  },
  {
    label: '0xb57e2062d1512a462228453975326b65c7008faaf283d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    publicKey: '0xb57e2062d1512831462228453975326b65c7008faaf287d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    signature:
      '0xb224d558d829c245fe56b28c7fd0d348d6795eb8faef8ce220c3657e373f8dc0a0c8512be589ecaa749fe39fc0371380a97aab966606ba7fa89c78dc1703858dfc5d3288880a813e7743f1ff379192e1f6b01a6a4a3affee1d50e5b3c849',
    depositDataRoot: '0x81a8146c695f5f207d433b4d2e272d764857fee6efd58ba4677c076e60a9',
  },
  {
    label: '0xb57e2062d1512a653975326b65c7008faaf283d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    publicKey: '0xb57e2062d1512a64831462228453975326b65c7008faaf293d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    signature:
      '0xb224d558d829c245fe56bf28c7fd0d348d6795eb8faef8ce220c3657e373f8dc0a0c8512be589ecaa749fe39fc0371380a97aab966606ba7fa89c78dc1703858dfc5d3288880a87743f1ff379192e1f6b01a6a4a3affee1d50e5b3c849',
    depositDataRoot: '0x81a814655bfc695f5f207d433b4d2e272d764857fee6efd58ba4677c076e60a9',
  },
  {
    label: '0xb57e2062d1512a662228453975326b65cfaaf283d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    publicKey: '0xb57e2062d1512a64831462228453975326b65c7008faaf283d5e621e58725e13d10f87e0877e8325c2b1fe754f16b1ec',
    signature:
      '0xb224d558d829c245fe56bff9d28c7fd0d348d6795eb8faef8ce220c3657e373f8dc0a0c8512be589ecaa749fe39fc0371380a97aab966606ba7fa89c78dc1703858dfc5d3288880a81343f1ff379192e1f6b01a6a4a3affee1d50e5b3c849',
    depositDataRoot: '0x81a814655bfc695f5f207d433b4d2e272d764857fee6efd58ba4677c076e60a9',
  },
];

const RegisterEthDoForm: React.FC = () => {
  const theme = useTheme();
  const method = useForm<IRegisterWithEthdoFields>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      publicKey: '',
    },
    resolver: yupResolver(RegisterWithEthdoSchema),
  });
  const [formsSubmitted, setFormsSubmitted] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = method;
  const [key, setPublicKey] = useState<string>('');
  const dispatch = useAppDispatch();
  const { currentStep, maxStep } = useAppSelector((state) => state.formStepper);
  const { formValues } = useAppSelector((state) => state.registerEthDo);
  const submitSubForms = (data: IRegisterWithEthdoFields) => {
    try {
      const dataToSubmit = {
        index: currentStep,
        formValues: { ...data, isSubmitted: true } as IRegisterWithEthdoFields,
      };
      setPublicKey(data.publicKey);
      dispatch(setFormValues(dataToSubmit));
      if (currentStep === maxStep) {
        setFormsSubmitted(true);
      }
      if (currentStep < maxStep) {
        dispatch(setCurrentStep(currentStep + 1));
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };
  useEffect(() => {
    if (currentStep < maxStep) {
      setFormsSubmitted(false);
    }
    if (currentStep >= 0 && currentStep <= maxStep) {
      reset(formValues[currentStep]);
      setValue('totalEth', `${currentStep + 1} Eth`);
      if (!formValues[currentStep].publicKey) {
        setValue('publicKey', key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formValues, setValue, reset, maxStep]);
  return (
    <Card
      sx={{
        border: `2px solid ${theme.palette.common.white}`,
        borderRadius: '8px',
        padding: '34px 30px',
        [theme.breakpoints.down('sm')]: {
          padding: 0,
          border: 0,
        },
      }}
    >
      <Typography component="p" sx={{ mb: '10px' }}>
        Step 2
      </Typography>
      <Typography
        component="h4"
        sx={{
          mb: '20px',
          fontSize: '22px',
          fontWeight: '600',
        }}
        variant="h4"
      >
        Upload Data from Ethdo
      </Typography>
      <FormProvider {...method}>
        <form noValidate onSubmit={handleSubmit(submitSubForms)}>
          <AutocompleteController
            freeSolo
            label="Choose or enter your public key"
            name="publicKey"
            options={validatorPublicKeys.map((_key) => _key.publicKey)}
            placeholder="Choose or enter your public key"
          />
          <Card
            sx={{
              padding: '22px 21px 26px 21px',
              marginBottom: '20px',
              background: theme.palette.common.white,
            }}
          >
            <Typography
              component="p"
              sx={{
                fontSize: '18px',
                textAlign: 'center',
                mb: '14px',
              }}
            >
              Submit your deposit data
            </Typography>
            {/* eslint-disable-next-line react/jsx-max-props-per-line */}
            <InputController disabled label="Total Eth" name="totalEth" placeholder="Total Eth" required />
            <InputController label="Signature" name="signature" placeholder="Signature" required />
            <InputController
              label="Deposit data root"
              name="depositDataRoot"
              placeholder="Deposit data root"
              required
            />
            <LoadingButton
              disabled={isSubmitting || formsSubmitted}
              fullWidth
              loading={isSubmitting}
              sx={{
                border: `1px solid ${theme.palette.grey[100]}`,
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
              }}
              type="submit"
              variant="outlined"
            >
              Submit
            </LoadingButton>
          </Card>
        </form>
        <FormStepper />
      </FormProvider>
    </Card>
  );
};

export default RegisterEthDoForm;
