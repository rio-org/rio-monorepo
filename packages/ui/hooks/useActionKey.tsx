'use client';

import { atomWithStorage } from 'jotai/utils';
import { PlusIcon } from 'lucide-react';
import { useAtom } from 'jotai';

import { IconKeyCmd } from '../components/Icons/IconKeyCmd';
import { NavigatorWithUAD } from '../lib/typings';

type ActionKeyConfig = {
  actionKey: {
    short: string | React.ReactNode;
    long: string;
  };
  os: 'mac' | 'windows' | 'other';
};

const ACTION_KEY_DEFAULT = {
  short: (
    <span className="inline-block text-[7px] mr-0.5 tracking-tighter">
      Ctrl
      <PlusIcon size="8" className="inline-block -translate-y-px ml-0.5" />
    </span>
  ),
  long: 'Control'
} as const;
const ACTION_KEY_APPLE = {
  short: <IconKeyCmd height={8.5} width={8.5} />,
  long: 'Command'
} as const;

const macRegEx = /Mac|iPhone|iPod|iPad/i;
const windowsRegEx = /Win/i;

const actionKeyAtom = atomWithStorage<ActionKeyConfig>(
  'action-key-config',
  _getActionKeyValues()
);

export function useActionKey() {
  return useAtom(actionKeyAtom);
}

//
// Helpers
//

function _buildConfig(
  actionKey: ActionKeyConfig['actionKey'],
  os: ActionKeyConfig['os']
): ActionKeyConfig {
  return { actionKey, os };
}

function _getConfigUsingAgentValue(agentValue: string): ActionKeyConfig {
  if (macRegEx.test(agentValue)) {
    return _buildConfig(ACTION_KEY_APPLE, 'mac');
  } else {
    return _buildConfig(
      ACTION_KEY_DEFAULT,
      windowsRegEx.test(agentValue) ? 'windows' : 'other'
    );
  }
}

function _getActionKeyValues(): ActionKeyConfig {
  'use client';

  const nav = globalThis.navigator as NavigatorWithUAD | undefined;

  if (!nav) {
    return _buildConfig(ACTION_KEY_DEFAULT, 'windows');
  }

  const userAgentValue = [
    nav.userAgentData?.platform,
    nav?.platform,
    nav?.userAgent
  ].find(Boolean);

  if (!userAgentValue) {
    return _buildConfig(ACTION_KEY_DEFAULT, 'windows');
  }

  return _getConfigUsingAgentValue(userAgentValue);
}
