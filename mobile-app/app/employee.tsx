import { useEffect, useState } from "react";
import { 
  Text, View, StyleSheet, ScrollView, 
  Pressable, Modal, TextInput, useWindowDimensions 
} from "react-native";
import { getEmployees, createEmployee, deleteEmployee } from "../services/api";
import type { Employee } from "../types/employee";
import { Ionicons } from '@expo/vector-icons';

export default function EmployeesScreen() {
  // State to hold the list of employees
  const [employees, SetEmployees] = useState<Employee[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Add Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [id, setId] = useState(-1);
  const [isDeleting, setIsDeleting] = useState(false);

  // =========================
  // Load Employee
  // =========================
  useEffect(() => {
    getEmployees(currentPage, ITEMS_PER_PAGE).then(([employees, meta]) => {
      SetEmployees(employees);
      setCurrentPage(meta.current_page || 1);
      setTotalPages(meta.last_page || 1);
    }).catch((error) => {
      console.error("Error fetching employees:", error);
    });
  }, [currentPage, ITEMS_PER_PAGE]);

  function refreshEmployees(currentPage: number, perPage: number) {
    getEmployees(currentPage, perPage).then(([employees, meta]) => {
      SetEmployees(employees);
      setCurrentPage(meta.current_page || 1);
      setTotalPages(meta.last_page || 1);
    }).catch((error) => {
      console.error("Error fetching employees:", error);
    });
  }

  // =========================
  // Pagination
  // =========================
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    refreshEmployees(currentPage - 1, ITEMS_PER_PAGE);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    refreshEmployees(currentPage + 1, ITEMS_PER_PAGE);
  };

  // =========================
  // Add Employee
  // =========================
  const openAddModal = async () => {
    setName("");
    setModalVisible(true);
  };

  const closeAddModal = async () => {
    if (!isSaving) {
      setModalVisible(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!name.trim()) {
      alert("Please enter employee name");
      return;
    }

    try {
      setIsSaving(true);

      const newEmployee = await createEmployee({
        name: name.trim(),
      });

      // Add new employee to the list
      refreshEmployees(currentPage, ITEMS_PER_PAGE);

      // Close modal
      setModalVisible(false);
      setName("");
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee");
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // Delete Employee
  // =========================
  const openDeleteModal = (id: number) => {
    setId(id);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setId(id);
    if (!isDeleting) {
      setDeleteModalVisible(false);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      setIsDeleting(true);

      await deleteEmployee(id);

      setDeleteModalVisible(false);
      setId(-1);

      // refresh the employee list after deletion
      refreshEmployees(currentPage, ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };


  const styles = StyleSheet.create({
    table: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#ccc",
    },
    row: {
      flexDirection: "row",
      width: "100%",
    },
    header: {
      backgroundColor: "#eee",
    },
    cell: {
      padding: 12,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#aaa",
    },
    container: {
      flex: 1,
      marginHorizontal: 50,
      marginVertical: 20,
    },
    table_header: {
      paddingHorizontal: 10,
      paddingVertical: 15,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#2563eb",
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 8,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },

    idCell: {
      flex: 1,
    },
    nameCell: {
      flex: 3,
    },
    actionCell: {
      flex: 2,
    },

    // =========================
    // Modal styles
    // =========================

    pagination: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 15,
      paddingVertical: 15,
    },
    paginationButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#2563eb",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
    },
    paginationButtonDisabled: {
      backgroundColor: "#d1d5db",
    },
    paginationText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    pageText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#374151",
    },

    // =========================
    // Modal styles
    // =========================

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalContainer: {
      width: "90%",
      maxWidth: 500,
      backgroundColor: "white",
      borderRadius: 12,
      padding: 24,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
    },

    closeButton: {
      padding: 4,
    },

    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      color: "#374151",
    },

    input: {
      borderWidth: 1,
      borderColor: "#d1d5db",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      marginBottom: 20,
    },

    modalButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
    },

    cancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: "#e5e7eb",
    },

    cancelButtonText: {
      color: "#374151",
      fontWeight: "600",
    },

    // =========================
    // Add Employee Modal styles
    // =========================

    saveButton: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: "#2563eb",
    },

    saveButtonDisabled: {
      backgroundColor: "#93c5fd",
    },

    saveButtonText: {
      color: "white",
      fontWeight: "600",
    },

    // =========================
    // Add Employee Modal styles
    // =========================
    deleteButton: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: "#ff0000",
    },

    deleteButtonDisabled: {
      backgroundColor: "#ff4343",
    },

    deleteButtonText: {
      color: "white",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.table_header}>
        <Text style={styles.title}>Employee List</Text>

        <Pressable
          style={styles.button}
          onPress={openAddModal}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.buttonText}>Add Employee</Text>
        </Pressable>
      </View>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.idCell]}>ID</Text>
            <Text style={[styles.cell, styles.nameCell]}>Name</Text>
            <Text style={[styles.cell, styles.actionCell]}>Actions</Text>
          </View>

          {/* Employees for current page */}
          {employees.map((employee) => (
            <View style={styles.row} key={"employee-" + employee.id}>
              <Text style={[styles.cell, styles.idCell]}>{employee.id}</Text>
              <Text style={[styles.cell, styles.nameCell]}>{employee.name}</Text>
              <Text style={[styles.cell, styles.actionCell]}>
                <Pressable
                  style={styles.button}
                  onPress={() => openDeleteModal(employee.id)}
                >
                  <Ionicons name="trash" size={20} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      {totalPages > 0 && (
        <View style={styles.pagination}>
          <Pressable
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.paginationButtonDisabled,
            ]}
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={18} color="white" />
            <Text style={styles.paginationText}>Previous</Text>
          </Pressable>

          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>

          <Pressable
            style={[
              styles.paginationButton,
              currentPage === totalPages &&
                styles.paginationButtonDisabled,
            ]}
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.paginationText}>Next</Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </Pressable>
        </View>
      )}

      {/* Add Employee Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Employee</Text>

              <Pressable
                style={styles.closeButton}
                onPress={closeAddModal}
                disabled={isSaving}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </Pressable>
            </View>

            {/* Name Input */}
            <Text style={styles.inputLabel}>Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter employee name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isSaving}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={closeAddModal}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.saveButton,
                  isSaving && styles.saveButtonDisabled,
                ]}
                onPress={handleAddEmployee}
                disabled={isSaving}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Employee Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Employee</Text>

              <Pressable
                style={styles.closeButton}
                onPress={closeDeleteModal}
                disabled={isDeleting}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </Pressable>
            </View>
          

            <Text style={styles.inputLabel}>Are you sure you want to delete this employee?</Text>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={closeDeleteModal}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.deleteButton,
                  isDeleting && styles.deleteButtonDisabled,
                ]}
                onPress={handleDeleteEmployee}
                disabled={isDeleting}
              >
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}