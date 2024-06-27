import React from 'react';

const SessionTimeoutToast = ({ minutesLeft }) => (
  <div>
    ⚠️ Session will time out in {minutesLeft} {minutesLeft === 1 ? 'minute' : 'minutes'}
  </div>
);

export default SessionTimeoutToast;
