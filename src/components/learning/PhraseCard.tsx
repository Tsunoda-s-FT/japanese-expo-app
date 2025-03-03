import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Phrase, ExampleSentence } from '../../types/contentTypes';
import { playAudio } from '../../utils/audio';
import { colors, spacing, borderRadius } from '../../theme/theme';

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
      elevation={2}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.japanese}>{phrase.jpText}</Text>
          {phrase.audio && (
            <Button 
              icon="volume-high" 
              mode="text" 
              onPress={handlePlayAudio}
              style={styles.audioButton}
            >
              {''}
            </Button>
          )}
        </View>
        
        <Text style={styles.reading}>{phrase.reading}</Text>
        
        <View style={styles.translationContainer}>
          <Text style={styles.translation}>{phrase.translations.en}</Text>
        </View>
        
        {phrase.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>メモ:</Text>
            <Text style={styles.notes}>{phrase.notes}</Text>
          </View>
        )}
        
        {phrase.exampleSentences && phrase.exampleSentences.length > 0 && (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesLabel}>例文:</Text>
            {phrase.exampleSentences.map((example: ExampleSentence, index: number) => (
              <View key={index} style={styles.exampleItem}>
                <Text style={styles.exampleJapanese}>{example.jpText}</Text>
                <Text style={styles.exampleReading}>{example.reading}</Text>
                <Text style={styles.exampleTranslation}>{example.translations.en}</Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  japanese: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  audioButton: {
    marginLeft: spacing.sm,
  },
  reading: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  translationContainer: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  translation: {
    fontSize: 16,
    color: colors.text,
  },
  notesContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: '#FFF9C4', // 薄い黄色
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  notesLabel: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  notes: {
    color: colors.text,
  },
  examplesContainer: {
    marginTop: spacing.sm,
  },
  examplesLabel: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  exampleItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  exampleJapanese: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  exampleReading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  exampleTranslation: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
});

export default PhraseCard; 