import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, LanguageCode } from '../i18n';
import { colors, spacing, borderRadius } from '../theme/theme';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLanguage = LANGUAGES.find(lang => lang.code === language);

  // モーダル表示の言語選択UIを表示
  const handleShowLanguageModal = () => {
    setModalVisible(true);
  };

  // 言語が選択された時のハンドラー
  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setModalVisible(false);
  };

  // 言語選択ボタンをレンダリング
  const renderLanguageButton = () => (
    <Button
      mode="outlined"
      onPress={handleShowLanguageModal}
      style={styles.languageButton}
      icon={({ size, color }) => <Icon name="translate" size={size} color={color} />}
    >
      {selectedLanguage?.nativeName || language}
    </Button>
  );

  // 各言語項目をレンダリング
  const renderLanguageItem = ({ item }: { item: typeof LANGUAGES[0] }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === language && styles.selectedLanguageItem
      ]}
      onPress={() => handleSelectLanguage(item.code)}
    >
      <View style={styles.languageItemContent}>
        <Text style={styles.nativeName}>{item.nativeName}</Text>
        <Text style={styles.englishName}>{item.name}</Text>
      </View>
      {item.code === language && (
        <Icon name="check" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('selectLanguage')}
      </Text>

      {/* 言語選択ボタン - スマホでは小さなスペースで表示可能 */}
      {renderLanguageButton()}

      {/* 言語選択モーダル */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Divider style={styles.divider} />
            
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              ItemSeparatorComponent={() => <Divider style={styles.itemDivider} />}
              style={styles.languageList}
            />
          </View>
        </View>
      </Modal>

      {/* コンパクトUIのボタン並べも残しておく（タブレットなど大画面に最適化） */}
      <View style={styles.buttonContainer}>
        <Button
          mode={language === 'ja' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('ja')}
          style={styles.button}
          labelStyle={language === 'ja' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="flag" size={size} color={color} />}
        >
          日本語
        </Button>
        <Button
          mode={language === 'en' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('en')}
          style={styles.button}
          labelStyle={language === 'en' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="flag-outline" size={size} color={color} />}
        >
          English
        </Button>
        <Button
          mode={language === 'zh' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('zh')}
          style={styles.button}
          labelStyle={language === 'zh' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="translate" size={size} color={color} />}
        >
          中文
        </Button>
        <Button
          mode={language === 'ko' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('ko')}
          style={styles.button}
          labelStyle={language === 'ko' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="translate" size={size} color={color} />}
        >
          한국어
        </Button>
        <Button
          mode={language === 'es' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('es')}
          style={styles.button}
          labelStyle={language === 'es' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="translate" size={size} color={color} />}
        >
          Español
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    marginBottom: spacing.sm,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    minWidth: 100,
    borderRadius: borderRadius.md,
    margin: spacing.xs,
  },
  activeLabel: {
    fontWeight: 'bold',
  },
  inactiveLabel: {
    fontWeight: 'normal',
  },
  languageButton: {
    alignSelf: 'center',
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  divider: {
    marginVertical: spacing.sm,
  },
  languageList: {
    flexGrow: 0,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  selectedLanguageItem: {
    backgroundColor: colors.surface,
  },
  languageItemContent: {
    flexDirection: 'column',
  },
  nativeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  englishName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemDivider: {
    backgroundColor: colors.border,
    opacity: 0.2,
  },
});
