/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';

import chainlinkAggregatorABI from '../../../abis/ChainlinkAggregator.json';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import { useSwNftContract } from '../../../hooks/useContract';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { setIsConfirmStakeModalOpen } from '../../../state/modal/modalSlice';
import { StakingPage } from '../../../state/stake/stakeSlice';
import { EthereumIcon, List, ListColumn, Modal, SwellIcon } from '../../../theme/uiComponents';
import { displayErrorMessage } from '../../../utils/errors';

/*
// @TODO
create redux store for open modal 
store wallet data into redux store
*/

const nodeOperatorPublicKey = process.env.REACT_APP_NODE_OPERATOR_PUB_KEY;
const nodeOperatorSignatureGoerli = process.env.REACT_APP_NODE_OPERATOR_SIGNATURE_GOERLI;
const nodeOperatorDepositDataRootGoerli = process.env.REACT_APP_NODE_OPERATOR_DEPOSIT_DATA_ROOT_GOERLI;
const nodeOperatorSignatureKaleido = process.env.REACT_APP_NODE_OPERATOR_SIGNATURE_KALEIDO;
const nodeOperatorDepositDataRootKaleido = process.env.REACT_APP_NODE_OPERATOR_DEPOSIT_DATA_ROOT_KALEIDO;
const nodeOperatorSignatureGoerli16 = process.env.REACT_APP_NODE_OPERATOR_SIGNATURE_GOERLI_16;
const nodeOperatorDepositDataRootGoerli16 = process.env.REACT_APP_NODE_OPERATOR_DEPOSIT_DATA_ROOT_GOERLI_16;
const nodeOperatorSignatureKaleido16 = process.env.REACT_APP_NODE_OPERATOR_SIGNATURE_KALEIDO_16;
const nodeOperatorDepositDataRootKaleido16 = process.env.REACT_APP_NODE_OPERATOR_DEPOSIT_DATA_ROOT_KALEIDO_16;
const chainlinkContractAddress = process.env.REACT_APP_CHAINLINK_DATA_ETH_CONTRACT;

