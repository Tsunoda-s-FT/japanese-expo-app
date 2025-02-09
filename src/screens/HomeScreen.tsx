import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getAllLessons } from '../services/contentService';
import { Lesson } from '../types/contentTypes';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { translations } = useLanguage();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAllLessons();
      setLessons(data);
      setLoading(false);
    })();
  }, []);

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate('LessonDetail', { lessonId });
  };

  const handleRandomQuizPress = () => {
    navigation.navigate('Quiz', { lessonId: undefined });
  };

  if (loading || !lessons) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{translations.appTitle}</Title>
      
      {/* Language Selector */}
      <Card style={styles.card}>
        <Card.Content>
          <LanguageSelector />
        </Card.Content>
      </Card>

      {/* Quick Menu Section */}
      <Title style={styles.sectionTitle}>{translations.quickMenu}</Title>
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title={translations.speedQuiz}
            description={translations.randomQuizDescription}
            left={(props) => <List.Icon {...props} icon="rocket-launch" />}
            onPress={handleRandomQuizPress}
          />
        </Card.Content>
      </Card>

      {/* Lessons Section */}
      <Title style={styles.sectionTitle}>{translations.lessons}</Title>
      {lessons.map((lesson) => (
        <Card key={lesson.id} style={styles.card} onPress={() => handleLessonPress(lesson.id)}>
          <Card.Content>
            <Title>{lesson.title}</Title>
            <Paragraph>{lesson.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
});

export default HomeScreen;
