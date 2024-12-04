import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'social';
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'social' && styles.socialButton,
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={20} color="#000" style={styles.icon} />}
      <Text
        style={[
          styles.text,
          variant === 'social' && styles.socialText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  socialButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  socialText: {
    color: '#000',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;