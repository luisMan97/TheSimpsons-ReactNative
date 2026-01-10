import { Redirect } from 'expo-router';

import { useSession } from '@/core/session/SessionProvider';

export default function Index() {
  const { userId } = useSession();
  return <Redirect href={userId ? '/characters' : '/login'} />;
}
