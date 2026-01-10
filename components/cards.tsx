import React from 'react';
import { Image } from 'expo-image';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

type CardProps = PressableProps & {
  title: string;
  subtitle?: string;
  image?: string | null;
  rightSlot?: React.ReactNode;
  titleRightSlot?: React.ReactNode;
};

export function Card({ title, subtitle, image, rightSlot, titleRightSlot, ...pressableProps }: CardProps) {
  return (
    <Pressable style={styles.card} {...pressableProps}>
      {image ? (
        <Image source={image} style={styles.avatar} contentFit="cover" transition={150} />
      ) : null}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {titleRightSlot ? <View style={styles.titleRight}>{titleRightSlot}</View> : null}
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
    </Pressable>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleRight: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  rightSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
});
