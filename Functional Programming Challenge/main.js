const events = [
    {
      "start": "Wed, 03 Mar 2021 04:00:15 GMT",
      "end": "Wed, 03 Mar 2021 05:00:15 GMT"
    },
    {
      "start": "Wed, 03 Mar 2021 06:00:15 GMT",
      "end": "Wed, 03 Mar 2021 06:30:15 GMT"
    },
    {
      "start": "Wed, 03 Mar 2021 08:30:15 GMT",
      "end": "Wed, 03 Mar 2021 09:30:15 GMT"
    },
    {
      "start": "Wed, 03 Mar 2021 09:30:15 GMT",
      "end": "Wed, 03 Mar 2021 09:50:15 GMT"
    },
    {
      "start": "Wed, 03 Mar 2021 12:50:15 GMT",
      "end": "Wed, 03 Mar 2021 13:10:15 GMT"
    },
    {
      "start": "Wed, 03 Mar 2021 11:30:15 GMT",
      "end": "Wed, 03 Mar 2021 12:15:15 GMT"
    },
    {
      "start": "Wed, 03 Mar 2021 13:30:15 GMT",
      "end": "Wed, 03 Mar 2021 14:00:15 GMT"
    },
    {
      "start": "Wed, 03 Mar 2021 15:00:15 GMT",
      "end": "Wed, 03 Mar 2021 15:30:15 GMT"
    }
  ];
    const start = moment('Wed, 03 Mar 2021 05:00:15 GMT');
    const end = moment('Wed, 03 Mar 2021 05:30:15 GMT');
    const AvailableSlots = findAvailableTimes(start, end, 30, events);


//function starts here

function findAvailableTimes(start, end, duration, events) {
    // Converts start and end times to moment objects
    start = moment(start);
    end = moment(end);
  
    // To calculate the minimum duration between events and the desired duration
    const minDuration = moment.duration(duration, 'minutes');
    const minDurationMs = minDuration.asMilliseconds();
  
    // Sort the events by start time
    events.sort((a, b) => moment(a.start).diff(moment(b.start)));
  
    // Initializing available times array with the start and end times
    const availableTimes = [{ start, end }];
  
    // Loops through the events and split any available times that overlap with the event
    for (const event of events) {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);
  
      for (let i = 0; i < availableTimes.length; i++) {
        const { start, end } = availableTimes[i];
  
        // If the event overlaps with the available time, split it into two available times
        if (eventStart < end && start < eventEnd) {
          availableTimes.splice(i, 1);
  
          // If the first available time is long enough, adds it to the available times array
          const firstDuration = moment.duration(eventStart.diff(start));
          const firstDurationMs = firstDuration.asMilliseconds();
          if (firstDurationMs >= minDurationMs) {
            availableTimes.splice(i, 0, { start, end: eventStart });
            i++;
          }
  
          // If the second available time is long enough, adds it to the available times array
          const secondDuration = moment.duration(end.diff(eventEnd));
          const secondDurationMs = secondDuration.asMilliseconds();
          if (secondDurationMs >= minDurationMs) {
            availableTimes.splice(i, 0, { start: eventEnd, end });
            i++;
          }
        }
      }
    }
  
    // Removes any available times that are shorter than the desired duration
    for (let i = availableTimes.length - 1; i >= 0; i--) {
      const { start, end } = availableTimes[i];
      const duration = moment.duration(end.diff(start));
      if (duration.asMilliseconds() < minDurationMs) {
        availableTimes.splice(i, 1);
      }
    }
  
    return availableTimes;
  }