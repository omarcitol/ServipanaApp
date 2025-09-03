export const API_URL = "http://127.0.0.1:8000/api";

// Registro de técnico
export const registerTecnico = async (data: {
  username: string;
  email: string;
  password: string;
  telefono: string;
  especialidad: string;
  experiencia?: string;
  servicios: number[]; // ids de servicios
  cedula?: { uri: string };
  image?: { uri: string };
  trabajos?: { uri: string }[];
}) => {
  const formData = new FormData();

  // Datos del usuario
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  // Datos del técnico
  formData.append("telefono", data.telefono);
  formData.append("especialidad", data.especialidad);
  if (data.experiencia) formData.append("experiencia", data.experiencia);

  // Servicios: enviar cada id por separado
  data.servicios.forEach((id) => formData.append("servicios", id.toString()));

  // Cedula (archivo)
  if (data.cedula) {
    formData.append("cedula", {
      uri: data.cedula.uri,
      type: "image/jpeg",
      name: "cedula.jpg",
    } as any);
  }

  // Foto de perfil (archivo)
  if (data.image) {
    formData.append("image", {
      uri: data.image.uri,
      type: "image/jpeg",
      name: "perfil.jpg",
    } as any);
  }

  // Trabajos (múltiples archivos)
  if (data.trabajos) {
    data.trabajos.forEach((t, i) => {
      formData.append("trabajos", {
        uri: t.uri,
        type: "image/jpeg",
        name: `trabajo_${i}.jpg`,
      } as any);
    });
  }

  const response = await fetch(`${API_URL}/register/tecnico/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error del backend: ${text}`);
  }

  return response.json();
};
