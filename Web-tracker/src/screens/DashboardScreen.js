// React Native Dashboard Component
// Place this in: src/screens/DashboardScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  TouchableOpacity
} from 'react-native';
import api from '../services/api';

export default function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    // Refresh every 10 seconds for live updates
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [dashboardData, piecesData, tasksData] = await Promise.all([
        api.fetchDashboardStats(),
        api.fetchAllPieces(),
        api.fetchAllTasks()
      ]);

      setStats(dashboardData);
      setPieces(piecesData.slice(0, 10)); // Show first 10
      setTasks(tasksData.slice(0, 10)); // Show first 10

    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, color = '#007AFF' }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  const PieceItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.barcode}</Text>
        <Text style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Scanned' ? '#4CAF50' : '#FFC107' }
        ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.itemSubtitle}>Task ID: {item.taskId}</Text>
      {item.location && (
        <Text style={styles.itemSubtitle}>Location: {item.location}</Text>
      )}
    </TouchableOpacity>
  );

  const TaskItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Completed' ? '#4CAF50' : '#2196F3' }
        ]}>
          {item.status}
        </Text>
      </View>
      {item.description && (
        <Text style={styles.itemSubtitle}>{item.description}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Tracking Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Last updated: {stats?.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : 'N/A'}
        </Text>
      </View>

      {stats && (
        <>
          {/* Key Metrics Row 1 */}
          <View style={styles.metricsGrid}>
            <StatCard title="Total Pieces" value={stats.totalPieces} color="#007AFF" />
            <StatCard title="Scanned" value={stats.scannedPieces} color="#4CAF50" />
          </View>

          {/* Key Metrics Row 2 */}
          <View style={styles.metricsGrid}>
            <StatCard title="Pending" value={stats.pendingPieces} color="#FFC107" />
            <StatCard title="Scan Rate" value={stats.scanPercentage} color="#FF5722" />
          </View>

          {/* Tasks Metrics */}
          <View style={styles.metricsGrid}>
            <StatCard title="Total Tasks" value={stats.totalTasks} color="#9C27B0" />
            <StatCard title="Completed" value={stats.completedTasks} color="#4CAF50" />
          </View>

          {/* Task Completion Rate */}
          <View style={styles.fullWidthCard}>
            <Text style={styles.cardTitle}>Task Completion Rate</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: parseFloat(stats.taskCompletionRate) + '%' }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{stats.taskCompletionRate}</Text>
          </View>
        </>
      )}

      {/* Recent Pieces */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Pieces</Text>
        {pieces.length > 0 ? (
          <FlatList
            data={pieces}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PieceItem item={item} />}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No pieces found</Text>
        )}
      </View>

      {/* Active Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Tasks</Text>
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TaskItem item={item} />}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No tasks found</Text>
        )}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>Refresh Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 30,
    color: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullWidthCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  progressBar: {
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    color: '#333',
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    padding: 15,
    margin: 10,
    borderRadius: 4,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
});
