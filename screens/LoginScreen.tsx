import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockUsers } from '../constants/mockUsers';
import { RootStackParamList } from '../App';
import InputField from '../components/InputField';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        navigation.replace('Home', { username: user.username });
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require("../assets/logo.jpg")} 
          style={styles.logo}
        />
        
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in to your existant account</Text>

        <View style={styles.form}>
          <InputField
            value={username}
            onChange={(text) => {
              setUsername(text);
              setErrors({ ...errors, username: '' });
            }}
            placeholder="Username"
            error={errors.username}
            containerStyle={styles.input}
          />

          <InputField
            value={password}
            onChange={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
            placeholder="Password"
            error={errors.password}
            secureTextEntry={!showPassword}
            showPasswordToggle
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            containerStyle={styles.input}
          />

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Forgot Password', 'Feature coming soon!')}
          >
            <Text style={styles.forgotPasswordText}>Forget Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>LOG IN</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>Or connect using</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <MaterialCommunityIcons name="google" size={20} color="white" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
            <MaterialCommunityIcons name="facebook" size={20} color="white" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => Alert.alert('Sign Up', 'Feature coming soon!')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#000000',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#000000',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  orText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flex: 1,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666666',
    fontSize: 14,
  },
  signupLink: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
});

