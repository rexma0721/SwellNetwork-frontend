// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber } from '@ethersproject/bignumber';

export interface PositionDetails {
  tokenId: BigNumber;
  pubKey: string;
  value: BigNumber;
  baseTokenBalance: BigNumber;
  timeStamp: BigNumber;
}
