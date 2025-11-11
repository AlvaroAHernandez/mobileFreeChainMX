import ScreenLayout from "@/components/ScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/EmptyState";
import { getThemeColors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useClubDetail } from "@/hooks/useClubDetail";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// Interface para tipar los datos
interface ClubMember {
    id: number;
    name: string;
    lastname: string | null;
    full_profile_photo_url: string | null;
    pivot: {
        organization_id: number;
        user_id: number;
        role: string;
        created_at: string;
        updated_at: string;
    };
}

interface ClubData {
    id: number;
    name: string;
    description: string;
    address: string;
    logo: string;
    logo_url: string;
    cover_image_url?: string;
    users: ClubMember[];
}

export default function ClubDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user, refreshUser } = useAuth();
    const Colors = getThemeColors("dark");

    // Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const [actionLoading, setActionLoading] = useState(false);

    const { club, loading, error, refetch } = useClubDetail(id as string);

    useEffect(() => {
        if (!loading && club) {
            console.log('🎯 Club data:', club);
            console.log('👥 Users:', club.users);
            console.log('🔍 User count:', club.users?.length);
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [loading, club]);

    // Función para unirse al club
    const handleJoinClub = async () => {
        if (!club) return;
        
        try {
            setActionLoading(true);
            await api.post(`/organizations/${club.id}/join`);
            
            // Actualizar datos
            await refetch();
            await refreshUser();
            
            Alert.alert('¡Éxito!', 'Te has unido al club correctamente');
        } catch (err: any) {
            console.error('❌ Error joining club:', err);
            Alert.alert('Error', err.response?.data?.message || 'No se pudo unir al club');
        } finally {
            setActionLoading(false);
        }
    };

    // Función para salir del club
    const handleLeaveClub = async () => {
        if (!club) return;
        
        Alert.alert(
            'Salir del Club',
            '¿Estás seguro de que quieres salir de este club?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Salir', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await api.post(`/organizations/${club.id}/leave`);
                            
                            // Actualizar datos
                            await refetch();
                            await refreshUser();
                            
                            Alert.alert('¡Éxito!', 'Has salido del club correctamente');
                        } catch (err: any) {
                            console.error('❌ Error leaving club:', err);
                            Alert.alert('Error', err.response?.data?.message || 'No se pudo salir del club');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <ScreenLayout title="DETALLE DEL CLUB">
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.tint} />
                    <ThemedText style={styles.loadingText}>
                        Cargando información...
                    </ThemedText>
                </View>
            </ScreenLayout>
        );
    }

    if (error || !club) {
        return (
            <ScreenLayout title="DETALLE DEL CLUB">
                <EmptyState
                    message={error || "Club no encontrado"}
                    icon="bicycle-outline"
                    onRetry={refetch}
                    actionButton={{
                        text: "Volver a Clubs",
                        onPress: () => router.back(),
                    }}
                />
            </ScreenLayout>
        );
    }

    const clubData = club as ClubData;
    const isMember = clubData.users?.some((u: ClubMember) => u.id === user?.id);
    const membersCount = clubData.users?.length || 0;

    console.log('📊 Members count:', membersCount);
    console.log('✅ Is member:', isMember);

    // CORREGIDO: Filtrar por roles reales que vienen de la API
    const getRoleInfo = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
            case 'administrador':
            case 'lider':
                return { label: 'Administrador', color: '#FF6B35', icon: 'shield-checkmark' };
            case 'miembro':
            case 'member':
            default:
                return { label: 'Miembro', color: Colors.tint, icon: 'person' };
        }
    };

    return (
        <ScreenLayout title="DETALLE DEL CLUB">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* HEADER REDISEÑADO - MÁS COMPACTO */}
                <View style={styles.header}>
                    {/* Imagen de portada */}
                    {clubData.cover_image_url ? (
                        <Image
                            source={{ uri: clubData.cover_image_url }}
                            style={styles.headerImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.headerImage, styles.headerImagePlaceholder]}>
                            <Ionicons name="people" size={40} color="rgba(139, 92, 246, 0.3)" />
                        </View>
                    )}
                    
                    {/* Overlay de gradiente */}
                    <View style={styles.headerOverlay} />

                    {/* Botón de volver */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <View style={styles.backButtonInner}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    {/* Información principal del club */}
                    <View style={styles.headerContent}>
                        {/* Logo y info básica */}
                        <View style={styles.clubBasicInfo}>
                            <View style={styles.logoContainer}>
                                {clubData.logo_url ? (
                                    <Image
                                        source={{ uri: clubData.logo_url }}
                                        style={styles.logo}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.logoPlaceholder}>
                                        <ThemedText style={styles.logoText}>
                                            {clubData.name?.charAt(0).toUpperCase()}
                                        </ThemedText>
                                    </View>
                                )}
                            </View>
                            
                            <View style={styles.clubMainInfo}>
                                <View style={styles.titleRow}>
                                    <ThemedText style={styles.clubTitle} numberOfLines={2}>
                                        {clubData.name}
                                    </ThemedText>
                                    {isMember && (
                                        <View style={styles.memberBadge}>
                                            <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                                            <ThemedText style={styles.memberBadgeText}>Miembro</ThemedText>
                                        </View>
                                    )}
                                </View>
                                
                                <View style={styles.clubDetails}>
                                    {clubData.address && (
                                        <View style={styles.detailItem}>
                                            <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
                                            <ThemedText style={styles.detailText} numberOfLines={1}>
                                                {clubData.address}
                                            </ThemedText>
                                        </View>
                                    )}
                                    
                                    <View style={styles.detailItem}>
                                        <Ionicons name="people" size={14} color="rgba(255,255,255,0.7)" />
                                        <ThemedText style={styles.detailText}>
                                            {membersCount} {membersCount === 1 ? 'miembro' : 'miembros'}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Botón de acción (Unirse/Salir) */}
                        <View style={styles.actionButtonContainer}>
                            {isMember ? (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.leaveButton]}
                                    onPress={handleLeaveClub}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="exit-outline" size={16} color="#fff" />
                                            <ThemedText style={styles.actionButtonText}>
                                                Salir
                                            </ThemedText>
                                        </>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.joinButton]}
                                    onPress={handleJoinClub}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="person-add" size={16} color="#fff" />
                                            <ThemedText style={styles.actionButtonText}>
                                                Unirse
                                            </ThemedText>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* CONTENIDO PRINCIPAL */}
                <Animated.View 
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {/* Descripción */}
                    {clubData.description && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="document-text" size={20} color={Colors.tint} />
                                <ThemedText style={styles.cardTitle}>Descripción</ThemedText>
                            </View>
                            <ThemedText style={styles.descriptionText}>
                                {clubData.description}
                            </ThemedText>
                        </View>
                    )}

                    {/* Miembros */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="people" size={20} color={Colors.tint} />
                            <ThemedText style={styles.cardTitle}>
                                Miembros ({membersCount})
                            </ThemedText>
                        </View>

                        {clubData.users && clubData.users.length > 0 ? (
                            <View style={styles.membersList}>
                                {clubData.users.map((member: ClubMember) => {
                                    const roleInfo = getRoleInfo(member.pivot?.role);
                                    return (
                                        <MemberRow 
                                            key={member.id} 
                                            member={member} 
                                            isCurrentUser={user?.id === member.id}
                                            role={roleInfo.label}
                                            roleColor={roleInfo.color}
                                            roleIcon={roleInfo.icon}
                                        />
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={48} color="rgba(255,255,255,0.3)" />
                                <ThemedText style={styles.emptyStateTitle}>
                                    Aún no hay miembros
                                </ThemedText>
                                <ThemedText style={styles.emptyStateText}>
                                    Sé el primero en unirte a este club
                                </ThemedText>
                            </View>
                        )}
                    </View>

                    {/* Espacio al final */}
                    <View style={styles.spacer} />
                </Animated.View>
            </ScrollView>
        </ScreenLayout>
    );
}

// Componente mejorado para cada fila de miembro
const MemberRow = ({ member, isCurrentUser, role, roleColor, roleIcon }: any) => {
    console.log('👤 Rendering member:', member);
    
    const getDisplayName = () => {
        if (member.name && member.lastname) {
            return `${member.name} ${member.lastname}`;
        }
        return member.name || 'Usuario';
    };

    const getAvatarContent = () => {
        if (member.full_profile_photo_url) {
            return (
                <Image
                    source={{ uri: member.full_profile_photo_url }}
                    style={memberStyles.avatar}
                    onError={(e) => console.log('❌ Error loading avatar:', e.nativeEvent.error)}
                />
            );
        }
        
        return (
            <View style={[memberStyles.avatar, memberStyles.avatarPlaceholder]}>
                <ThemedText style={memberStyles.avatarText}>
                    {getDisplayName().charAt(0).toUpperCase()}
                </ThemedText>
            </View>
        );
    };

    return (
        <View style={memberStyles.container}>
            <View style={memberStyles.avatarSection}>
                <View style={memberStyles.avatarContainer}>
                    {getAvatarContent()}
                    {isCurrentUser && (
                        <View style={memberStyles.currentUserIndicator}>
                            <Ionicons name="star" size={8} color="#fff" />
                        </View>
                    )}
                </View>
            </View>

            <View style={memberStyles.infoSection}>
                <View style={memberStyles.nameRow}>
                    <ThemedText style={memberStyles.name} numberOfLines={1}>
                        {getDisplayName()}
                    </ThemedText>
                    {isCurrentUser && (
                        <ThemedText style={memberStyles.youLabel}>(Tú)</ThemedText>
                    )}
                </View>
                <View style={memberStyles.roleRow}>
                    <View style={[memberStyles.roleBadge, { backgroundColor: roleColor + '20' }]}>
                        <Ionicons 
                            name={roleIcon} 
                            size={12} 
                            color={roleColor} 
                            style={memberStyles.roleIcon}
                        />
                        <ThemedText style={[memberStyles.roleText, { color: roleColor }]}>
                            {role}
                        </ThemedText>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        backgroundColor: '#000',
    },
    loadingText: { 
        fontSize: 16, 
        color: 'rgba(255,255,255,0.7)',
    },
    
    // Header rediseñado
    header: { 
        position: "relative",
        height: 200, // Más compacto
    },
    headerImage: { 
        width: "100%", 
        height: "100%",
    },
    headerImagePlaceholder: {
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
    },
    backButtonInner: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    headerContent: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 15,
    },
    clubBasicInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 15,
        marginBottom: 15,
    },
    logoContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#1a1a1a",
        backgroundColor: '#fff',
    },
    logoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#1a1a1a",
        backgroundColor: '#8B5CF6',
        justifyContent: "center",
        alignItems: "center",
    },
    logoText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    clubMainInfo: {
        flex: 1,
        gap: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        flexWrap: 'wrap',
    },
    clubTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#fff",
        flex: 1,
    },
    memberBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(34,197,94,0.15)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(34,197,94,0.3)",
    },
    memberBadgeText: {
        color: "#22c55e",
        fontSize: 12,
        fontWeight: "600",
    },
    clubDetails: {
        gap: 6,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        flex: 1,
    },
    actionButtonContainer: {
        alignItems: 'flex-start',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 120,
        justifyContent: 'center',
    },
    joinButton: {
        backgroundColor: '#8B5CF6',
    },
    leaveButton: {
        backgroundColor: '#ef4444',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    
    // Content
    content: { 
        padding: 20,
        gap: 20,
        marginTop: 0,
    },
    
    // Cards
    card: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: "700",
        color: "#fff",
    },
    descriptionText: { 
        fontSize: 15, 
        lineHeight: 22,
        color: "rgba(255,255,255,0.9)",
    },
    
    // Members list
    membersList: {
        gap: 16,
    },
    
    // Empty state
    emptyState: { 
        alignItems: "center", 
        padding: 30,
        gap: 12,
    },
    emptyStateTitle: { 
        fontSize: 16, 
        fontWeight: "600",
        color: '#fff',
    },
    emptyStateText: { 
        fontSize: 14, 
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
    },
    
    spacer: {
        height: 40,
    },
});

const memberStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 4,
    },
    avatarSection: {
        position: 'relative',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#374151',
    },
    avatarPlaceholder: {
        backgroundColor: '#374151',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    currentUserIndicator: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: "#8B5CF6",
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        zIndex: 2,
    },
    infoSection: {
        flex: 1,
        gap: 6,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
    },
    youLabel: {
        fontSize: 12,
        color: '#8B5CF6',
        fontWeight: '600',
        fontStyle: 'italic',
    },
    roleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    roleIcon: {
        marginRight: 2,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '700',
    },
});