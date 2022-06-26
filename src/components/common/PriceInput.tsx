import { Controller, ControllerProps, useFormContext } from 'react-hook-form';

import { InfoOutlined } from '@mui/icons-material';
import { InputAdornment, InputLabel, styled, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import { BigNumber } from 'ethers';

import { EthereumIcon, SwellIcon } from '../../theme/uiComponents';
import { FormatNumber } from './FormatNumber';
import InputButtons from './InputButtons';

interface FieldProps {
  adornmentType: 'text' | 'node';
  tooltip?: React.ReactNode;
  text?: string;
  icon?: 'swell' | 'eth';
  name: string;
  rules?: ControllerProps['rules'];
  shouldUnregister?: ControllerProps['shouldUnregister'];
  disabled?: boolean;
  maxAmount?: BigNumber;
}

const MTextField = styled(MuiTextField)(({ theme }) => ({
  root: {
    marginBottom: '16px !important',
    width: 'auto',
  },
  '& svg + .MuiInputBase-input': {
    marginLeft: 5,
  },
  '& .MuiInputBase-input': {
    width: 'auto',
    maxWidth: 60,
  },
  '& .MuiInputAdornment-positionStart': {
    marginTop: '0 !important',
    marginRight: 5,
  },
  '& .MuiInputAdornment-positionEnd': {
    color: theme.palette.common.black,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    '&.flex-end': {
      justifyContent: 'flex-end',
    },
  },
}));

const PriceInput: React.FC<TextFieldProps & FieldProps> = ({
  adornmentType,
  name,
  text,
  tooltip,
  defaultValue,
  disabled,
  icon = 'eth',
  rules,
  required,
  shouldUnregister,
  maxAmount,
  ...props
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(`(max-width: ${theme.breakpoints.values.sm}px)`);
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field: { ref, ...fields }, fieldState: { invalid, error } }) => (
        <>
          {matches && adornmentType === 'text' && text && (
            <InputLabel sx={{ textAlign: 'left', color: theme.palette.common.black, marginBottom: '8px' }}>
              {text}
            </InputLabel>
          )}
          <MTextField
            {...props}
            {...fields}
            disabled={disabled}
            error={invalid}
            fullWidth
            helperText={error?.message}
            InputProps={{
              ref,
              inputComponent: FormatNumber as any,
              endAdornment: (
                <InputAdornment className={text ? 'flex-end' : ''} position="end">
                  {adornmentType === 'node' && tooltip && (
                    <>
                      <Tooltip title={<>{tooltip}</>}>
                        <InfoOutlined sx={{ fontSize: '12px' }} />
                      </Tooltip>
                      <InputButtons currency={icon} inputName={name} maxAmount={maxAmount} />
                    </>
                  )}
                  {!matches && adornmentType === 'text' && text && <>{text}</>}
                </InputAdornment>
              ),
              startAdornment: (
                <>
                  {icon && icon === 'swell' ? (
                    <SwellIcon sx={{ minWidth: '12px', width: '12px' }} />
                  ) : (
                    <EthereumIcon sx={{ minWidth: '12px', width: '12px' }} />
                  )}
                </>
              ),
            }}
            label=""
            placeholder="Amount"
          />
        </>
      )}
      rules={{ required, ...rules }}
      shouldUnregister={shouldUnregister}
    />
  );
};

export default PriceInput;
