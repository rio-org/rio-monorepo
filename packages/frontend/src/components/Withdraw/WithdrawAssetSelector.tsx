import React, { useRef, useState } from 'react';
import { AssetDetails } from '@rio-monorepo/ui/lib/typings';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import AssetItemContent from '@rio-monorepo/ui/components/Assets/AssetItemContent';
import WithdrawAssetItem from '@rio-monorepo/ui/components/Assets/WithdrawAssetItem';
import IconSelectArrow from '@rio-monorepo/ui/components/Icons/IconSelectArrow';
import { useMediaQuery } from 'react-responsive';
import { Drawer } from '@material-tailwind/react';
import { useOutsideClick } from '@rio-monorepo/ui/hooks/useOutsideClick';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { cn } from '@rio-monorepo/ui/lib/utilities';
import { twJoin } from 'tailwind-merge';

type Props = {
  disabled?: boolean;
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
            isBestRate={asset.symbol === '＊ETH' ? true : false} // todo: make dynamic when "best rate" data is made available
          />
        );
      })}
    </>
  );
};

const WithdrawAssetSelector = ({
  assetsList,
  disabled,
  activeToken,
  setActiveToken
}: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const isMounted = useIsMounted();
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const drawerContentRef = useRef<HTMLDivElement>(null);
  const listRef = useOutsideClick(() => {
    setIsListOpen(false);
  }, isButtonHovered);

  return (
    <>
      <div className="relative">
        <div>
          <label
            htmlFor="asset"
            className="block mb-1 font-medium"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Select asset
          </label>
          <button
            className={cn(
              twJoin(
                'flex flex-row items-center gap-4 lg:gap-4',
                'w-full p-4 lg:px-[20px] lg:py-4',
                'text-left text-black',
                'bg-black bg-opacity-5',
                'rounded-xl border border-transparent hover:border-gray-300'
              ),
              isListOpen && 'border-gray-400 hover:border-gray-400'
            )}
            disabled={disabled}
            id="asset"
            onClick={() => setIsListOpen(!isListOpen)}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
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
          <div
            ref={listRef}
            className={twJoin(
              'absolute z-10 top-[calc(100%+10px)]',
              'left-0 w-full h-fit p-[2px] overflow-y-auto',
              'bg-white rounded-xl shadow-xl'
            )}
          >
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
