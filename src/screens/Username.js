import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function Username() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setError('');

    try {
      // ✅ Save username locally (optional but recommended)
      await AsyncStorage.setItem('username', username);

      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: `Hello ${username}`,
      });

      // ✅ Navigate to Home
      navigation.replace('Home'); 
      // use replace so user can't go back

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#0f162b', '#0f162b']} style={styles.container}>
        
        <View style={styles.card}>
          <Text style={styles.title}>Enter Username</Text>

          <TextInput
            style={[styles.input, error && styles.errorBorder]}
            placeholder="Enter your username"
            placeholderTextColor="#94A3B8"
            value={username}
            onChangeText={setUsername}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <Toast />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FB923C',
    borderRadius: 30,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});