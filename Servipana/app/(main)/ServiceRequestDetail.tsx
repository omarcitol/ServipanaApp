import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ServiceRequestDetail() {
  const { id } = useLocalSearchParams(); 
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/solicitudes/${id}/`);
        const data = await response.json();
        setRequest(data);
      } catch (error) {
        console.error("❌ Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Cargando solicitud...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No se encontró la solicitud</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Solicitud #{request.id ?? "-"}</Text>

        <Text style={styles.label}>🔧 Técnico</Text>
        <Text style={styles.text}>{request.tecnico ?? "No asignado"}</Text>

        <Text style={styles.label}>📌 Dirección</Text>
        <Text style={styles.text}>{request.address ?? "-"}</Text>

        <Text style={styles.label}>📝 Descripción</Text>
        <Text style={styles.text}>{request.description ?? "-"}</Text>

        <Text style={styles.label}>📅 Fecha</Text>
        <Text style={styles.text}>
          {request.created_at ? new Date(request.created_at).toLocaleString() : "-"}
        </Text>

        <Text style={styles.label}>📊 Estado</Text>
        <Text style={[styles.status, request.status === "pendiente" ? styles.pending : styles.done]}>
          {request.status?.toUpperCase?.() ?? "-"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f2f4f8",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    marginTop: 5,
  },
  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  done: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
