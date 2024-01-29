import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import {
  APP_ENV,
  DATADOG_APPLICATION_ID,
  DATADOG_CLIENT_TOKEN
} from '../config';
import { AppEnv } from '../lib/typings';

export const useInitDataDog = (service: string) => {
  useEffect(() => {
    if (APP_ENV === AppEnv.DEVELOPMENT) return;
    datadogRum.init({
      applicationId: DATADOG_APPLICATION_ID,
      clientToken: DATADOG_CLIENT_TOKEN,
      site: 'us5.datadoghq.com',
      service,
      env: APP_ENV,
      // Specify a version number to identify the deployed version of your application in Datadog
      // version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input'
    });
  }, []);
};
