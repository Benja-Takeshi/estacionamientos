import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';

interface Props extends PressableProps {
  children: string;
  color?: 'primary' | 'secondary' | 'tertiary';
  // contained = relleno | outlined = solo borde
  variant?: 'contained' | 'outlined';
  className?: string;
}

const CustomButton = React.forwardRef(
  ({ children, color = 'primary', onPress, variant = 'contained', className = '' }: Props, ref: React.Ref<View>) => {
    // Cada clase va COMPLETA (no se pueden armar pedazos como `bg-${color}`)
    const relleno = { primary: 'bg-primary border-primary', secondary: 'bg-secondary border-secondary', tertiary: 'bg-tertiary border-tertiary' }[color];
    const borde = { primary: 'bg-white border-primary', secondary: 'bg-white border-secondary', tertiary: 'bg-white border-tertiary' }[color];
    const textoColor = { primary: 'text-primary', secondary: 'text-secondary', tertiary: 'text-tertiary' }[color];
    const lleno = variant === 'contained';

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        className={`py-3 px-4 rounded-xl border mb-2.5 active:opacity-80 ${lleno ? relleno : borde} ${className}`}
      >
        <Text className={`text-center text-base font-work-bold ${lleno ? 'text-white' : textoColor}`}>{children}</Text>
      </Pressable>
    );
  }
);
CustomButton.displayName = 'CustomButton';

export default CustomButton;
