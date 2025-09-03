import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { registerTecnico } from '../../services/api';

export default function RegisterTecnicoScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [trabajos, setTrabajos] = useState<string[]>([]);

  const pickImage = async (set: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      set(result.assets[0].uri);
    }
  };

  const addTrabajo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setTrabajos([...trabajos, result.assets[0].uri]);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !telefono || !especialidad) {
      Alert.alert('⚠️ Campos incompletos', 'Llena todos los campos obligatorios.');
      return;
    }

    try {
      await registerTecnico({
        username,
        email,
        password,
        telefono,
        experiencia,
        especialidad,
        image,
        trabajos,
      });
      Alert.alert('✅ Éxito', 'Técnico registrado, ahora inicia sesión.');
      router.push('/(auth)/LoginScreen');
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Error', 'No se pudo registrar el técnico.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🔧 Servipana</Text>
      <Text style={styles.title}>Registro Técnico</Text>

      <TextInput placeholder="Usuario" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Correo" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" style={styles.input} value={password} secureTextEntry onChangeText={setPassword} />
      <TextInput placeholder="Teléfono" style={styles.input} value={telefono} onChangeText={setTelefono} />
      <TextInput placeholder="Especialidad" style={styles.input} value={especialidad} onChangeText={setEspecialidad} />
      <TextInput placeholder="Años de experiencia (opcional)" style={styles.input} value={experiencia} onChangeText={setExperiencia} />

      <TouchableOpacity style={styles.button} onPress={() => pickImage(setImage)}>
        <Text style={styles.buttonText}>{image ? 'Cambiar foto de perfil' : 'Seleccionar foto de perfil'}</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={addTrabajo}>
        <Text style={styles.buttonText}>Agregar foto de trabajo</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        {trabajos.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.trabajoPreview} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f4f8', flexGrow: 1, justifyContent: 'center' },
  logo: { fontSize: 36, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 8, backgroundColor: '#fff' },
  button: { backgroundColor: '#4a90e2', padding: 12, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  preview: { width: 120, height: 120, marginVertical: 10, borderRadius: 8, alignSelf: 'center' },
  trabajoPreview: { width: 100, height: 100, marginRight: 10, borderRadius: 8 },
  registerButton: { backgroundColor: '#00c851', padding: 15, borderRadius: 8, marginTop: 20 },
  registerButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});
