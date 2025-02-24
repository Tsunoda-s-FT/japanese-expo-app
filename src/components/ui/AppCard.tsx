import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';

interface AppCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const AppCard: React.FC<AppCardProps> = ({
  title,
  subtitle,
  children,
  style,
  onPress
}) => {
  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      {(title || subtitle) && (
        <Card.Title
          title={title}
          subtitle={subtitle}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
      )}
      <Card.Content>{children}</Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  title: {
    fontSize: 18,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default AppCard; 