import React, { useEffect, useState } from 'react';
import { AssetDetails, TokenSymbol } from '../../lib/typings';
import { ASSETS, DESKTOP_MQ } from '../../lib/constants';
import Image from 'next/image';
import IconSelectArrow from '../Icons/IconSelectArrow';
import cx from 'classnames';
import { Drawer } from '@material-tailwind/react';
import { useMediaQuery } from 'react-responsive';
import AssetList from './AssetList';

type Props = {
  activeTokenSymbol: TokenSymbol;
  assets: AssetDetails[];
  setActiveToken: (asset: AssetDetails) => void;
  setIsFocused: (isFocused: boolean) => void;
  unFocusInput: () => void;
};

const AssetSelector = ({
  activeTokenSymbol,
  assets,
  setActiveToken,
  unFocusInput
}: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    if (!isDesktopOrLaptop && !isListOpen) {
      unFocusInput();
      setIsListOpen(true);
    } else {
      setIsListOpen(!isListOpen);
    }
  };

  return (
    <>
      <button
        onClick={() => handleClick()}
        className={cx(
          'flex flex-row gap-1 justify-center items-center py-1 pl-1 pr-2 rounded-full bg-[var(--color-element-wrapper-bg-light)] duration-200 hover:bg-[var(--color-element-wrapper-bg-light-hover)] transition-colors',
          isListOpen && 'bg-[var(--color-element-wrapper-bg-light-hover)]'
        )}
      >
        <Image
          src={ASSETS[activeTokenSymbol].logo}
          alt={`${ASSETS[activeTokenSymbol].name} logo`}
          width={24}
          height={24}
        />
        <span className="pr-2">{activeTokenSymbol}</span>
        <div className="w-fit flex-none">
          <IconSelectArrow direction={isListOpen ? 'up' : 'down'} />
        </div>
      </button>
      {isDesktopOrLaptop && isListOpen && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white rounded-xl shadow-xl z-10 overflow-y-auto p-[2px] h-fit">
          <AssetList
            activeTokenSymbol={activeTokenSymbol}
            assets={assets}
            setActiveToken={setActiveToken}
            setIsListOpen={setIsListOpen}
          />
        </div>
      )}
      {isMounted && !isDesktopOrLaptop && isListOpen && (
        <Drawer
          placement="bottom"
          size={330}
          open={isListOpen}
          onClose={() => setIsListOpen(false)}
          className="rounded-t-2xl p-4"
        >
          <AssetList
            activeTokenSymbol={activeTokenSymbol}
            assets={assets}
            setActiveToken={setActiveToken}
            setIsListOpen={setIsListOpen}
          />
        </Drawer>
      )}
    </>
  );
};

export default AssetSelector;
