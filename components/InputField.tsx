import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputFieldProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
  secureTextEntry,
  showPasswordToggle,
  showPassword,
  setShowPassword,
}) => (
  <View style={styles.inputContainer}>
    <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChange}
      />
      {showPasswordToggle && (
        <TouchableOpacity onPress={() => setShowPassword && setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default InputField;
