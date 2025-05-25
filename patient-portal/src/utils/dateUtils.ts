export const formatDeliveryTime = (dateString: string): string => {
  const deliveryDate = new Date(dateString);
  const now = new Date();
  const isToday = deliveryDate.toDateString() === now.toDateString();
  const isTomorrow = deliveryDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  let dayText = '';
  if (isToday) {
    dayText = 'Today';
  } else if (isTomorrow) {
    dayText = 'Tomorrow';
  } else {
    dayText = deliveryDate.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: deliveryDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
  
  const timeText = deliveryDate.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return `${dayText} at ${timeText}`;
};

export const formatFullDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};