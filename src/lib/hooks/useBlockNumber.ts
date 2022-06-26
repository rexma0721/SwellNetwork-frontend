import { useCallback, useEffect, useState } from 'react';

import { atom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useDebounce from '../../hooks/useDebounce';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';

function useBlock() {
  const { chainId, library } = useActiveWeb3React();
  const windowVisible = useIsWindowVisible();
  const [state, setState] = useState<{ chainId?: number; block?: number }>({ chainId });

  const onBlock = useCallback(
    (block: number) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setState((state) => {
        if (state.chainId === chainId) {
          if (typeof state.block !== 'number') return { chainId, block };
          return { chainId, block: Math.max(block, state.block) };
        }
        return state;
      });
    },
    [chainId]
  );

  useEffect(() => {
    if (library && chainId && windowVisible) {
      setState({ chainId });

      library
        .getBlockNumber()
        .then(onBlock)
        .catch((error) => {
          // eslint-disable-next-line  no-console
          console.error(`Failed to get block number for chainId ${chainId}`, error);
        });

      library.on('block', onBlock);
      return () => {
        library.removeListener('block', onBlock);
      };
    }
    return undefined;
  }, [chainId, library, onBlock, windowVisible]);

  const debouncedBlock = useDebounce(state.block, 100);
  return state.block ? debouncedBlock : undefined;
}

const blockAtom = atom<number | undefined>(undefined);

// eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types
export function BlockUpdater() {
  const setBlock = useUpdateAtom(blockAtom);
  const block = useBlock();
  useEffect(() => {
    setBlock(block);
  }, [block, setBlock]);
  return null;
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export default function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();
  const block = useAtomValue(blockAtom);
  return chainId ? block : undefined;
}

export function useFastForwardBlockNumber(): (block: number) => void {
  return useUpdateAtom(blockAtom);
}
