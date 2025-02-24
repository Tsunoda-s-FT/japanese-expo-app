import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: any;
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
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getStyleByVariant(variant),
        disabled && styles.disabled,
        style
      ]}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: false }}
      accessibilityHint={`${label}ボタンをタップします`}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor(variant)} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && (
            <Icon 
              name={icon} 
              size={18} 
              color={getTextColor(variant)} 
              style={styles.icon} 
            />
          )}
          <Text style={[
            styles.label,
            { color: getTextColor(variant) }
          ]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// バリアントに応じたスタイルを取得する関数
const getStyleByVariant = (variant: ButtonVariant) => {
  switch(variant) {
    case 'primary':
      return {
        backgroundColor: colors.primary,
      };
    case 'secondary':
      return {
        backgroundColor: colors.accent,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      };
    case 'text':
      return {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
      };
    default:
      return {};
  }
};

// テキスト色を取得する関数
const getTextColor = (variant: ButtonVariant) => {
  switch(variant) {
    case 'primary':
    case 'secondary':
      return colors.textLight;
    case 'outline':
      return colors.primary;
    case 'text':
      return colors.primary;
    default:
      return colors.text;
  }
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
    elevation: 0,
  },
});

export default AppButton; 