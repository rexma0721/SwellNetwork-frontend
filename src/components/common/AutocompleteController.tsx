import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete, TextField } from '@mui/material';

interface Props {
  label?: string;
  placeholder?: string;
  name: string;
  freeSolo?: boolean;
  options: { label: string; publicKey: string; signature: string; depositDataRoot: string }[] | string[];
}

const AutocompleteController: React.FC<Props> = ({ label, freeSolo, placeholder, name, options }) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
          <Autocomplete
            freeSolo={freeSolo}
            onChange={(event, item) => {
              onChange(item);
            }}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                error={invalid}
                helperText={error?.message}
                label={label}
                margin="normal"
                placeholder={placeholder}
                variant="outlined"
              />
            )}
            value={value}
          />
        )}
        rules={{ required: true }}
      />
    </>
  );
};

export default AutocompleteController;
