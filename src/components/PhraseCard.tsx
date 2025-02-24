import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Phrase } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';
import { colors, spacing, borderRadius } from '../theme/theme';

interface Props {
  phrase: Phrase;
}

const PhraseCard: React.FC<Props> = ({ phrase }) => {
  const handlePlayAudio = () => {
    if (phrase.audio) {
      playAudio(phrase.audio);
    }
  };

  return (
    <Card 
      style={styles.card}
      accessible={true}
      accessibilityLabel={`フレーズ：${phrase.jpText}、読み方：${phrase.reading}、意味：${phrase.translations.en}`}
    >
      <Card.Content style={styles.cardContent}>
        <Text style={styles.mainPhrase}>{phrase.jpText}</Text>
        <Text style={styles.reading}>{phrase.reading}</Text>
        <View style={styles.translationContainer}>
          <Text style={styles.translation}>{phrase.translations.en}</Text>
        </View>
        {phrase.exampleSentences && phrase.exampleSentences.length > 0 && (
          <View 
            style={styles.examplesContainer}
            accessible={true}
            accessibilityLabel="例文"
          >
            {phrase.exampleSentences.map((ex, idx) => (
              <View 
                key={idx} 
                style={styles.exampleItem}
                accessible={true}
                accessibilityLabel={`例文${idx + 1}：${ex.jpText}、読み方：${ex.reading}、意味：${ex.translations.en}`}
              >
                <Text style={styles.exampleJp}>{ex.jpText}</Text>
                <Text style={styles.exampleReading}>{ex.reading}</Text>
                <Text style={styles.exampleEn}>{ex.translations.en}</Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
      <Card.Actions style={styles.buttonsContainer}>
        <Button 
          icon="volume-high" 
          onPress={handlePlayAudio}
          style={styles.button}
          labelStyle={{ color: colors.primary }}
          accessible={true}
          accessibilityLabel="音声を再生"
          accessibilityRole="button"
          accessibilityHint="タップすると発音を聞くことができます"
        >
          音声
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    padding: 16
  },
  mainPhrase: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: colors.text,
  },
  reading: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  translationContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  translation: {
    fontSize: 16,
    color: colors.accent,
    textAlign: 'center',
    fontWeight: '500',
  },
  examplesContainer: {
    marginTop: 16,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  exampleItem: {
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.primaryLight,
    paddingLeft: 8,
  },
  exampleJp: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.text,
  },
  exampleReading: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  exampleEn: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
  }
});

export default PhraseCard;
