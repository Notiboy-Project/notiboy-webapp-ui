/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-restricted-globals
const data = new URL(location).searchParams.get('data');

const config = JSON.parse(data) || null;

self.addEventListener('activate', async () => {
  // This will be called only once when the service worker is activated.
  console.log('service worker activate');
  try {
    // handle websocket connectino over here.

    if (!config?.accessToken) {
      console.error(
        `invalid "accessToken" passed to service worker: [service-nf.js]`
      );
      return null;
    }

    const websocketUrl = `${config.socketUrl}?chain=${config?.chain}&address=${config?.address}&token=${config.accessToken}`;
    const socket = new WebSocket(websocketUrl);

    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = onClose;

    socket.addEventListener('open', function (event) {
      console.log('WebSocket connection established.');
    });
  } catch (serviceWorkerError) {
    console.log('Occured exception during service worker:', serviceWorkerError);
  }
});

function onMessage(event) {
  const data = JSON.parse(event.data);
  // publish(REFRESH_NOTIFICATIONS, {});
  console.log('Received message: ' + data);
  dispalyNotification(data);
}

function onError(event) {
  console.log('WebSocket connection failed.==>>', event);
}

function onClose(event) {
  console.log('WebSocket connection closed. ==>', event);
}

function dispalyNotification(data) {
  // TODO: show notification using registration
  self.registration.showNotification('Notiboy', {
    body: data?.message,
    icon: 'notiboy.png',
    data: { url: `${self.location.origin}/notifications` }
  });
}

self.addEventListener('notificationclick', (e) => {
  // Close the notification popout
  e.notification.close();
  console.log('Notification clicked')
  // Get all the Window clients
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === e.notification.data.url
          ? (windowClient.focus(), true)
          : false
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        clients
          .openWindow(e.notification.data.url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});
