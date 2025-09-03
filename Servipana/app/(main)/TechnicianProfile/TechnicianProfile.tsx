import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function TechnicianProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // aquí recibimos el id dinámico

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil Técnico</Text>
      <Text>ID del técnico: {id}</Text>
      <Button
        title="Solicitar Servicio"
        onPress={() => router.push(`/ServiceRequest?id=${id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
