import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, translations } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translations.selectLanguage}</Text>
      <View style={styles.buttonContainer}>
        <Button
          mode={language === 'ja' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('ja')}
          style={styles.button}
        >
          {translations.japanese}
        </Button>
        <Button
          mode={language === 'en' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('en')}
          style={styles.button}
        >
          {translations.english}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    marginHorizontal: 8,
  },
});
