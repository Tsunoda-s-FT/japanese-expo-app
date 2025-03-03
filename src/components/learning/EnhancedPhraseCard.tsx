import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Button, IconButton as PaperIconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Phrase, ExampleSentence, PhraseVariation } from '../../types/contentTypes';
import { playAudio } from '../../utils/audio';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../i18n/i18n';
import { getLocalizedTagText } from '../../utils/localization';
import SegmentedText from '../learning/SegmentedText';

interface EnhancedPhraseCardProps {
  phrase: Phrase;
  lessonId: string;
}

const EnhancedPhraseCard: React.FC<EnhancedPhraseCardProps> = ({ phrase, lessonId }) => {
  // 表示/非表示の状態管理
  const [showDescription, setShowDescription] = useState(true);
  const [showUsageContext, setShowUsageContext] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  
  const { language, t } = useLanguage();

  // 音声再生ハンドラー
  const handlePlayAudio = () => {
    if (phrase.audio) {
      playAudio(phrase.audio);
    }
  };

  // 例文の音声再生ハンドラー
  const handlePlayExampleAudio = (audioPath: string) => {
    if (audioPath) {
      playAudio(audioPath);
    }
  };

  // 丁寧さレベルのローカライズされたラベルを取得
  const politenessLabel = phrase.politenessLevel 
    ? getLocalizedTagText('politenessLevel', phrase.politenessLevel, language)
    : '';

  // 学習レベルのローカライズされたラベルを取得
  const learningLevelLabel = phrase.learningLevel
    ? getLocalizedTagText('learningLevel', phrase.learningLevel, language)
    : '';

  // 丁寧さレベルに応じた色を取得
  const getPolitenessColor = (level: string): string => {
    switch(level) {
      case 'casual': return '#8BC34A'; // 薄い緑
      case 'polite': return '#2196F3'; // 青
      case 'honorific': return '#9C27B0'; // 紫
      case 'humble': return '#FF9800'; // オレンジ
      default: return '#757575'; // グレー
    }
  };

  // 学習レベルに応じた色を取得
  const getLearningLevelColor = (level: string): string => {
    switch(level) {
      case 'essential': return '#00BCD4'; // シアン
      case 'common': return '#FF9800';    // オレンジ
      case 'advanced': return '#F44336';  // 赤
      default: return '#757575';          // グレー
    }
  };

  // トランスレーションの取得 (指定言語またはフォールバック)
  const getTranslation = (translations: Record<string, string | undefined>, lang: LanguageCode): string => {
    return translations[lang] || translations.en || '';
  };

  // ローカライズされたテキストの取得 (指定言語またはフォールバック)
  const getLocalizedText = (localizedText: Record<string, string | undefined> | undefined, lang: LanguageCode): string => {
    if (!localizedText) return '';
    return localizedText[lang] || localizedText.ja || '';
  };

  // 実際の例文リスト（旧形式と新形式の両方に対応）
  const examples = phrase.examples || phrase.exampleSentences || [];

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* フレーズヘッダー - 日本語テキストと音声ボタン */}
        <View style={styles.header}>
          <View style={styles.textContainer}>
            {phrase.segments && phrase.segments.length > 0 ? (
              <SegmentedText 
                segments={phrase.segments} 
                style={styles.segmentedText}
              />
            ) : (
              <Text style={styles.japanese}>{phrase.jpText}</Text>
            )}
            <Text style={styles.reading}>{phrase.reading}</Text>
          </View>
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
        
        {/* レベルバッジ */}
        <View style={styles.badgeContainer}>
          {phrase.politenessLevel && (
            <View style={[
              styles.badge, 
              { backgroundColor: getPolitenessColor(phrase.politenessLevel) }
            ]}>
              <Text style={styles.badgeText}>{politenessLabel}</Text>
            </View>
          )}
          
          {phrase.learningLevel && (
            <View style={[
              styles.badge, 
              { backgroundColor: getLearningLevelColor(phrase.learningLevel) }
            ]}>
              <Text style={styles.badgeText}>{learningLevelLabel}</Text>
            </View>
          )}
        </View>
        
        {/* 翻訳 */}
        <View style={styles.translationContainer}>
          <Text style={styles.translation}>
            {getTranslation(phrase.translations, language)}
          </Text>
        </View>
        
        {/* 説明（存在する場合）- デフォルトで表示し、タップで非表示切替 */}
        {phrase.description && (
          <TouchableOpacity 
            style={styles.sectionContainer}
            onPress={() => setShowDescription(!showDescription)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('description', language === 'en' ? 'Description' : '説明')}</Text>
              <MaterialCommunityIcons
                name={showDescription ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.primary}
              />
            </View>
            
            {showDescription && (
              <Text style={styles.sectionContent}>
                {getLocalizedText(phrase.description, language)}
              </Text>
            )}
          </TouchableOpacity>
        )}
        
        {/* 使用コンテキスト（存在する場合）- タップで表示切替 */}
        {phrase.usageContext && (
          <TouchableOpacity 
            style={styles.sectionContainer}
            onPress={() => setShowUsageContext(!showUsageContext)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('usage', language === 'en' ? 'Usage Context' : '使用場面')}</Text>
              <MaterialCommunityIcons
                name={showUsageContext ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.primary}
              />
            </View>
            
            {showUsageContext && (
              <Text style={styles.sectionContent}>
                {getLocalizedText(phrase.usageContext, language)}
              </Text>
            )}
          </TouchableOpacity>
        )}
        
        {/* 例文（存在する場合）- タップで表示切替 */}
        {examples.length > 0 && (
          <TouchableOpacity 
            style={styles.sectionContainer}
            onPress={() => setShowExamples(!showExamples)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('examples', language === 'en' ? 'Examples' : '例文')}</Text>
              <MaterialCommunityIcons
                name={showExamples ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.primary}
              />
            </View>
            
            {showExamples && (
              <View style={styles.examplesContainer}>
                {examples.map((example: ExampleSentence, index: number) => (
                  <View key={index} style={styles.exampleItem}>
                    <View style={styles.exampleHeader}>
                      <View style={styles.exampleTextContainer}>
                        <Text style={styles.exampleJapanese}>{example.jpText}</Text>
                        {example.reading && (
                          <Text style={styles.exampleReading}>{example.reading}</Text>
                        )}
                      </View>
                      {(example.audio || example.audioPath) && (
                        <PaperIconButton
                          icon="volume-high"
                          size={20}
                          iconColor={colors.primary}
                          onPress={() => handlePlayExampleAudio(example.audioPath 
                            ? `assets/contents/${lessonId}/${example.audioPath}` 
                            : example.audio || '')}
                        />
                      )}
                    </View>
                    <Text style={styles.exampleTranslation}>
                      {getTranslation(example.translations, language)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}
        
        {/* バリエーション（存在する場合）- タップで表示切替 */}
        {phrase.variations && phrase.variations.length > 0 && (
          <TouchableOpacity 
            style={styles.sectionContainer}
            onPress={() => setShowVariations(!showVariations)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('variations', language === 'en' ? 'Variations' : 'バリエーション')}</Text>
              <MaterialCommunityIcons
                name={showVariations ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.primary}
              />
            </View>
            
            {showVariations && (
              <View style={styles.variationsContainer}>
                {phrase.variations.map((variation: PhraseVariation, index: number) => (
                  <View key={index} style={styles.variationItem}>
                    <View style={styles.variationHeader}>
                      <Text style={styles.variationJapanese}>{variation.jpText}</Text>
                      {variation.audioPath && (
                        <PaperIconButton
                          icon="volume-high"
                          size={20}
                          iconColor={colors.primary}
                          onPress={() => playAudio(`assets/contents/${lessonId}/${variation.audioPath}`)}
                        />
                      )}
                    </View>
                    {variation.reading && (
                      <Text style={styles.variationReading}>{variation.reading}</Text>
                    )}
                    <View style={styles.variationBadgeContainer}>
                      {variation.politenessLevel && (
                        <View style={[
                          styles.smallBadge,
                          { backgroundColor: getPolitenessColor(variation.politenessLevel) }
                        ]}>
                          <Text style={styles.smallBadgeText}>
                            {getLocalizedTagText('politenessLevel', variation.politenessLevel, language)}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.variationTranslation}>
                      {getTranslation(variation.translations, language)}
                    </Text>
                    {variation.description && (
                      <Text style={styles.variationDescription}>
                        {getLocalizedText(variation.description, language)}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
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
    ...shadows.medium,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  segmentedText: {
    marginBottom: spacing.xs,
  },
  japanese: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  reading: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 2,
  },
  audioButton: {
    marginLeft: spacing.sm,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  sectionContainer: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  sectionLabel: {
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionContent: {
    padding: spacing.sm,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  examplesContainer: {
    padding: spacing.sm,
  },
  exampleItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exampleTextContainer: {
    flex: 1,
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
  variationsContainer: {
    padding: spacing.sm,
  },
  variationsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  variationItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
  },
  variationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  variationJapanese: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  variationReading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  variationBadgeContainer: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: spacing.sm,
  },
  smallBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  variationTranslation: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  variationDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default EnhancedPhraseCard;