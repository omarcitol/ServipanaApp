import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function ClientHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  // Aquí luego conectaremos con el backend real
  useEffect(() => {
    setHistory([
      { id: '1', technician: 'Juan Pérez', status: 'Completado' },
      { id: '2', technician: 'Ana Gómez', status: 'Pendiente' },
      { id: '3', technician: 'Luis Rodríguez', status: 'En progreso' },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Servicios</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Técnico: {item.technician}</Text>
            <Text>Estado: {item.status}</Text>
            <Button title="Ver detalles" onPress={() => {}} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
});
