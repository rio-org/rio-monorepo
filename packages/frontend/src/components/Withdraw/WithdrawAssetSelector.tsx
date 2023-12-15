import React, { useEffect, useRef, useState } from 'react';
import { AssetDetails } from '../../lib/typings';
import { DESKTOP_MQ } from '../../lib/constants';
import AssetItemContent from '../Assets/AssetItemContent';
import WithdrawAssetItem from '../Assets/WithdrawAssetItem';
import IconSelectArrow from '../Icons/IconSelectArrow';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { Drawer } from '@material-tailwind/react';

type Props = {
  assetsList: AssetDetails[];
  activeToken: AssetDetails;
  setActiveToken: (token: AssetDetails) => void;
};

const List = ({
  assetsList,
  setIsListOpen,
  activeToken,
  setActiveToken
}: {
  assetsList: AssetDetails[];
  setIsListOpen: (isListOpen: boolean) => void;
  activeToken: AssetDetails;
  setActiveToken: (token: AssetDetails) => void;
}) => {
  return (
    <>
      {assetsList.map((asset) => {
        // don't display reETH in the asset selector
        if (asset.symbol === 'reETH') return null;
        return (
          <WithdrawAssetItem
            token={asset}
            key={asset.symbol}
            isActiveToken={asset.symbol === activeToken.symbol}
            setActiveToken={setActiveToken}
            setIsListOpen={setIsListOpen}
            isBestRate={asset.symbol === '＊ETH' ? true : false} // todo: make dynamic
          />
        );
      })}
    </>
  );
};

const WithdrawAssetSelector = ({
  assetsList,
  activeToken,
  setActiveToken
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
              asset={activeToken}
              isActiveToken={false}
              isLoading={false}
              isError={false}
              isSelectorDisplay={true}
              isBestRate={activeToken.symbol === '＊ETH' ? true : false}
              amount={<></>}
            />
            <IconSelectArrow direction={isListOpen ? 'up' : 'down'} />
          </button>
        </div>
        {isDesktopOrLaptop && isListOpen && (
          <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white rounded-xl shadow-xl z-10 overflow-y-auto p-[2px] h-fit">
            <List
              assetsList={assetsList}
              setIsListOpen={setIsListOpen}
              activeToken={activeToken}
              setActiveToken={setActiveToken}
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
              assetsList={assetsList}
              setIsListOpen={setIsListOpen}
              activeToken={activeToken}
              setActiveToken={setActiveToken}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

export default WithdrawAssetSelector;
