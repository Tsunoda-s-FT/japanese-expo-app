import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Phrase } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';

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
    <Card style={styles.card}>
      <Card.Title title={phrase.jpText} subtitle={phrase.reading} />
      <Card.Content>
        <Text style={styles.translation}>{phrase.translations.en}</Text>
        {phrase.exampleSentences && phrase.exampleSentences.length > 0 && (
          <View style={styles.examplesContainer}>
            {phrase.exampleSentences.map((ex, idx) => (
              <View key={idx} style={styles.exampleItem}>
                <Text style={styles.exampleJp}>{ex.jpText}</Text>
                <Text style={styles.exampleReading}>{ex.reading}</Text>
                <Text style={styles.exampleEn}>{ex.translations.en}</Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        <Button icon="volume-high" onPress={handlePlayAudio}>
          音声
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8
  },
  translation: {
    marginBottom: 8,
    color: '#555'
  },
  examplesContainer: {
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    padding: 8
  },
  exampleItem: {
    marginBottom: 6
  },
  exampleJp: {
    fontWeight: '600'
  },
  exampleReading: {
    color: '#777'
  },
  exampleEn: {
    color: '#333'
  }
});

export default PhraseCard;
