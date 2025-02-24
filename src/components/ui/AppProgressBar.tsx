import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { colors, spacing } from '../../theme/theme';

interface AppProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  color?: string;
  height?: number;
  label?: string;
}

const AppProgressBar: React.FC<AppProgressBarProps> = ({
  progress,
  showPercentage = false,
  color = colors.primary,
  height = 6,
  label,
}) => {
  // 0から1の範囲に正規化
  const normalizedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(normalizedProgress * 100);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={normalizedProgress}
          color={color}
          style={[styles.progressBar, { height }]}
        />
        {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    borderRadius: 3,
  },
  percentage: {
    marginLeft: spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
});

export default AppProgressBar; 