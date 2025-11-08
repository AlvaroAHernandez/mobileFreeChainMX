// components/clubs/ClubCard.tsx (SIMPLIFICADO)
import { ThemedText } from "@/components/themed-text";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface ClubCardProps {
  organization: {
    id: number;
    name: string;
    description: string;
    address: string;
    logo_url: string;
    users_count?: number;
    is_member?: boolean;
    user_role?: string;
  };
  onPress: () => void;
  onJoin?: (id: number) => Promise<any>;
  onLeave?: (id: number) => Promise<any>;
  actionLoading?: boolean;
}

export default function ClubCard({ 
  organization, 
  onPress, 
  onJoin, 
  onLeave, 
  actionLoading 
}: ClubCardProps) {
  const gs = useGlobalStyles();
  const Colors = getThemeColors("dark");

  // Función para obtener el texto del rol
  const getRoleText = (role: string) => {
    const roles: { [key: string]: string } = {
      'admin': 'Administrador',
      'owner': 'Dueño', 
      'moderator': 'Moderador',
      'miembro': 'Miembro',
      'member': 'Miembro'
    };
    return roles[role] || 'Miembro';
  };

  // Manejar unirse al club
  const handleJoin = async () => {
    if (!onJoin) return;
    
    const result = await onJoin(organization.id);
    if (result.success) {
      // Éxito silencioso, el estado ya se actualizó
    } else {
      Alert.alert('Error', result.error);
    }
  };

  // Manejar salir del club - CONFIRMACIÓN DIRECTA
  const handleLeave = async () => {
    if (!onLeave) return;
    
    Alert.alert(
      'Salir del Club',
      `¿Estás seguro de que quieres salir de "${organization.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          onPress: async () => {
            const result = await onLeave(organization.id);
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const isLoading = actionLoading === organization.id;

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        gs.card,
        organization.is_member && styles.memberCard
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {/* Header con imagen y estado de membresía */}
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          {organization.logo_url ? (
            <Image 
              source={{ uri: organization.logo_url }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Ionicons name="people" size={24} color={Colors.textSecondary} />
            </View>
          )}
        </View>

        {/* Estado de membresía y botones de acción */}
        <View style={styles.actionSection}>
          {organization.is_member ? (
            <View style={styles.memberSection}>
              {/* Badge de miembro (NO CLICKEABLE) */}
              <View style={[styles.memberBadge, { backgroundColor: Colors.success }]}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <ThemedText style={styles.memberText}>
                  {organization.user_role ? getRoleText(organization.user_role) : 'Miembro'}
                </ThemedText>
              </View>
              
              {/* Botón para salir */}
              <TouchableOpacity
                style={[styles.leaveButton, { borderColor: Colors.error }]}
                onPress={handleLeave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.error} />
                ) : (
                  <>
                    <Ionicons name="exit-outline" size={14} color={Colors.error} />
                    <ThemedText style={[styles.leaveText, { color: Colors.error }]}>
                      Salir
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nonMemberSection}>
              {/* Botón para unirse */}
              <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: Colors.tint }]}
                onPress={handleJoin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="person-add" size={14} color="#fff" />
                    <ThemedText style={styles.joinButtonText}>
                      Unirse
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
              
              <ThemedText style={[styles.joinSubtitle, { color: Colors.textSecondary }]}>
                Disponible
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Información del club */}
      <View style={styles.content}>
        <ThemedText style={[gs.textPrimary, styles.name]} numberOfLines={1}>
          {organization.name}
        </ThemedText>
        
        <ThemedText 
          style={[gs.textSecondary, styles.description]} 
          numberOfLines={2}
        >
          {organization.description}
        </ThemedText>

        {/* Línea separadora para miembros */}
        {organization.is_member && (
          <View style={[styles.memberDivider, { backgroundColor: Colors.success }]} />
        )}

        <View style={styles.footer}>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
            <ThemedText style={[gs.textSecondary, styles.footerText]}>
              {organization.address}
            </ThemedText>
          </View>
          
          <View style={styles.members}>
            <Ionicons name="people-outline" size={12} color={Colors.textSecondary} />
            <ThemedText style={[gs.textSecondary, styles.footerText]}>
              {organization.users_count || 0} miembro{organization.users_count !== 1 ? 's' : ''}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  memberCard: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  actionSection: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 10,
  },
  memberSection: {
    alignItems: 'flex-end',
    width: '100%',
    gap: 8,
  },
  nonMemberSection: {
    alignItems: 'flex-end',
    width: '100%',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  memberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    marginBottom: 4,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  joinSubtitle: {
    fontSize: 10,
    fontWeight: '500',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
  },
  leaveText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  memberDivider: {
    height: 2,
    borderRadius: 1,
    marginBottom: 8,
    width: '30%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});