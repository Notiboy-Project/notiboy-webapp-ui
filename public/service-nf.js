// eslint-disable-next-line no-restricted-globals
const data = new URL(location).searchParams.get('data');

const config = JSON.parse(data) || null;

// eslint-disable-next-line no-restricted-globals
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
  const nf = new Notification('Notiboy', { body: data?.message || '' });
  console.log({ nf });
}

function onError(event) {
  console.log('WebSocket connection failed.==>>', event);
}

function onClose(event) {
  console.log('WebSocket connection closed. ==>', event);  
}
