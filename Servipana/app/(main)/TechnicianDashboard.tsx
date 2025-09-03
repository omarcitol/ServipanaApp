import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function TechnicianDashboard() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    setServices([
      { id: '1', client: 'Cliente 1', status: 'Pendiente' },
      { id: '2', client: 'Cliente 2', status: 'Aceptado' },
      { id: '3', client: 'Cliente 3', status: 'Completado' },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Técnico</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Cliente: {item.client}</Text>
            <Text>Estado: {item.status}</Text>
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
