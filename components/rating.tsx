import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export function RatingInput({ value, onChange }: RatingInputProps) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);
  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} style={styles.star}>
          <Text style={[styles.starText, value >= star ? styles.starActive : null]}>*</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function RatingDisplay({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);
  return (
    <View style={styles.display}>
      {stars.map((star) => (
        <Text key={star} style={[styles.starText, value >= star ? styles.starActive : styles.starInactive]}>
          *
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
  },
  display: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    padding: 4,
  },
  starText: {
    fontSize: 20,
    color: '#ccc',
  },
  starActive: {
    color: '#f0c808',
  },
  starInactive: {
    color: '#ddd',
  },
});
