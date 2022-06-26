import { SupportedChainId } from './chains';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`);
}

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
// eslint-disable-next-line import/prefer-default-export
export const INFURA_NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.KALEIDO]: `https://a0sv8enxlo:Kg4U1ZHfDPbe73AmOGrL1W5guN0ndXnUjcfZbfl5OqA@a0dvp0tprn-a0tyfit5m9-rpc.au0-aws.kaleido.io`,
};
