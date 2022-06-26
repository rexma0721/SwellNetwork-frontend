import { Ether, NativeCurrency, Token, WETH9 } from '@uniswap/sdk-core';

import { SWETH_ADDRESS } from './addresses';
import { SupportedChainId } from './chains';

export const SWETH: { [chainId: number]: Token } = {
  [SupportedChainId.GOERLI]: new Token(SupportedChainId.GOERLI, SWETH_ADDRESS[5], 18, 'swETH', 'Swell Ether'),
  [SupportedChainId.KALEIDO]: new Token(
    SupportedChainId.KALEIDO,
    SWETH_ADDRESS[1191572815],
    18,
    'swETH',
    'Swell Ether'
  ),
};

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token } = {
  ...WETH9,
};

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WRAPPED_NATIVE_CURRENCY) return WRAPPED_NATIVE_CURRENCY[this.chainId];
    throw new Error('Unsupported chain ID');
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {};

  public static onChain(chainId: number): ExtendedEther {
    // eslint-disable-next-line no-return-assign, no-underscore-dangle
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId));
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency } = {};
// eslint-disable-next-line import/prefer-default-export
export function nativeOnChain(chainId: number): NativeCurrency {
  // eslint-disable-next-line no-return-assign
  return cachedNativeCurrency[chainId] ?? (cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId));
}
