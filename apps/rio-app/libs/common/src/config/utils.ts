// Possible values based on the active environment
interface EnvironmentValues<D, P> {
  development: D;
  deployed: P;
}

export class ConfigUtils {
  /**
   * Convert the passed value to a boolean
   * @param value The value to convert
   */
  public static toBoolean(value: boolean | string | undefined) {
    return value?.toString() === 'true';
  }

  /**
   * Convert the passed value to a number
   * @param value The value to convert
   */
  public static toNumber(value: string | undefined) {
    return parseFloat(value as string);
  }

  /**
   * Convert the passed value to an integer
   * @param value The value to convert
   * @param defaultInteger A default integer value if `value` is NaN
   */
  public static toInteger(value: string | undefined, defaultInteger?: number) {
    const result = parseInt(value as string, 10);
    if (isNaN(result)) {
      return defaultInteger;
    }
    return result;
  }

  /**
   * Return the correct value for the active environment
   * @param values The possible environment values
   */
  public static getValueForEnvironment<D, P>(values: EnvironmentValues<D, P>) {
    if (process.env.NODE_ENV === 'production') {
      return values.deployed;
    }
    return values.development;
  }
}
