import React from 'react';
import { StyleSheet, View } from 'react-native';

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: rows }).map((_, index) => (
        <View key={`skeleton-${index}`} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.lines}>
            <View style={styles.lineShort} />
            <View style={styles.lineLong} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e3e3e3',
  },
  lines: {
    flex: 1,
    gap: 8,
  },
  lineShort: {
    height: 12,
    width: '40%',
    backgroundColor: '#e3e3e3',
    borderRadius: 6,
  },
  lineLong: {
    height: 12,
    width: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
});
