import notifee, {AndroidImportance} from '@notifee/react-native';
import type {DisplayNotifeeProps} from './notification.types.ts';

export const displayNotifee = async (
  title: DisplayNotifeeProps['title'],
  body: DisplayNotifeeProps['body'],
) => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    id: '123',
    title: title,
    body: body,
    android: {
      channelId,
      asForegroundService: true, // registerForegroundService에서 등록한 runner에 bound됨
      pressAction: {
        id: 'default',
      },
    },
  });
};