const ConfirmStakeModal: FC = () => {
  const { account, library, chainId } = useActiveWeb3React();
  const { enqueueSnackbar } = useSnackbar();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isConfirmStakeModalOpen } = useAppSelector((state) => state.modal);
  const { amount, page } = useAppSelector((state) => state.stake);
  const swNFTContract = useSwNftContract();
  const [fee, setFee] = useState<number>(0);
  const [isDisabled, setDisabled] = useState(false);
  const getNodeOperatorCredentials = () => {
    if (page === StakingPage.DEPOSIT_ETHEREUM) {
      const pubKey = nodeOperatorPublicKey;
      const signature = chainId === 5 ? nodeOperatorSignatureGoerli16 : nodeOperatorSignatureKaleido16;
      const depositDataRoot =
        chainId === 5 ? nodeOperatorDepositDataRootGoerli16 : nodeOperatorDepositDataRootKaleido16;
      return { pubKey, signature, depositDataRoot };
    }
    const pubKey = nodeOperatorPublicKey;
    const signature = chainId === 5 ? nodeOperatorSignatureGoerli : nodeOperatorSignatureKaleido;
    const depositDataRoot = chainId === 5 ? nodeOperatorDepositDataRootGoerli : nodeOperatorDepositDataRootKaleido;
    return { pubKey, signature, depositDataRoot };
  };

  const nodeOperatorCredentials = getNodeOperatorCredentials();
  const calculateTransactionFee = useCallback(async () => {
    try {
      if (swNFTContract && amount && chainlinkAggregatorABI && chainlinkContractAddress && library) {
        const stakeAmount = ethers.utils.parseEther(amount.toString());
        const gasPrice = ethers.utils.formatUnits(await library.getGasPrice(), 'ether');
        const estimate = await swNFTContract.estimateGas.stake(
          [
            {
              pubKey: nodeOperatorCredentials.pubKey,
              signature: nodeOperatorCredentials.signature,
              depositDataRoot: nodeOperatorCredentials.depositDataRoot,
              amount: stakeAmount,
            },
          ],
          {
            value: stakeAmount,
          }
        );
        const gasUnits = parseInt(
          // eslint-disable-next-line no-underscore-dangle
          estimate._hex,
          16
        );
        const transactionFee = parseFloat(gasPrice) * gasUnits;
        const customProvider = new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        );
        const chainlinkAggregatorContract = new ethers.Contract(
          chainlinkContractAddress,
          JSON.stringify(chainlinkAggregatorABI),
          customProvider
        );
        const ethPriceInUSD = await chainlinkAggregatorContract.latestAnswer();
        const returnedPriceInUSD = Number(ethers.utils.formatUnits(ethPriceInUSD, 8));
        const transactionFeeInUSD = Number((transactionFee * returnedPriceInUSD).toFixed(2));
        setFee(transactionFeeInUSD);
      }
      // eslint-disable-next-line no-empty
    } catch (error: any) {}
  }, [amount, library, nodeOperatorCredentials, swNFTContract]);

  const dispatch = useAppDispatch();

  const confirmStakeHandler = async () => {
    try {
      setDisabled(true);
      if (account && amount && swNFTContract) {
        const stakeAmount = ethers.utils.parseEther(amount.toString());
        const tx = await swNFTContract.stake(
          [
            {
              pubKey: nodeOperatorCredentials.pubKey,
              signature: nodeOperatorCredentials.signature,
              depositDataRoot: nodeOperatorCredentials.depositDataRoot,
              amount: stakeAmount,
            },
          ],
          {
            gasLimit: 30000000,
            value: stakeAmount,
          }
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          enqueueSnackbar('Staking successful', { variant: 'success' });
          dispatch(setIsConfirmStakeModalOpen(false));
          if (pathname === '/deposit-ethereum') {
            navigate('/');
          }
        } else {
          enqueueSnackbar('Staking unsuccessful', { variant: 'error' });
        }
      }
    } catch (error) {
      displayErrorMessage(enqueueSnackbar, error);
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    calculateTransactionFee();
  }, [calculateTransactionFee]);

  return (
    <Modal
      maxWidth="sm"
      onClose={() => dispatch(setIsConfirmStakeModalOpen(false))}
      open={isConfirmStakeModalOpen}
      sx={{
        '& .MuiDialogTitle-root,  & .MuiDialogContent-root': {
          paddingInline: {
            sm: '38px',
          },
        },
        '& .MuiDialogTitle-root button': {
          right: { sm: '20px' },
        },
      }}
      title="Confirm Stake"
    >
      <Box
        sx={{
          borderRadius: '15px',
          fontWeight: 500,
          fontSize: 16.9,
          '& a': {
            color: 'inherit',
            fontWeight: 600,
            textDecoration: 'underline',
          },
        }}
      >
        <List sx={{ marginBottom: 0, div: { padding: 0, paddingInline: { sm: '7px' }, lineHeight: '3rem' } }}>
          <ListColumn>
            Amount staked
            <span>
              <EthereumIcon sx={{ height: 16, width: 16, marginRight: '5px' }} />
              {amount}
            </span>
          </ListColumn>
          <ListColumn>
            Annual percentage rate <span>4%</span>
          </ListColumn>
          <ListColumn>
            You will receive
            <span>
              <SwellIcon size="xs" />
              {amount}
            </span>
          </ListColumn>
          <ListColumn>
            Exchange rate <span>1 ETH = 1 swETH</span>
          </ListColumn>
          <ListColumn>
            Transaction cost <span>{`$ ${fee}`}</span>
          </ListColumn>
          <LoadingButton
            disabled={isDisabled}
            fullWidth
            loading={isDisabled}
            onClick={confirmStakeHandler}
            sx={{ margin: '20px 0px 10px 0px' }}
            variant="contained"
          >
            Confirm
          </LoadingButton>
        </List>
      </Box>
    </Modal>
  );
};

export default ConfirmStakeModal;
