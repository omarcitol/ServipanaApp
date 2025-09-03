import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Technician = {
  id: number;
  nombre: string;
  especialidad: string;
  experiencia: number;
  telefono?: string;
  foto?: string;
};

// Datos de prueba mientras no hay backend
const dummyTechnicians: Technician[] = [
  {
    id: 1,
    nombre: "Pedro López",
    especialidad: "Carpintero",
    experiencia: 5,
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    nombre: "Carlos Ruiz",
    especialidad: "Fontanero",
    experiencia: 8,
    foto: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    especialidad: "Electricista",
    experiencia: 4,
    foto: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    nombre: "Luis Gómez",
    especialidad: "Pintor",
    experiencia: 6,
    foto: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

export default function HomeScreen() {
  const [tecnicos, setTecnicos] = useState<Technician[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Aquí eventualmente se hace fetch desde el backend
    setTecnicos(dummyTechnicians);
  }, []);

  const filteredTechnicians = tecnicos.filter((t) => {
    const matchesSearch =
      t.nombre.toLowerCase().includes(search.toLowerCase()) ||
      t.especialidad.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? t.especialidad === filter : true;
    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }: { item: Technician }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(main)/DetailScreen",
          params: { tecnico: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{ uri: item.foto }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <Text style={styles.cardSubtitle}>{item.especialidad}</Text>
        <Text style={styles.cardExperience}>{item.experiencia} años de experiencia</Text>
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() =>
            router.push({
              pathname: "/(main)/DetailScreen",
              params: { tecnico: JSON.stringify(item) },
            })
          }
        >
          <Text style={styles.viewProfileText}>Ver Perfil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>Encuentra tu técnico</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre o especialidad"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {["Carpintero", "Fontanero", "Electricista", "Pintor"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              filter === cat && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filter === cat ? null : cat)}
          >
            <Text
              style={[
                styles.filterText,
                filter === cat && styles.filterTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTechnicians}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f7" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  filters: { flexDirection: "row", marginBottom: 16, paddingHorizontal: 4 },
  filterButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: { backgroundColor: "#2563eb" },
  filterText: { color: "#111827", fontSize: 14 },
  filterTextActive: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 40 },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "center" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  cardSubtitle: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  cardExperience: { fontSize: 14, color: "#4b5563", marginTop: 2 },
  viewProfileButton: {
    marginTop: 8,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  viewProfileText: { color: "#fff", fontWeight: "bold" },
});
