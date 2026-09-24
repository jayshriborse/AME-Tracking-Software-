import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  LayoutAnimation,
  Platform,
} from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import {
  Truck,
  FolderKanban,
  Settings,
  Package,
  ChevronDown,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  Camera,
  ExternalLink,
} from 'lucide-react-native'
import { listTransitsGrouped } from '@/services/transits'
import { API_BASE_URL } from '@/services/api'
import type { VehicleDispatchGroup } from '@/types/api'

function resolveMediaUrl(path?: string | null) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

function formatTimestamp(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DispatchesTab() {
  const [vehicles, setVehicles] = useState<VehicleDispatchGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Multi-Level Expansion Sets
  const [expandedVehicles, setExpandedVehicles] = useState<Set<string>>(new Set())
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listTransitsGrouped()
      setVehicles(data as unknown as VehicleDispatchGroup[])
      // Auto expand first active vehicle if available
      if (data.length > 0) {
        const first = data[0] as unknown as VehicleDispatchGroup
        setExpandedVehicles(new Set([String(first.id)]))
        if (first.projects?.length > 0) {
          const firstProjKey = `${first.id}-${first.projects[0].projectName}`
          setExpandedProjects(new Set([firstProjKey]))
          if (first.projects[0].jobs?.length > 0) {
            const firstJobKey = `${firstProjKey}-${first.projects[0].jobs[0].jobCode}`
            setExpandedJobs(new Set([firstJobKey]))
          }
        }
      }
    } catch {
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load]),
  )

  const toggleVehicle = (id: string | number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const key = String(id)
    setExpandedVehicles((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const toggleProject = (vehicleId: string | number, projectName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const key = `${vehicleId}-${projectName}`
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const toggleJob = (
    vehicleId: string | number,
    projectName: string,
    jobCode: string,
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const key = `${vehicleId}-${projectName}-${jobCode}`
    setExpandedJobs((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    const vMatch = v.vehicleNumber.toLowerCase().includes(q)
    const pMatch = v.projects?.some((p) =>
      p.projectName.toLowerCase().includes(q) ||
      p.jobs?.some((j) =>
        j.jobName.toLowerCase().includes(q) ||
        j.jobCode.toLowerCase().includes(q) ||
        j.parts?.some((part) =>
          String(part.pieceNumber).includes(q) ||
          part.fitting?.toLowerCase().includes(q) ||
          part.itemTracking?.toLowerCase().includes(q),
        ),
      ),
    )
    return vMatch || pMatch
  })

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Truck size={24} color="#047857" />
          <Text style={styles.headerTitle}>Dispatches</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Vehicle ➔ Project ➔ Job ➔ Parts
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vehicle, project, job, piece #..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#047857" size="large" />
          <Text style={styles.loadingText}>Loading dispatches...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {filteredVehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Truck size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Dispatches Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? 'No vehicle matches your search query'
                  : 'Start a new dispatch session from the Home tab'}
              </Text>
            </View>
          ) : (
            filteredVehicles.map((vehicle) => {
              const isVehicleExpanded = expandedVehicles.has(String(vehicle.id))
              const isActive = vehicle.status === 'ACTIVE'
              const photoUrl = resolveMediaUrl(vehicle.truckPhotoUrl)

              return (
                <View key={vehicle.id} style={styles.vehicleCard}>
                  {/* ─── LEVEL 1: VEHICLE HEADER ─── */}
                  <TouchableOpacity
                    style={[
                      styles.vehicleHeader,
                      isVehicleExpanded && styles.vehicleHeaderExpanded,
                    ]}
                    onPress={() => toggleVehicle(vehicle.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.vehicleIconBadge}>
                      <Truck size={20} color="#047857" />
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.vehiclePlateText}>
                          {vehicle.vehicleNumber}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            isActive ? styles.statusActive : styles.statusCompleted,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              isActive ? styles.statusActiveText : styles.statusCompletedText,
                            ]}
                          >
                            {isActive ? '● ACTIVE' : '✓ COMPLETED'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.vehicleMetaRow}>
                        <Text style={styles.vehicleMetaText}>
                          {vehicle.totalParts} {vehicle.totalParts === 1 ? 'part' : 'parts'}
                        </Text>
                        <Text style={styles.metaDot}>·</Text>
                        <Text style={styles.vehicleMetaText}>
                          {vehicle.projects?.length || 0} {vehicle.projects?.length === 1 ? 'project' : 'projects'}
                        </Text>
                        <Text style={styles.metaDot}>·</Text>
                        <Text style={styles.vehicleMetaText}>
                          {formatTimestamp(vehicle.startedAt)}
                        </Text>
                      </View>
                    </View>

                    {photoUrl ? (
                      <View style={styles.photoIndicator}>
                        <Camera size={14} color="#047857" />
                      </View>
                    ) : null}

                    <View style={styles.chevronWrap}>
                      {isVehicleExpanded ? (
                        <ChevronDown size={20} color="#047857" />
                      ) : (
                        <ChevronRight size={20} color="#9CA3AF" />
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* ─── LEVEL 2: PROJECTS (Inside Expanded Vehicle) ─── */}
                  {isVehicleExpanded && (
                    <View style={styles.vehicleBody}>
                      {/* Action Bar */}
                      <View style={styles.vehicleActionBar}>
                        <TouchableOpacity
                          style={styles.openDispatchBtn}
                          onPress={() => router.push(`/transit/${vehicle.id}`)}
                        >
                          <Text style={styles.openDispatchBtnText}>
                            {isActive ? 'Continue Loading & Photo ➔' : 'View Full Dispatch'}
                          </Text>
                          <ExternalLink size={14} color="#047857" />
                        </TouchableOpacity>
                      </View>

                      {(!vehicle.projects || vehicle.projects.length === 0) ? (
                        <View style={styles.emptyChildCard}>
                          <Package size={24} color="#9CA3AF" />
                          <Text style={styles.emptyChildText}>
                            No parts loaded into this vehicle yet.
                          </Text>
                        </View>
                      ) : (
                        vehicle.projects.map((project) => {
                          const projKey = `${vehicle.id}-${project.projectName}`
                          const isProjExpanded = expandedProjects.has(projKey)

                          return (
                            <View key={projKey} style={styles.projectCard}>
                              {/* Project Header */}
                              <TouchableOpacity
                                style={styles.projectHeader}
                                onPress={() => toggleProject(vehicle.id, project.projectName)}
                                activeOpacity={0.7}
                              >
                                <View style={styles.projectIconBadge}>
                                  <FolderKanban size={16} color="#1D4ED8" />
                                </View>

                                <View style={{ flex: 1, marginLeft: 8 }}>
                                  <Text style={styles.projectNameText}>
                                    {project.projectName}
                                  </Text>
                                  <Text style={styles.projectMetaText}>
                                    {project.partCount} {project.partCount === 1 ? 'part' : 'parts'} · {project.jobs?.length || 0} jobs
                                  </Text>
                                </View>

                                <View style={styles.projBadge}>
                                  <Text style={styles.projBadgeText}>{project.partCount}</Text>
                                </View>

                                {isProjExpanded ? (
                                  <ChevronDown size={18} color="#1D4ED8" />
                                ) : (
                                  <ChevronRight size={18} color="#9CA3AF" />
                                )}
                              </TouchableOpacity>

                              {/* ─── LEVEL 3: JOBS (Inside Expanded Project) ─── */}
                              {isProjExpanded && (
                                <View style={styles.projectBody}>
                                  {(!project.jobs || project.jobs.length === 0) ? (
                                    <Text style={styles.emptySubText}>No jobs under this project</Text>
                                  ) : (
                                    project.jobs.map((job) => {
                                      const jobKey = `${projKey}-${job.jobCode}`
                                      const isJobExpanded = expandedJobs.has(jobKey)

                                      return (
                                        <View key={jobKey} style={styles.jobCard}>
                                          {/* Job Header */}
                                          <TouchableOpacity
                                            style={styles.jobHeader}
                                            onPress={() => toggleJob(vehicle.id, project.projectName, job.jobCode)}
                                            activeOpacity={0.7}
                                          >
                                            <View style={styles.jobIconBadge}>
                                              <Settings size={14} color="#6B7280" />
                                            </View>

                                            <View style={{ flex: 1, marginLeft: 8 }}>
                                              <Text style={styles.jobNameText}>
                                                {job.jobName}
                                              </Text>
                                              <Text style={styles.jobMetaText}>
                                                Job Code: #{job.jobCode}
                                              </Text>
                                            </View>

                                            <View style={styles.jobBadge}>
                                              <Text style={styles.jobBadgeText}>
                                                {job.partCount} {job.partCount === 1 ? 'part' : 'parts'}
                                              </Text>
                                            </View>

                                            {isJobExpanded ? (
                                              <ChevronDown size={16} color="#374151" />
                                            ) : (
                                              <ChevronRight size={16} color="#9CA3AF" />
                                            )}
                                          </TouchableOpacity>

                                          {/* ─── LEVEL 4: PARTS (Inside Expanded Job) ─── */}
                                          {isJobExpanded && (
                                            <View style={styles.jobBody}>
                                              {(!job.parts || job.parts.length === 0) ? (
                                                <Text style={styles.emptySubText}>No pieces loaded</Text>
                                              ) : (
                                                job.parts.map((part, pIdx) => (
                                                  <View key={part.id || pIdx} style={styles.partRow}>
                                                    <View style={styles.partPieceCircle}>
                                                      <Text style={styles.partPieceNumber}>
                                                        #{part.pieceNumber}
                                                      </Text>
                                                    </View>

                                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                                      <Text style={styles.partFittingText}>
                                                        {part.fitting || 'Standard Duct'}
                                                      </Text>
                                                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                                        {part.itemTracking ? (
                                                          <Text style={styles.partTrackingText}>
                                                            {part.itemTracking}
                                                          </Text>
                                                        ) : null}
                                                        {part.itemId ? (
                                                          <Text style={styles.partItemIdText}>
                                                            ID: {part.itemId}
                                                          </Text>
                                                        ) : null}
                                                      </View>
                                                    </View>

                                                    <View style={styles.partStatusBadge}>
                                                      <CheckCircle2 size={12} color="#047857" />
                                                      <Text style={styles.partStatusText}>
                                                        {part.status === 'SHIPPED' ? 'Shipped' : 'Loaded'}
                                                      </Text>
                                                    </View>
                                                  </View>
                                                ))
                                              )}
                                            </View>
                                          )}
                                        </View>
                                      )
                                    })
                                  )}
                                </View>
                              )}
                            </View>
                          )
                        })
                      )}
                    </View>
                  )}
                </View>
              )
            })
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
    gap: 14,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },

  // ─── Level 1: Vehicle Card ───
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  vehicleHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F0FDF4',
  },
  vehicleIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehiclePlateText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusActiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  statusCompleted: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusCompletedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  vehicleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  vehicleMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metaDot: {
    marginHorizontal: 5,
    color: '#9CA3AF',
  },
  photoIndicator: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#ECFDF5',
    marginRight: 6,
  },
  chevronWrap: {
    padding: 4,
  },
  vehicleBody: {
    padding: 12,
    backgroundColor: '#FAFAFA',
    gap: 10,
  },
  vehicleActionBar: {
    marginBottom: 4,
  },
  openDispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  openDispatchBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  emptyChildCard: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyChildText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // ─── Level 2: Project Card ───
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  projectIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  projectMetaText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  projBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  projBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  projectBody: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },

  // ─── Level 3: Job Card ───
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  jobIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  jobMetaText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  jobBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  jobBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  jobBody: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },

  // ─── Level 4: Part Row ───
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  partPieceCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partPieceNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  partFittingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  partTrackingText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    color: '#1E293B',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  partItemIdText: {
    fontSize: 10,
    color: '#6B7280',
  },
  partStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  emptySubText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    padding: 6,
  },
})
