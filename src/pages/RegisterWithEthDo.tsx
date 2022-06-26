import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Typography, useTheme } from '@mui/material';

import RegisterEthDoForm from '../components/registerEthDo/RegisterEthDoForm';
import RegisterStepOne from '../components/registerEthDo/RegisterStepOne';
import { useAppSelector } from '../state/hooks';

const RegisterWithEthDo: FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [disabled, setDisabled] = useState(true);
  const { formValues } = useAppSelector((state) => state.registerEthDo);

  useEffect(() => {
    const filteredValues = formValues.filter((value) => value.isSubmitted === false);
    setDisabled(filteredValues.length > 0);
  }, [formValues]);
  return (
    <Box sx={{ maxWidth: '600px', width: '100%', margin: 'auto' }}>
      <Box
        sx={{
          mb: '20px',
        }}
      >
        <Typography
          component="span"
          onClick={() => navigate('/become-a-node-operator')}
          role="button"
          sx={{
            ml: '10px',
            display: 'block',
            [theme.breakpoints.down('sm')]: {
              textAlign: 'center',
            },
          }}
        >
          <ArrowBackIcon />
          Back to become a node operator
        </Typography>
        <Typography
          component="h2"
          sx={{
            ml: '10px',
            mb: '40px',
            textAlign: 'left',
            [theme.breakpoints.down('sm')]: {
              textAlign: 'center',
              width: '100%',
              fontSize: '28px',
            },
          }}
          variant="h2"
        >
          Register With Ethdo
        </Typography>
        <RegisterStepOne />
        <RegisterEthDoForm />
      </Box>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        {/* eslint-disable-next-line react/jsx-max-props-per-line */}
        <Button
          disabled={disabled}
          fullWidth
          onClick={() => navigate('/deposit-ethereum')}
          sx={{ width: '440px' }}
          variant="contained"
        >
          Next Step
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterWithEthDo;
