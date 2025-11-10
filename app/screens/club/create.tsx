import ScreenLayout from '@/components/ScreenLayout';
import { ThemedText } from '@/components/themed-text';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors, Radius } from '@/constants/theme';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';

const ClubSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre del club es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  description: Yup.string().max(200, 'Máximo 200 caracteres'),
  address: Yup.string()
    .matches(
      /^[a-zA-ZÀ-ÿ\s]+(?:,\s*[a-zA-ZÀ-ÿ\s]+)*$/,
      'Debe ingresar una ciudad válida (solo letras y espacios)'
    )
    .max(100, 'Máximo 100 caracteres')
    .required('La ciudad es obligatoria'),
});

export default function ClubCreateScreen() {
  const gs = useGlobalStyles();
  const router = useRouter();
  const Colors = getThemeColors('dark');
  const { loading, createOrganization, pickImage } = useCreateOrganization();

  const handleCreateClub = async (values: any, logo: any, setSubmitting: (v: boolean) => void) => {
    try {
      await createOrganization({
        ...values,
        logo_file: logo,
      });
      Alert.alert('Éxito', 'MotoClub creado correctamente');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear el MotoClub');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenLayout title="CREAR CLUB">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.subtitle}>
            Completa la información para crear tu club de motociclistas
          </ThemedText>
        </View>

        <Formik
          initialValues={{
            name: '',
            description: '',
            address: '',
          }}
          validationSchema={ClubSchema}
          onSubmit={(values, { setSubmitting }) => handleCreateClub(values, null, setSubmitting)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => {
            const [logo, setLogo] = React.useState<any>(null);
            const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

            const handleImagePick = async () => {
              const imageFile = await pickImage();
              if (imageFile) {
                setLogo(imageFile);
                setLogoPreview(imageFile.uri);
                setFieldValue('logo_file', imageFile);
              }
            };

            const handleRemoveImage = () => {
              setLogo(null);
              setLogoPreview(null);
              setFieldValue('logo_file', null);
            };

            const handleCancel = () => {
              if (values.name || values.description || values.address) {
                Alert.alert(
                  '¿Seguro quieres cancelar?',
                  'Se perderán los datos ingresados',
                  [
                    { text: 'Continuar editando', style: 'cancel' },
                    { text: 'Sí, cancelar', style: 'destructive', onPress: () => router.back() },
                  ]
                );
              } else {
                router.back();
              }
            };

            return (
              <>
                {/* Logo del Club */}
                <View style={[gs.card, styles.section]}>
                  <ThemedText style={styles.sectionTitle}>Logo del Club</ThemedText>
                  <ThemedText style={styles.sectionDescription}>
                    Agrega un logo representativo (opcional)
                  </ThemedText>

                  <TouchableOpacity
                    style={[
                      styles.imagePicker,
                      { borderColor: Colors.border, backgroundColor: Colors.surface },
                    ]}
                    onPress={handleImagePick}
                  >
                    {logoPreview ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: logoPreview }} style={styles.imagePreview} />
                        <TouchableOpacity
                          style={[styles.removeImageBtn, { backgroundColor: Colors.danger }]}
                          onPress={handleRemoveImage}
                        >
                          <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Ionicons name="camera-outline" size={32} color={Colors.textSecondary} />
                        <ThemedText
                          style={[styles.imagePlaceholderText, { color: Colors.textSecondary }]}
                        >
                          Agregar logo
                        </ThemedText>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Información Básica */}
                <View style={[gs.card, styles.section]}>
                  <ThemedText style={styles.sectionTitle}>Información Básica</ThemedText>

                  {/* Nombre */}
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>
                      Nombre del Club <ThemedText style={{ color: Colors.danger }}>*</ThemedText>
                    </ThemedText>
                    <TextInput
                      placeholder="Ej: Riders del Valle"
                      placeholderTextColor={Colors.textSecondary}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      style={[
                        styles.input,
                        {
                          color: Colors.text,
                          backgroundColor: Colors.inputBackground,
                          borderColor: touched.name && errors.name ? Colors.error : Colors.border,
                        },
                      ]}
                      maxLength={50}
                    />
                    {touched.name && errors.name && (
                      <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
                    )}
                    <ThemedText style={styles.charCount}>{values.name.length}/50</ThemedText>
                  </View>

                  {/* Descripción */}
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Descripción</ThemedText>
                    <TextInput
                      placeholder="Describe los objetivos y actividades de tu club..."
                      placeholderTextColor={Colors.textSecondary}
                      value={values.description}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      style={[
                        styles.textArea,
                        {
                          color: Colors.text,
                          backgroundColor: Colors.inputBackground,
                          borderColor:
                            touched.description && errors.description
                              ? Colors.error
                              : Colors.border,
                        },
                      ]}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      maxLength={200}
                    />
                    {touched.description && errors.description && (
                      <ThemedText style={styles.errorText}>{errors.description}</ThemedText>
                    )}
                    <ThemedText style={styles.charCount}>
                      {values.description.length}/200
                    </ThemedText>
                  </View>

                  {/* Ubicación */}
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>
                      Ciudad <ThemedText style={{ color: Colors.danger }}>*</ThemedText>
                    </ThemedText>
                    <TextInput
                      placeholder="Ej: La Paz, Baja California Sur"
                      placeholderTextColor={Colors.textSecondary}
                      value={values.address}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      style={[
                        styles.input,
                        {
                          color: Colors.text,
                          backgroundColor: Colors.inputBackground,
                          borderColor:
                            touched.address && errors.address ? Colors.error : Colors.border,
                        },
                      ]}
                      maxLength={100}
                    />
                    {touched.address && errors.address && (
                      <ThemedText style={styles.errorText}>{errors.address}</ThemedText>
                    )}
                  </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.createButton,
                      {
                        backgroundColor: values.name ? Colors.tint : Colors.textMuted,
                        opacity: isSubmitting ? 0.7 : 1,
                      },
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={!values.name || isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                        <ThemedText style={styles.createButtonText}>Crear MotoClub</ThemedText>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: Colors.border }]}
                    onPress={() => router.back()}
                    disabled={isSubmitting}
                  >
                    <ThemedText style={[styles.cancelButtonText, { color: Colors.text }]}>
                      Cancelar
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginBottom: 10 },
  subtitle: { fontSize: 16, opacity: 0.7 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  sectionDescription: { fontSize: 14, opacity: 0.7, marginBottom: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  charCount: { fontSize: 12, opacity: 0.6, textAlign: 'right', marginTop: 4 },
  errorText: { color: '#ff3b30', fontSize: 12, marginTop: 4 },
  imagePicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radius.medium,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: { alignItems: 'center', gap: 8 },
  imagePlaceholderText: { fontSize: 14 },
  imagePreviewContainer: { position: 'relative' },
  imagePreview: { width: 100, height: 100, borderRadius: 50 },
  removeImageBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: { gap: 12, marginTop: 24 },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Radius.medium,
    gap: 8,
  },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: Radius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: { fontSize: 16, fontWeight: '500' },
});
