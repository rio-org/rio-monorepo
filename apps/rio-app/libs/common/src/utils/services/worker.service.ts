import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkerService {
  workerPath: string;
  _common: boolean;
  _worker: string;

  constructor() {
    // We have to figure out the proper pathing to the worker
    this.workerPath = '.';

    if (__dirname.indexOf('/libs/common/src/utils/services') > -1) {
      // Local test case(s)
      this.workerPath = './../../..';
    }
  }

  /**
   * Get/Set the common test case flag
   */
  public get common(): boolean {
    return this._common;
  }
  public set common(common: boolean) {
    this._common = common || false;
  }

  /**
   * Get/Set the worker script
   */
  public get worker(): string {
    return `${this.workerPath}${this.common ? '/../..' : ''}${this._worker}`;
  }
  public set worker(worker: string) {
    this._worker = worker;
  }

  /**
   * Creates a timeout Promise to run alongside the worker
   * @param timeout milliseconds
   * @param ret (optional) value to return if a timeout is reached
   */
  public static getTimeoutRacer(timeout: number, ret?: any): Promise<any>[] {
    return timeout
      ? [
          (async () => {
            await new Promise((res) => setTimeout(res, timeout));
            return ret;
          })(),
        ]
      : [];
  }
}
