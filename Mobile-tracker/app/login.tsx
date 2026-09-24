import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Redirect } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { ApiClientError } from '@/services/api'

export default function LoginScreen() {
  const { login, submitting: _sub, isLoading: _loading } = useAuth() as any
  const [email, setEmail] = useState('operator@ametracker.local')
  const [password, setPassword] = useState('Password123!')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (e) {
      const message =
        e instanceof ApiClientError
          ? e.message
          : 'Unable to sign in. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <Image
        source={require('../assets/images/images.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>AME Tracker</Text>
      <Text style={styles.subtitle}>Operator sign-in</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="operator@ametracker.local"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={() => void handleLogin()}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: { width: 120, height: 120, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 28 },
  form: { width: '100%', maxWidth: 420, gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  error: { color: '#DC2626', marginTop: 8, fontWeight: '600' },
  button: {
    marginTop: 16,
    backgroundColor: '#078710',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
})
