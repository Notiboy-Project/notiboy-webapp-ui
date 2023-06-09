import { useContext, useEffect } from 'react';
import { UserContext } from '../../Context/userContext';
import { envs } from '../../config';
import { getTokenFromStorage } from '../../services/storage.service';

export default function PushNotificationService() {
  const { user } = useContext(UserContext);

  const handleWebsocketConnection = () => {
    const token = getTokenFromStorage();

    if (!token) {
      return;
    }

    const socket = new WebSocket(
      `${envs.websocketUrl}?chain=${user?.chain}&address=${user?.address}&token=${token}`
    );

    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = onClose;

    socket.addEventListener('open', function (event) {
      console.log('WebSocket connection established.');
    });

    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return socket;
  };

  const onMessage = (event: any) => {
    const data = JSON.parse(event.data);
    console.log('Received message: ' + data);
    const nf = new Notification('Notiboy', { body: data?.message || '' });
    console.log({ nf });
  };

  const onError = (event: any) => {
    console.log('WebSocket connection failed.==>>', event);
  };

  const onClose = (event: any) => {
    console.log('WebSocket connection closed. ==>', event);
    setTimeout(handleWebsocketConnection, 3000);
  };

  useEffect(() => {
    const socket = handleWebsocketConnection();

    return () => {
      if (socket) {
        console.log('socket closing...', socket);
        socket?.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p />;
}
