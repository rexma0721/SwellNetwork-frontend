import * as yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const RegisterWithEthdoSchema = yup.object().shape({
  publicKey: yup.string().required().label('Public key'),
  totalEth: yup.string().required().label('Total ETH'),
  signature: yup.string().required().label('Signature'),
  depositDataRoot: yup.string().required().label('Deposit data root'),
});
