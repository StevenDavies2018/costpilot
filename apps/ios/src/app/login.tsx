import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as GoogleSignIn from 'expo-google-sign-in';

const LoginScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);

  // Initialize Google Sign-In
  React.useEffect(() => {
    const initGoogle = async () => {
      try {
        await GoogleSignIn.initAsync({
          clientId: '775823476864-is2mmg6rrum13dcqpeju73bi5p21pidm.apps.googleusercontent.com',
        });
      } catch (error) {
        console.error('Google Sign-In init error:', error);
      }
    };
    initGoogle();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignIn.signInAsync();
      const user = await GoogleSignIn.signInSilentlyAsync();

      console.log('Google Sign-In successful:', user);

      // TODO: Send token to backend
      // const response = await fetch('http://localhost:3000/api/auth/callback/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ idToken: user.authentication.idToken }),
      // });

      // For now, navigate to home on success
      Alert.alert('Success', `Welcome ${user.user.name}!`);
      router.push('/');
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      setLinkedInLoading(true);

      // TODO: Implement LinkedIn OAuth
      // For now, show a placeholder
      Alert.alert('Coming Soon', 'LinkedIn authentication is being implemented');

      // const response = await LinkeDinAuth.signIn();
      // Navigate on success
    } catch (error) {
      console.error('LinkedIn Sign-In error:', error);
      Alert.alert('Error', 'Failed to sign in with LinkedIn');
    } finally {
      setLinkedInLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ExpenseForge</Text>
          <Text style={styles.subtitle}>Niche-specific expense tracking</Text>
        </View>

        {/* Feature Description */}
        <View style={styles.featureBox}>
          <Text style={styles.featureTitle}>Track expenses by profession</Text>
          <Text style={styles.featureText}>
            Tailored for contractors, real estate agents, and professionals
          </Text>
        </View>

        {/* Sign In Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={googleLoading || linkedInLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>🔍</Text>
                <Text style={styles.buttonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.linkedinButton]}
            onPress={handleLinkedInSignIn}
            disabled={googleLoading || linkedInLoading}
          >
            {linkedInLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>💼</Text>
                <Text style={styles.buttonText}>Sign in with LinkedIn</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            We use secure OAuth authentication. Your data is encrypted and safe.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  featureBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
  },
  googleButton: {
    backgroundColor: '#4285f4',
  },
  linkedinButton: {
    backgroundColor: '#0a66c2',
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;
