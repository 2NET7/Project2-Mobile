import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { login } from '../api/auth';

export default function Loginscreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Email dan Password wajib diisi');
            return;
        }

        try {
            const res = await login(email, password);
            console.log(res);

            if (res.data && res.data.message === 'Login successful') {
                console.log('Login berhasil:', res.data);
                router.push('/Homepage');
            } else {
                setError('Email atau Password salah');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Email atau Password salah');
        }
    };

    const handleRegisterClick = () => {
        router.push('/RegisScreen');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            <View style={styles.topShape} />
            <View style={styles.bottomShape} />

            <View style={styles.overlay}>
                <Image source={require('@/assets/images/LogoBPBD.jpg')} style={styles.logo} />
                <Text style={styles.loginText}>LOGIN</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Masukan Email dan Password</Text>
                    <TextInput 
                        placeholder="Email" 
                        placeholderTextColor="#aaa" 
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput 
                        placeholder="Password" 
                        placeholderTextColor="#aaa" 
                        secureTextEntry={!passwordVisible}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.registerText}>
                    Belum Punya Akun? <Text style={styles.registerLink} onPress={handleRegisterClick}>Daftar</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF1E1',
    },
    overlay: {
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 27,
        borderRadius: 13,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    loginText: {
        color: '#D2601A',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        padding: 14,
        borderRadius: 8,
        fontSize: 16,
        color: 'black',
        borderWidth: 1,
        borderColor: '#D2601A',
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#D2601A',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: 10,
        color: '#666',
    },
    registerLink: {
        color: '#D2601A',
        fontWeight: 'bold',
    },
    topShape: {
        position: 'absolute',
        width: '100%',
        height: '40%',
        backgroundColor: '#D2601A',
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        top: -1,
    },
    bottomShape: {
        position: 'absolute',
        width: '100%',
        height: '40%',
        backgroundColor: '#D2601A',
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        bottom: -1,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});