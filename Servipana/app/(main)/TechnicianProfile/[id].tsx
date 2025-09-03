import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";

type Technician = {
  id: number;
  nombre: string;
  descripcion?: string;
  telefono?: string;
  especialidad?: string;
  foto?: string;
};

export default function TechnicianProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tecnico, setTecnico] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/tecnicos/${id}/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTecnico(data);
      } catch (err: any) {
        console.error("Error cargando perfil:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnician();
  }, [id]);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#000" />;

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", fontWeight: "bold" }}>Error al cargar perfil: {error}</Text>
      </View>
    );

  if (!tecnico)
    return (
      <View style={styles.center}>
        <Text>No se encontró el técnico.</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tecnico.foto && <Image source={{ uri: tecnico.foto }} style={styles.image} />}
      <Text style={styles.name}>{tecnico.nombre || tecnico.username}</Text>
      {tecnico.especialidad && <Text style={styles.specialty}>Oficio: {tecnico.especialidad}</Text>}
      {tecnico.descripcion && <Text style={styles.description}>{tecnico.descripcion}</Text>}
      {tecnico.experiencia !== undefined && (
        <Text style={styles.info}>Experiencia: {tecnico.experiencia} años</Text>
      )}
      {tecnico.telefono && <Text style={styles.info}>📞 {tecnico.telefono}</Text>}

      <Button
        title="Solicitar Servicio"
        onPress={() => router.push(`/ServiceRequest/${id}`)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 160, height: 160, borderRadius: 80, marginBottom: 20 },
  name: { fontSize: 26, fontWeight: "bold", marginBottom: 8 },
  specialty: { fontSize: 18, color: "#666", marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 22, textAlign: "center", marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 8 },
});
