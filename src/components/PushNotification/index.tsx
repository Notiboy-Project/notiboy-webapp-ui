import { useContext, useEffect } from 'react';
import { UserContext } from '../../Context/userContext';
import { envs } from '../../config';
import { getTokenFromStorage } from '../../services/storage.service';

export default function PushNotificationService() {
  const { user } = useContext(UserContext);

  const handleWebsocketConnection = () => {
    const socket = new WebSocket(
      `${envs.websocketUrl}?chain=${user?.chain}&address=${
        user?.address
      }&token=${getTokenFromStorage()}`
    );

    socket.addEventListener('open', function (event) {
      console.log('WebSocket connection established.');
    });

    socket.addEventListener('message', function (event) {
      const message = event.data;
      console.log('Received message: ' + message);
      const nf = new Notification('Notiboy', { body: message });
      console.log({ nf });
    });

    socket.addEventListener('close', function (event) {
      console.log('WebSocket connection closed. ==>', event);
      setTimeout(handleWebsocketConnection, 1000);
    });

    socket.addEventListener('error', function (event) {
      console.log('WebSocket connection failed.==>>', event);
    });

    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return socket;
  };

  useEffect(() => {
    const socket: WebSocket = handleWebsocketConnection();

    return () => {
      console.log('socket checking.....', socket);
      if (socket) console.log('socket closing...', socket);
      socket?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p />;
}
