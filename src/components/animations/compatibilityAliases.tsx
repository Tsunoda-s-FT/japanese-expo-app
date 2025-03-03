import React from 'react';
import { ViewProps } from 'react-native';
import { AnimatedView } from './AnimatedView';

type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface FadeInViewProps extends ViewProps {
  duration?: number;
  delay?: number;
  initialOpacity?: number;
  finalOpacity?: number;
}

interface SlideInViewProps extends ViewProps {
  duration?: number;
  delay?: number;
  direction?: SlideDirection;
  distance?: number;
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

/**
 * スライドインアニメーションを行うViewコンポーネント
 * @deprecated 代わりに AnimatedView を使用してください
 */
export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  duration = 300,
  delay = 0,
  direction = 'bottom',
  distance = 100,
  style,
  ...props
}) => {
  return (
    <AnimatedView
      animation="slide"
      direction={direction}
      duration={duration}
      delay={delay}
      distance={distance}
      style={style}
      {...props}
    >
      {children}
    </AnimatedView>
  );
};
