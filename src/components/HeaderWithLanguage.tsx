import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LanguageSelector } from './LanguageSelector';
import { colors, spacing, shadows } from '../theme/theme';

interface HeaderWithLanguageProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const HeaderWithLanguage: React.FC<HeaderWithLanguageProps> = ({
  title,
  showBackButton = false,
  rightComponent,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="戻る"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
        <LanguageSelector showLabel={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HeaderWithLanguage; 