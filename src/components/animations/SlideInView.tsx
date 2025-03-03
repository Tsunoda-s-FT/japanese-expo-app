import React from 'react';
import { ViewProps } from 'react-native';
import { AnimatedView } from './AnimatedView';

type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface SlideInViewProps extends ViewProps {
  duration?: number;
  delay?: number;
  direction?: SlideDirection;
  distance?: number;
}

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