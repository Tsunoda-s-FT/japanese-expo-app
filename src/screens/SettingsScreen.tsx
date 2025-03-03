import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, List, Switch, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import AppHeader from '../components/AppHeader';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { language, t } = useLanguage();
  const { settings, updateSettings } = useSettings();

  const toggleSoundEnabled = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const toggleNotificationsEnabled = () => {
    updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const toggleAutoPlayAudio = () => {
    updateSettings({ autoPlayAudio: !settings.autoPlayAudio });
  };

  const toggleFuriganaEnabled = () => {
    updateSettings({ furiganaEnabled: !settings.furiganaEnabled });
  };

  const handleLanguageSettings = () => {
    navigation.navigate('LanguageSettings' as never);
  };

  const settingsTitle = language === 'ja' ? '設定' : 'Settings';
  const appearanceText = language === 'ja' ? '表示' : 'Appearance';
  const soundText = language === 'ja' ? '音声' : 'Sound';
  const notificationsText = language === 'ja' ? '通知' : 'Notifications';
  const aboutText = language === 'ja' ? 'アプリについて' : 'About';
  const languageText = language === 'ja' ? '言語設定' : 'Language Settings';
  const themeText = language === 'ja' ? 'テーマ' : 'Theme';
  const soundEnabledText = language === 'ja' ? '効果音' : 'Sound Effects';
  const autoPlayText = language === 'ja' ? '音声の自動再生' : 'Auto-play Audio';
  const furiganaText = language === 'ja' ? 'ふりがなを表示' : 'Show Furigana';
  const notificationsEnabledText = language === 'ja' ? '通知を受け取る' : 'Receive Notifications';
  const versionText = language === 'ja' ? 'バージョン' : 'Version';
  const termsText = language === 'ja' ? '利用規約' : 'Terms of Service';
  const privacyText = language === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy';

  return (
    <View style={styles.container}>
      <AppHeader 
        title={settingsTitle}
        showBack={true}
        showLanguageSelector={false}
      />
      
      <ScrollView style={styles.scrollView}>
        <List.Section>
          <List.Subheader>{appearanceText}</List.Subheader>
          
          <List.Item
            title={languageText}
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />}
            onPress={handleLanguageSettings}
            style={styles.listItem}
          />
          
          <List.Item
            title={themeText}
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => (
              <View style={styles.themeSelector}>
                <TouchableOpacity 
                  style={[styles.themeOption, settings.theme === 'light' ? styles.selectedTheme : {}]}
                  onPress={() => updateSettings({ theme: 'light' })}
                >
                  <Text>☀️</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.themeOption, settings.theme === 'dark' ? styles.selectedTheme : {}]}
                  onPress={() => updateSettings({ theme: 'dark' })}
                >
                  <Text>🌙</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.themeOption, settings.theme === 'system' ? styles.selectedTheme : {}]}
                  onPress={() => updateSettings({ theme: 'system' })}
                >
                  <Text>⚙️</Text>
                </TouchableOpacity>
              </View>
            )}
            style={styles.listItem}
          />
          
          <List.Item
            title={furiganaText}
            left={props => <List.Icon {...props} icon="alphabetical" />}
            right={props => <Switch value={settings.furiganaEnabled} onValueChange={toggleFuriganaEnabled} />}
            style={styles.listItem}
          />
        </List.Section>
        
        <Divider />
        
        <List.Section>
          <List.Subheader>{soundText}</List.Subheader>
          
          <List.Item
            title={soundEnabledText}
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={props => <Switch value={settings.soundEnabled} onValueChange={toggleSoundEnabled} />}
            style={styles.listItem}
          />
          
          <List.Item
            title={autoPlayText}
            left={props => <List.Icon {...props} icon="play-circle" />}
            right={props => <Switch value={settings.autoPlayAudio} onValueChange={toggleAutoPlayAudio} />}
            style={styles.listItem}
          />
        </List.Section>
        
        <Divider />
        
        <List.Section>
          <List.Subheader>{notificationsText}</List.Subheader>
          
          <List.Item
            title={notificationsEnabledText}
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <Switch value={settings.notificationsEnabled} onValueChange={toggleNotificationsEnabled} />}
            style={styles.listItem}
          />
        </List.Section>
        
        <Divider />
        
        <List.Section>
          <List.Subheader>{aboutText}</List.Subheader>
          
          <List.Item
            title={versionText}
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
            style={styles.listItem}
          />
          
          <List.Item
            title={termsText}
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />}
            style={styles.listItem}
          />
          
          <List.Item
            title={privacyText}
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />}
            style={styles.listItem}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  listItem: {
    paddingVertical: 8,
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeOption: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 2,
    backgroundColor: colors.background,
  },
  selectedTheme: {
    backgroundColor: colors.primary + '30',
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default SettingsScreen; 