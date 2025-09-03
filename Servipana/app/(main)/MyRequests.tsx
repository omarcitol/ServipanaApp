import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MyRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/solicitudes/");
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error("❌ Error cargando solicitudes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Cargando solicitudes...</Text>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>⚡ Aún no tienes solicitudes</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            router.push(`/(main)/ServiceRequestDetail?id=${item.id}`)
          }
        >
          <Text style={styles.cardTitle}>Solicitud #{item.id}</Text>
          <Text style={styles.cardText}>🔧 Técnico: {item.tecnico}</Text>
          <Text style={styles.cardText}>📌 Dirección: {item.address}</Text>
          <Text
            style={[
              styles.status,
              item.status === "pendiente"
                ? styles.pending
                : item.status === "aprobado"
                ? styles.approved
                : styles.rejected,
            ]}
          >
            Estado: {item.status}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 15,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },
  status: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 15,
  },
  pending: {
    color: "#ff9800",
  },
  approved: {
    color: "#4caf50",
  },
  rejected: {
    color: "#f44336",
  },
});
