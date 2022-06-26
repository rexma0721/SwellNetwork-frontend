import { ProviderContext } from 'notistack';

const getErrorMessage = (str: string) => {
  const text = str.split(':');
  text.shift();
  const fullText = text.join(', ');
  return fullText.length > 0
    ? fullText.charAt(0).toUpperCase() + fullText.slice(1)
    : 'Something went wrong. Try again later';
};

// eslint-disable-next-line import/prefer-default-export, @typescript-eslint/explicit-module-boundary-types
export const displayErrorMessage = (enqueSnackbar: ProviderContext['enqueueSnackbar'], error: any): void => {
  const err = error as {
    code: number | string;
    message: string;
    stack: string;
    data: { code: number | string; message: string; data: string };
  };
  let errMessage;
  const errCode = err.code.toString();
  switch (errCode) {
    case '4001':
      errMessage = 'Transaction rejected by user';
      break;
    case 'UNPREDICTABLE_GAS_LIMIT':
      errMessage = 'Unable to determine gas limit';
      break;
    case 'INSUFFICIENT_FUNDS':
      errMessage = 'Insufficient balance';
      break;
    case '-32603':
      errMessage = getErrorMessage(err.data.message);
      break;
    case 'INVALID_ARGUMENT':
    default:
      errMessage = 'Something went wrong. Please try again later.';
      break;
  }
  enqueSnackbar(errMessage, { variant: 'error' });
};
