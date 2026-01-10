import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { useSession } from '@/core/session/SessionProvider';

function DrawerContent(props: DrawerContentComponentProps) {
  const { logout } = useSession();
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.title}>Springfield</Text>
      </View>
      <DrawerItem label="Personajes" onPress={() => router.replace('/characters')} />
      <DrawerItem label="Episodios" onPress={() => router.replace('/episodes')} />
      <DrawerItem
        label="Salir"
        onPress={() => {
          Alert.alert('Cerrar sesion', 'Seguro que quieres salir?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: logout },
          ]);
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitleStyle: { fontWeight: '600' },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="characters/index" options={{ title: 'Personajes' }} />
      <Drawer.Screen name="episodes/index" options={{ title: 'Episodios' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#666',
  },
});
