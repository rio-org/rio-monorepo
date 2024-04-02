import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  static readonly DaysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  /**
   * Converts time (00:10:08) into seconds
   * @param time a string representation of a time in format HH:MM:SS
   */
  public static getSecondsFromTime(time: string): number {
    const [hours = 0, minutes = 0, seconds = 0] = time.split(':');
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

  /**
   * Formats a date as `YYYY-MM-DD` aka `2021-07-14`
   * @param date The date to format
   * @param zeroPadding To add zero padding or not. Defaults to false.
   */
  public formatYearMonthDay(date: Date, zeroPadding = false): string {
    if (zeroPadding) {
      return date.toISOString().split('T')[0];
    }
    return `${date.getUTCFullYear()}-${
      date.getUTCMonth() + 1
    }-${date.getUTCDate()}`;
  }

  /**
   * Formats a date as `MM/DD/YYYY Day` aka `07/26/2021 Monday`
   * @param date The date to format
   */
  public formatMonthDayYearFullDay(date: Date): string {
    return `${
      date.getUTCMonth() + 1
    }/${date.getUTCDate()}/${date.getUTCFullYear()} ${
      DateService.DaysOfTheWeek[date.getUTCDay()]
    }`;
  }

  /**
   * Returns a string representation of the parameter date that is passed in
   * @param dayString a string representation of a date in format YYYY-MM-DD
   */
  public getDayOfWeek(day: string): string {
    const dayArr = day.split('-');
    const date = new Date(
      Number(dayArr[0]),
      Number(dayArr[1]) - 1,
      Number(dayArr[2]),
    );
    return DateService.DaysOfTheWeek[date.getUTCDay()];
  }
}
