import React from 'react';

import { Card, Divider, Typography, useTheme } from '@mui/material';

const RegisterStepOne: React.FC = () => {
  const theme = useTheme();
  return (
    <>
      <Card
        sx={{
          maxWidth: '600px',
          borderRadius: '8px',
          backgroundColor: theme.palette.common.white,
          padding: '34px 80px',
          mb: '27px',
          [theme.breakpoints.down('sm')]: {
            padding: '20px',
          },
          '& pre': {
            marginBottom: '20px',
          },
        }}
      >
        <Typography component="p" sx={{ mb: '10px' }}>
          Step 1
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
          Follow instructions to use Ethdo with Launchpad
        </Typography>

        <p>
          First step: Generate Keys following instructions on the launchpad.
          <a href="https://launchpad.ethereum.org/en/generate-keys" rel="noreferrer" target="_blank">
            https://launchpad.ethereum.org/en/generate-keys
          </a>
        </p>
        <p>
          Second step: install EthDo.
          <a href="https://github.com/wealdtech/ethdo#install" rel="noreferrer" target="_blank">
            wealdtech/ethdo
          </a>
        </p>
        <p>
          {' '}
          Third step: Recreate launchpad wallet and accounts.
          <a
            href="https://github.com/wealdtech/ethdo/blob/master/docs/howto.md#recreate-launchpad-wallet-and-accounts"
            rel="noreferrer"
            target="_blank"
          >
            ethdo/howto.md at master · wealdtech/ethdo
          </a>
        </p>
        <p>
          Fourth step: use the validator depostidata command to generate deposit data.{' '}
          <a
            href="https://github.com/wealdtech/ethdo/blob/master/docs/usage.md#depositdata"
            rel="noreferrer"
            target="_blank"
          >
            ethdo/usage.md at master · wealdtech/ethdo
          </a>
        </p>
        <p>
          Last step: paste the generated data: pubKey, eth amount, signature, depositDataRoot and submit it on the form.
          So that we could provide for the staker to stake on your validator
        </p>
      </Card>
      <Divider sx={{ marginBottom: '20px' }}>Or</Divider>

      <Card
        sx={{
          maxWidth: '600px',
          borderRadius: '8px',
          backgroundColor: theme.palette.common.white,
          padding: '34px 80px',
          mb: '27px',
          [theme.breakpoints.down('sm')]: {
            padding: '20px',
          },
          '& pre': {
            marginBottom: '20px',
          },
        }}
      >
        <Typography
          component="h4"
          sx={{
            mb: '20px',
            fontSize: '22px',
            fontWeight: '600',
          }}
          variant="h4"
        >
          Follow instructions to use Ethdo without launchpad
        </Typography>
        <p>
          First step: install EthDo{' '}
          <a href="https://github.com/wealdtech/ethdo#install" rel="noreferrer" target="_blank">
            wealdtech/ethdo
          </a>
        </p>
        <p>
          Second step: Create wallet
          <a
            href="https://github.com/wealdtech/ethdo/blob/master/docs/usage.md#create"
            rel="noreferrer"
            target="_blank"
          >
            ethdo/usage.md at master · wealdtech/ethdo
          </a>
        </p>
        <small>Example Command:</small>
        <br />
        <pre>
          <code>
            {`docker run -v $HOME/.config/ethereum2/wallets:/data wealdtech/ethdo wallet create --wallet=wallet
          --base-dir=/data --type="hd" --wallet-passphrase="XXXXXXXX"`}
          </code>
        </pre>
        <p>
          Third step: Create account{' '}
          <a
            href="https://github.com/wealdtech/ethdo/blob/master/docs/usage.md#create-1"
            rel="noreferrer"
            target="_blank"
          >
            ethdo/usage.md at master · wealdtech/ethdo{' '}
          </a>
        </p>
        <small>Example Command:</small>
        <br />
        <pre>
          <code>
            {` docker run -v $HOME/.config/ethereum2/wallets:/data wealdtech/ethdo account create --account=wallet/account
            --base-dir=/data --wallet-passphrase="XXXXXXXX" --passphrase="XXXXXXXX"`}
          </code>
        </pre>
        <p>
          Fourth step: Create deposit data{' '}
          <a
            href="https://github.com/wealdtech/ethdo/blob/master/docs/usage.md#depositdata"
            rel="noreferrer"
            target="_blank"
          >
            ethdo/usage.md at master · wealdtech/ethdo{' '}
          </a>
        </p>
        <small>Example command for 1 Ether:</small>
        <pre>
          <code>
            {`docker run -v $HOME/.config/ethereum2/wallets:/data wealdtech/ethdo --base-dir=/data validator depositdata
            --withdrawaladdress=0xF60e61765fA8d038a00f4a647676Cb21E6d3F2b2 --depositvalue="1 Ether"
            --validatoraccount=wallet/account --passphrase="XXXXXXXX"`}
          </code>
        </pre>
        <p>
          Last step: paste the generated data: signature, depositDataRoot, and submit it on the form. So that we could
          provide that information to the staker for them to stake Ether on your validator
        </p>
      </Card>
    </>
  );
};

export default RegisterStepOne;
