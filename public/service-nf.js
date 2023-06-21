/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-restricted-globals
const data = new URL(location).searchParams.get('data');

const config = JSON.parse(data) || null;

const broadcast = new BroadcastChannel('refresh-notifications');

let socket;

broadcast.onmessage = (event) => {
  console.log("ServiceWorker:: Recieved message from broadcast::", event.data)
};


self.addEventListener('install', (event) => {
  console.log('Service worker installed::');
  self.skipWaiting();
});

function connectSocket() {
  const websocketUrl = `${config.socketUrl}?chain=${config?.chain}&address=${config?.address}&token=${config.accessToken}`;
  socket = new WebSocket(websocketUrl);

  socket.onmessage = onMessage;
  socket.onerror = onError;
  socket.onclose = onClose;

  socket.addEventListener('open', function (event) {
    console.log('WebSocket connection established.');
  });
}

self.addEventListener('activate', async () => {
  // This will be called only once when the service worker is activated.
  console.log('service worker activated:');
  try {
    // handle websocket connectino over here.

    if (!config?.accessToken) {
      console.error(
        `invalid "accessToken" passed to service worker: [service-nf.js]`
      );
      return null;
    }
    connectSocket();
  } catch (serviceWorkerError) {
    console.log('Occured exception during service worker:', serviceWorkerError);
  }
});

function onMessage(event) {
  const data = JSON.parse(event.data);
  // publish(REFRESH_NOTIFICATIONS, {});
  console.log('Received message: ', data?.channel_name || 'N/A');
  dispalyNotification(data);
  broadcast.postMessage({ shouldRefreshNotifications: true });  
}

function onError(event) {
  console.log('WebSocket connection failed.==>>', event);
  socket?.close()
}

function onClose(event) {
  console.log('WebSocket connection closed. ==>', event);
  setTimeout(() => {
    connectSocket();
  }, 1000);
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
  console.log('Notification clicked');
  // Get all the Window clients
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) => {
        if (windowClient.url === e.notification.data.url) {                    
          windowClient.focus();
          return true;
        }
        return false;
      });
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        clients
          .openWindow(e.notification.data.url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});
