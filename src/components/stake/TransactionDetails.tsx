import { FC, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, CircularProgress, styled } from '@mui/material';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useWeb3React } from 'web3-react-core';

import chainlinkAggregatorABI from '../../abis/ChainlinkAggregator.json';
import { useSwNftContract } from '../../hooks/useContract';
import { ListColumn, SwellIcon } from '../../theme/uiComponents';
import { displayErrorMessage } from '../../utils/errors';

const Row = styled(ListColumn)({
  paddingInline: '11px',
});

interface IProps {
  watchField: string;
}

const nodeOperatorPublicKey = process.env.REACT_APP_NODE_OPERATOR_PUB_KEY;
const nodeOperatorSignatureGoerli = process.env.REACT_APP_NODE_OPERATOR_SIGNATURE_GOERLI;
const nodeOperatorDepositDataRootGoerli = process.env.REACT_APP_NODE_OPERATOR_DEPOSIT_DATA_ROOT_GOERLI;
const nodeOperatorSignatureKaleido = process.env.REACT_APP_NODE_OPERATOR_SIGNATURE_KALEIDO;
const nodeOperatorDepositDataRootKaleido = process.env.REACT_APP_NODE_OPERATOR_DEPOSIT_DATA_ROOT_KALEIDO;
const chainlinkContractAddress = process.env.REACT_APP_CHAINLINK_DATA_ETH_CONTRACT;

const TransactionDetails: FC<IProps> = ({ watchField }) => {
  const { watch } = useFormContext();
  const { enqueueSnackbar } = useSnackbar();
  const { account, library, chainId } = useWeb3React();
  const enteredAmount = watch(watchField);
  const swNFTContract = useSwNftContract();
  const [transactionFees, setTransactionFees] = useState(0);
  const [isFetchingTransactionFees, setFetchingTransactionFees] = useState(false);
  const getNodeOperatorCredentials = () => {
    const pubKey = nodeOperatorPublicKey;
    const signature = chainId === 5 ? nodeOperatorSignatureGoerli : nodeOperatorSignatureKaleido;
    const depositDataRoot = chainId === 5 ? nodeOperatorDepositDataRootGoerli : nodeOperatorDepositDataRootKaleido;
    return { pubKey, signature, depositDataRoot };
  };

  const nodeOperatorCredentials = getNodeOperatorCredentials();
  const getTransactionFees = useCallback(async () => {
    if (swNFTContract && chainlinkContractAddress) {
      setFetchingTransactionFees(true);
      try {
        const stakeAmount = ethers.utils.parseEther(enteredAmount.toString());
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
        const ethPriceInUSD: number = await chainlinkAggregatorContract.latestAnswer();
        const returnedPriceInUSD = Number(ethers.utils.formatUnits(ethPriceInUSD, 8));
        setFetchingTransactionFees(false);
        return Number((transactionFee * returnedPriceInUSD).toFixed(2));
      } catch (error) {
        displayErrorMessage(enqueueSnackbar, error);
        setFetchingTransactionFees(false);
      }
    }
    return 0;
  }, [
    enqueueSnackbar,
    enteredAmount,
    library,
    nodeOperatorCredentials.depositDataRoot,
    nodeOperatorCredentials.pubKey,
    nodeOperatorCredentials.signature,
    swNFTContract,
  ]);
  useEffect(() => {
    async function fetchData() {
      const fees = await getTransactionFees();
      setTransactionFees(fees);
    }
    if (account && enteredAmount && enteredAmount > 0) fetchData();
  }, [account, enteredAmount, getTransactionFees]);
  return (
    <Box sx={{ marginTop: '20px' }}>
      <Row>
        You will receive
        <span>
          <SwellIcon size="xs" /> {enteredAmount ?? 0} swETH
        </span>
      </Row>
      <Row>
        Exchange rate
        <span>1 ETH = 1 swETH</span>
      </Row>
      <Row>
        Suggested transaction cost
        <span>{isFetchingTransactionFees ? <CircularProgress size={13} /> : `$${transactionFees}`}</span>
      </Row>
    </Box>
  );
};
export default TransactionDetails;
