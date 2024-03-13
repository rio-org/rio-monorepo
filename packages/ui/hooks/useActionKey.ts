'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { NavigatorWithUAD } from '../lib/typings';

type ActionKeyConfig = {
  actionKey: {
    short: string;
    long: string;
  };
  os: 'mac' | 'windows' | 'other';
};

const ACTION_KEY_DEFAULT = { short: 'Ctrl', long: 'Control' } as const;
const ACTION_KEY_APPLE = { short: '⌘', long: 'Command' } as const;

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
