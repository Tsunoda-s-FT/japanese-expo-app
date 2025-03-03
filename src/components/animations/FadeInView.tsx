import React from 'react';
import { ViewProps } from 'react-native';
import { AnimatedView } from './AnimatedView';

interface FadeInViewProps extends ViewProps {
  duration?: number;
  delay?: number;
  initialOpacity?: number;
  finalOpacity?: number;
}

/**
 * フェードインアニメーションを行うViewコンポーネント
 * @deprecated 代わりに AnimatedView を使用してください
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  duration = 300,
  delay = 0,
  initialOpacity = 0,
  finalOpacity = 1,
  style,
  ...props
}) => {
  return (
    <AnimatedView
      animation="fade"
      duration={duration}
      delay={delay}
      initialOpacity={initialOpacity}
      finalOpacity={finalOpacity}
      style={style}
      {...props}
    >
      {children}
    </AnimatedView>
  );
}; 