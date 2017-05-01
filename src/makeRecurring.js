import momentTimezone from 'moment-timezone';

const ONE_WEEK_MINUTES = 7 * 24 * 60;

export default function makeRecurring({ start, end }, timeZone, weekStartsOn) {
  if (!timeZone) {
    throw new Error('Missing timeZone');
  }
  if (!weekStartsOn) {
    throw new Error('Missing weekStartsOn');
  }
  const weekStart = momentTimezone.tz(start, timeZone)
    .hour(0)
    .minute(0)
    .seconds(0)
    .milliseconds(0);
  weekStart.day(weekStartsOn === 'monday' ? 1 : 0);
  const weekStartMs = weekStart.toDate().getTime();
  let startMins = (start.getTime() - weekStartMs) / 60000;
  let endMins = (end.getTime() - weekStartMs) / 60000;

  if (startMins < 0) {
    // This happens when the event starts on a sunday, but monday is set to
    // first day.
    startMins = ONE_WEEK_MINUTES + startMins;
    endMins = ONE_WEEK_MINUTES + endMins;
  }
  return {
    start: startMins,
    end: endMins,
  };
}
