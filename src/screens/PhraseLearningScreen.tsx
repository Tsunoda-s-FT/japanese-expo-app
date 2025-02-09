import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getLessonById } from '../services/contentService';
import { Lesson, Phrase } from '../types/contentTypes';
import { recordAndEvaluatePhrase } from '../services/speechService';
import { markPhraseAsLearned } from '../services/progressService';
import PhraseCard from '../components/PhraseCard';

type PhraseLearningRouteProp = RouteProp<RootStackParamList, 'PhraseLearning'>;

const PhraseLearningScreen: React.FC = () => {
  const route = useRoute<PhraseLearningRouteProp>();
  const { lessonId, phraseId } = route.params;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getLessonById(lessonId);
      setLesson(data);
      if (data && phraseId) {
        const found = data.phrases.find((p) => p.id === phraseId);
        setSelectedPhrase(found || null);
      }
      setLoading(false);
    })();
  }, [lessonId, phraseId]);

  const handleRecord = async () => {
    if (!selectedPhrase) return;
    setRecording(true);
    setEvaluationResult(null);

    const { score, feedback } = await recordAndEvaluatePhrase(selectedPhrase.id);
    setRecording(false);
    setEvaluationResult({ score, feedback });
    if (score >= 80) {
      markPhraseAsLearned(selectedPhrase.id);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!lesson || !selectedPhrase) {
    return <Text style={{ margin: 16 }}>フレーズが見つかりません</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <PhraseCard phrase={selectedPhrase} />
      <View style={styles.recordContainer}>
        {recording ? (
          <Text>録音中... (モック)</Text>
        ) : (
          <Button mode="contained" onPress={handleRecord}>
            録音して評価
          </Button>
        )}
      </View>
      {evaluationResult && (
        <View style={styles.resultContainer}>
          <Text variant="titleMedium">
            スコア: {evaluationResult.score} / 100
          </Text>
          <Text>{evaluationResult.feedback}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  recordContainer: {
    marginTop: 16,
    alignItems: 'center'
  },
  resultContainer: {
    marginTop: 16,
    backgroundColor: '#f0f0f0',
    padding: 12
  }
});

export default PhraseLearningScreen;
