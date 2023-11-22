import React, { useEffect, useRef, useState } from 'react';
import { TokenSymbol } from '../../lib/typings';
import { ASSETS, DESKTOP_MQ } from '../../lib/constants';
import AssetItemContent from '../Assets/AssetItemContent';
import WithdrawAssetItem from '../Assets/WithdrawAssetItem';
import IconSelectArrow from '../Icons/IconSelectArrow';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { Drawer } from '@material-tailwind/react';

type Props = {
  activeTokenSymbol: TokenSymbol;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
};

const List = ({
  setIsListOpen,
  activeTokenSymbol,
  setActiveTokenSymbol
}: {
  setIsListOpen: (isListOpen: boolean) => void;
  activeTokenSymbol: TokenSymbol;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
}) => {
  return (
    <>
      {Object.values(ASSETS).map((asset) => {
        // don't display reETH in the asset selector
        if (asset.symbol === 'reETH') return null;
        return (
          <WithdrawAssetItem
            asset={asset}
            key={asset.symbol}
            isActiveToken={asset.symbol === activeTokenSymbol}
            setActiveTokenSymbol={setActiveTokenSymbol}
            setIsListOpen={setIsListOpen}
            isBestRate={asset.symbol === '＊ETH' ? true : false} // todo: make dynamic
          />
        );
      })}
    </>
  );
};

const WithdrawAssetSelector = ({
  activeTokenSymbol,
  setActiveTokenSymbol
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const drawerContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  console.log(
    'drawerContentRef.current?.offsetHeight',
    drawerContentRef?.current?.offsetHeight
  );

  return (
    <>
      <div className="relative">
        <div>
          <label htmlFor="asset" className="block mb-1 font-medium">
            Select asset
          </label>
          <button
            className={cx(
              'flex flex-row gap-4 lg:gap-4 items-center w-full text-left bg-black bg-opacity-5 text-black p-4 lg:px-[20px] lg:py-4 rounded-xl border border-transparent hover:border-gray-300',
              isListOpen && 'border-gray-400 hover:border-gray-400'
            )}
            id="asset"
            onClick={() => setIsListOpen(!isListOpen)}
          >
            <AssetItemContent
              asset={ASSETS[activeTokenSymbol]}
              isActiveToken={false}
              isLoading={false}
              isError={false}
              isSelectorDisplay={true}
              isBestRate={
                ASSETS[activeTokenSymbol].symbol === '＊ETH' ? true : false
              }
              amount={<></>}
            />
            <IconSelectArrow direction={isListOpen ? 'up' : 'down'} />
          </button>
        </div>
        {isDesktopOrLaptop && isListOpen && (
          <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white rounded-xl shadow-xl z-10 overflow-y-auto p-[2px] h-fit">
            <List
              setIsListOpen={setIsListOpen}
              activeTokenSymbol={activeTokenSymbol}
              setActiveTokenSymbol={setActiveTokenSymbol}
            />
          </div>
        )}
      </div>

      {isMounted && !isDesktopOrLaptop && (
        <Drawer
          placement="bottom"
          size={470}
          // size={drawerContentRef.current?.offsetHeight} // todo
          open={isListOpen}
          onClose={() => setIsListOpen(false)}
          className="rounded-t-2xl p-4"
        >
          <div ref={drawerContentRef}>
            <List
              setIsListOpen={setIsListOpen}
              activeTokenSymbol={activeTokenSymbol}
              setActiveTokenSymbol={setActiveTokenSymbol}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

export default WithdrawAssetSelector;
