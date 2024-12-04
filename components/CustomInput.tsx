import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface CustomInputProps extends TextInputProps {
  isPassword?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  isPassword = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        secureTextEntry={isPassword && !showPassword}
        placeholderTextColor="#999"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
});

export default CustomInput;