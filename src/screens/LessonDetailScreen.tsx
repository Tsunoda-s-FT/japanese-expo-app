import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, ProgressBar } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Lesson } from '../types/contentTypes';
import { getLessonById } from '../services/contentService';
import { getLessonProgressRatio } from '../services/progressService';

type LessonDetailRouteProp = RouteProp<RootStackParamList, 'LessonDetail'>;
type LessonDetailNavProp = NativeStackNavigationProp<RootStackParamList, 'LessonDetail'>;

const LessonDetailScreen: React.FC = () => {
  const route = useRoute<LessonDetailRouteProp>();
  const navigation = useNavigation<LessonDetailNavProp>();
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getLessonById(lessonId);
      setLesson(data);
    })();
  }, [lessonId]);

  if (!lesson) {
    return <Text style={{ margin: 16 }}>レッスン情報を読み込み中...</Text>;
  }

  const progress = getLessonProgressRatio(lesson);

  const handlePhrasePress = (phraseId: string) => {
    navigation.navigate('PhraseLearning', { lessonId: lesson.id, phraseId });
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>{lesson.title}</Text>
      <Text style={styles.description}>{lesson.description}</Text>
      <ProgressBar progress={progress} style={styles.progressBar} />
      <Text style={styles.progressText}>
        学習進捗: {(progress * 100).toFixed(0)}%
      </Text>

      <List.Section title="フレーズ一覧">
        {lesson.phrases.map((phrase) => (
          <List.Item
            key={phrase.id}
            title={phrase.jpText}
            description={phrase.translations.en}
            onPress={() => handlePhrasePress(phrase.id)}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 8 },
  description: { marginBottom: 8, color: '#666' },
  progressBar: { marginBottom: 8, height: 8 },
  progressText: { marginBottom: 16 }
});

export default LessonDetailScreen;
