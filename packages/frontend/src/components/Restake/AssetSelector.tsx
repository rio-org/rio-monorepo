import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';
import { Drawer } from '@material-tailwind/react';
import { useMediaQuery } from 'react-responsive';
import AssetList from './AssetList';
import { twJoin, twMerge } from 'tailwind-merge';
import Skeleton from 'react-loading-skeleton';

import IconSelectArrow from '@rio-monorepo/ui/components/Icons/IconSelectArrow';
import { AssetDetails, TokenSymbol } from '@rio-monorepo/ui/lib/typings';
import { useOutsideClick } from '@rio-monorepo/ui/hooks/useOutsideClick';
import { ASSETS, DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';

type Props = {
  activeTokenSymbol?: TokenSymbol;
  assets: AssetDetails[];
  isDisabled?: boolean;
  setActiveToken: (asset: AssetDetails) => void;
  setIsFocused: (isFocused: boolean) => void;
  unFocusInput: () => void;
};

const AssetSelector = ({
  activeTokenSymbol,
  assets,
  isDisabled,
  setActiveToken,
  unFocusInput
}: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const isMounted = useIsMounted();
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  const eligibleAssets = useMemo(() => {
    return assets.filter((asset) => asset.symbol !== 'reETH');
  }, [assets]);

  const handleClick = () => {
    if (!isDesktopOrLaptop && !isListOpen) {
      unFocusInput();
      setIsListOpen(true);
    } else {
      if (isListOpen) {
        setIsListOpen(false);
      }
      if (!isListOpen) {
        setIsListOpen(true);
      }
    }
  };

  const listRef = useOutsideClick(() => {
    setIsListOpen(false);
  }, isButtonHovered);

  const isDropdown = eligibleAssets.length > 1;

  const buttonClassName = useMemo(() => {
    return twMerge(
      'flex flex-row gap-1 justify-center items-center',
      'py-1 pl-1 pr-2 rounded-full bg-[var(--color-element-wrapper-bg-light)]',
      isDropdown
        ? 'duration-200 hover:bg-[var(--color-element-wrapper-bg-light-hover)] transition-colors'
        : 'pr-0'
    );
  }, [isDropdown]);

  const buttonInternal = useMemo(
    () => (
      <>
        {activeTokenSymbol ? (
          <Image
            src={ASSETS[activeTokenSymbol].logo}
            alt={`${ASSETS[activeTokenSymbol].name} logo`}
            width={24}
            height={24}
          />
        ) : (
          <Skeleton width={24} height={24} />
        )}
        <span className="pr-2">{activeTokenSymbol}</span>
      </>
    ),
    [activeTokenSymbol]
  );

  return (
    <>
      {isDropdown ? (
        <button
          onClick={() => !isDisabled && handleClick()}
          className={cx(
            buttonClassName,
            isListOpen && 'bg-[var(--color-element-wrapper-bg-light-hover)]'
          )}
          disabled={isDisabled}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          {buttonInternal}
          <div className="w-fit flex-none">
            <IconSelectArrow direction={isListOpen ? 'up' : 'down'} />
          </div>
        </button>
      ) : (
        <div className={buttonClassName}>{buttonInternal}</div>
      )}
      {isDropdown && isDesktopOrLaptop && isListOpen && (
        <div
          ref={listRef}
          className={twJoin(
            'absolute top-[calc(100%+10px)] left-0 w-full',
            'bg-white rounded-xl shadow-xl z-10 overflow-y-auto p-[2px] h-fit'
          )}
        >
          <AssetList
            activeTokenSymbol={activeTokenSymbol}
            assets={eligibleAssets}
            setActiveToken={setActiveToken}
            setIsListOpen={setIsListOpen}
          />
        </div>
      )}
      {isDropdown && isMounted && !isDesktopOrLaptop && isListOpen && (
        <Drawer
          placement="bottom"
          size={330}
          open={isListOpen}
          onClose={() => setIsListOpen(false)}
          className="rounded-t-2xl p-4"
        >
          <AssetList
            activeTokenSymbol={activeTokenSymbol}
            assets={eligibleAssets}
            setActiveToken={setActiveToken}
            setIsListOpen={setIsListOpen}
          />
        </Drawer>
      )}
    </>
  );
};

export default AssetSelector;
