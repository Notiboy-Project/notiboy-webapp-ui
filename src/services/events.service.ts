function subscribe(eventName: string, listener: (data?: any) => void) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: (data?: any) => void) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: string, data?: any) {
  const event = new CustomEvent(eventName, data);
  document.dispatchEvent(event);
}

export const REFRESH_NOTIFICATIONS = 'REFRESH_NOTIFICATIONS';

export { subscribe, unsubscribe, publish };
