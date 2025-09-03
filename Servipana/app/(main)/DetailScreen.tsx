import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DetailScreen() {
  const { tecnico } = useLocalSearchParams();
  const router = useRouter();
  const data = tecnico ? JSON.parse(tecnico as string) : null;

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el técnico.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: data.foto || "https://via.placeholder.com/300" }}
        style={styles.image}
      />

      <Text style={styles.name}>{data.nombre || data.username}</Text>
      <Text style={styles.specialty}>{data.especialidad}</Text>
      <Text style={styles.description}>{data.descripcion || "Sin descripción disponible."}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Teléfono:</Text>
        <Text style={styles.infoValue}>{data.telefono || "No disponible"}</Text>
      </View>

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => Linking.openURL(`tel:${data.telefono || ""}`)}
      >
        <Text style={styles.contactText}>📞 Contactar</Text>
      </TouchableOpacity>

      {/* Botón de Solicitar Servicio */}
      <TouchableOpacity
        style={styles.serviceButton}
        onPress={() => router.push(`/ServiceRequest/${data.id}`)} 
      >
        <Text style={styles.serviceText}>📝 Solicitar Servicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 24, backgroundColor: "#f2f2f7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 },
  name: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  specialty: { fontSize: 18, color: "#6b7280", marginVertical: 8 },
  description: { fontSize: 16, color: "#4b5563", textAlign: "center", marginBottom: 20 },
  infoBox: { flexDirection: "row", marginBottom: 12 },
  infoLabel: { fontWeight: "bold", marginRight: 6, color: "#111827" },
  infoValue: { color: "#4b5563" },
  contactButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 16,
  },
  contactText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  serviceButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 16,
  },
  serviceText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
