import { SupportedChainId } from './chains';

type AddressMap = { [chainId: number]: string };

// eslint-disable-next-line import/prefer-default-export
export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.KALEIDO]: '0xAd3E1FcF1605Df02bB6c3c7d53B9382ab4E2D964',
};
export const SWNFT_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0xe59aC2C5Ae8462554308c578aE4bc8e4098d0414',
  [SupportedChainId.KALEIDO]: '0xF60e61765fA8d038a00f4a647676Cb21E6d3F2b2',
};
export const SWETH_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0xe438a1ad5C5f29B6346e92eefdEAb8B4A1a8B3Cf',
  [SupportedChainId.KALEIDO]: '0xCF3C4A750fe21C30DeE2dB3ABEd3F40d1E6DE02c',
};
