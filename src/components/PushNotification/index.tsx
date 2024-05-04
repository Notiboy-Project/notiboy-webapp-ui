import { useContext, useEffect } from 'react';
import { UserContext } from '../../Context/userContext';
import { envs } from '../../config';
import { getTokenFromStorage } from '../../services/storage.service';
import { REFRESH_NOTIFICATIONS } from '../../services/events.service';

let retry = 0;
let broadcast: BroadcastChannel | null = null;

export default function PushNotificationService() {
  const { user } = useContext(UserContext);

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'granted') {
      return;
    }

    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if (permission !== 'granted') {
      console.error('Permission not granted for Notification');
      //TODO: can show toast message as well here
    }
  };

  const initBroadcast = () => {
    broadcast = new BroadcastChannel('refresh-notifications');
  };

  const handleWebsocketConnection = () => {
    const token = getTokenFromStorage();

    if (!token) {
      return null;
    }

    if (retry >= 35) {
      console.log(
        'Websocket connection reached to the maximum connection number::'
      );
      return;
    }

    console.log('Current retry count: ' + retry);

    const socket = new WebSocket(
      `${envs.websocketUrl}?chain=${user?.chain}&address=${user?.address}&token=${token}`
    );
    retry++;

    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = onClose;

    socket.addEventListener('open', function (event) {
      console.log('WebSocket connection established.');
    });

    if ('Notification' in window && Notification.permission !== 'granted') {
      requestNotificationPermission();
    }

    return socket;
  };

  const onMessage = (event: any) => {
    const data = JSON.parse(event.data);
    // publish(REFRESH_NOTIFICATIONS, {});
    console.log('Received message: ' + data);
    const nf = new Notification('Notiboy', {
      body: data?.message || '',
      icon: 'notiboy.png'
    });
    if (broadcast) {
      broadcast.postMessage(REFRESH_NOTIFICATIONS);
    }
    console.log({ nf });
    nf.onclick = (event) => {
      console.log('Notification clicked');
    };
  };

  const onError = (event: any) => {
    console.log('WebSocket connection failed.==>>', event);
  };

  const onClose = (event: any) => {
    console.log('WebSocket connection closed. ==>', event);
    setTimeout(handleWebsocketConnection, 1500);
  };

  useEffect(() => {
    console.log('Calling push useEffect::');
    const socket = handleWebsocketConnection();
    initBroadcast();
    // registerNotificationServiceWorker();
    return () => {
      if (socket?.close) {
        console.log('Closing current socket connection::');
        socket.close();
      }
      if (broadcast?.close) {
        console.log('Closing Broadcast channel::`refresh-notifications`');
        broadcast.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
