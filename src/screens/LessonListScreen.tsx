import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Lesson } from '../types/contentTypes';
import { getAllLessons } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import AppCard from '../components/ui/AppCard';
import AppLoading from '../components/ui/AppLoading';
import { colors, spacing } from '../theme/theme';
import { commonStyles } from '../theme/styles';

// 画像のマッピング
const lessonImages: { [key: string]: any } = {
  'ojigi_aisatsu_business_woman.png': require('../../assets/images/lessons/ojigi_aisatsu_business_woman.png'),
  // 他の画像もここに追加
};

// 画像のパスから画像ソースを取得する関数
const getImageSource = (path: string) => {
  // パスからファイル名を抽出
  const fileName = path.split('/').pop();
  if (fileName && lessonImages[fileName]) {
    return lessonImages[fileName];
  }
  // 該当する画像が見つからない場合はデフォルト画像を返すか、nullを返す
  return null;
};

type LessonListNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LessonList'>;

const LessonListScreen: React.FC = () => {
  const navigation = useNavigation<LessonListNavigationProp>();
  const { translations } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllLessons();
        setLessons(data);
      } catch (error) {
        console.error('Error loading lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate('LessonDetail', { lessonId });
  };

  if (loading) {
    return <AppLoading message="レッスンを読み込み中..." />;
  }

  if (!lessons || lessons.length === 0) {
    return (
      <View style={commonStyles.centeredContent}>
        <Text>レッスンが見つかりません。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Title style={styles.header}>レッスン一覧</Title>

      {lessons.map((lesson) => (
        <AppCard
          key={lesson.id}
          onPress={() => handleLessonPress(lesson.id)}
        >
          {lesson.thumbnail && (
            <Image
              source={getImageSource(lesson.thumbnail) || { uri: 'https://placehold.co/600x400/png' }}
              style={styles.thumbnail}
            />
          )}
          <View style={styles.cardContent}>
            <Text style={styles.title}>{lesson.title}</Text>
            <Text style={styles.description}>{lesson.description}</Text>
            <Text style={styles.meta}>
              所要時間: {lesson.totalEstimatedTime} • コース数: {lesson.courses.length}
            </Text>
          </View>
        </AppCard>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.text,
    textAlign: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
    marginBottom: spacing.sm,
  },
  cardContent: {
    padding: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default LessonListScreen;
