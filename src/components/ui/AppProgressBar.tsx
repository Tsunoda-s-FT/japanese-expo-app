import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
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
  height = 8,
  label,
}) => {
  // 0から1の範囲に正規化
  const normalizedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(normalizedProgress * 100);
  
  // 進捗に応じて色を変化させる
  const dynamicColor = useMemo(() => {
    if (percentage >= 100) return colors.success;
    if (percentage >= 75) return colors.accent;
    if (percentage >= 50) return colors.primary;
    if (percentage >= 25) return colors.info;
    return colors.primaryLight;
  }, [percentage]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: `${percentage}%`, 
                backgroundColor: color || dynamicColor,
                height 
              }
            ]} 
          />
        </View>
        {showPercentage && (
          <Text style={styles.percentage}>{percentage}%</Text>
        )}
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
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
    height: '100%',
  },
  percentage: {
    marginLeft: spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
    fontWeight: '600',
  },
});

export default AppProgressBar; 