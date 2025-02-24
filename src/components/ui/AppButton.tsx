import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { colors, borderRadius } from '../../theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
}) => {
  // ボタンの種類に応じたモードを決定
  const getMode = (): 'contained' | 'outlined' | 'text' => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return 'contained';
      case 'outline':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  // ボタンの色を決定
  const getColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.accent;
      default:
        return undefined;
    }
  };

  return (
    <Button
      mode={getMode()}
      onPress={onPress}
      icon={icon}
      disabled={disabled}
      loading={loading}
      color={getColor()}
      style={[styles.button, style]}
      labelStyle={styles.label}
    >
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AppButton; 