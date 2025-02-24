import React, { useEffect } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
}

/**
 * フェードインアニメーションを適用するコンポーネント
 * 子要素を徐々に表示させるアニメーションを提供します
 */
const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  style,
  duration = 500,
  delay = 0,
}) => {
  // 透明度のアニメーション値
  const opacity = new Animated.Value(0);

  useEffect(() => {
    // コンポーネントがマウントされたらアニメーションを開始
    Animated.timing(opacity, {
      toValue: 1,
      duration: duration,
      delay: delay,
      useNativeDriver: true, // ネイティブドライバーを使用して最適化
    }).start();

    // クリーンアップ関数（必要に応じて）
    return () => {
      // アニメーションのクリーンアップが必要な場合はここに記述
    };
  }, []);

  return (
    <Animated.View style={[style, { opacity }]}>
      {children}
    </Animated.View>
  );
};

export default FadeInView; 