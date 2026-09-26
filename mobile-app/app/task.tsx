import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { Ionicons } from '@expo/vector-icons';
import { getTasks, createTask, deleteTask } from "../services/api";
import { 
  Text, View, StyleSheet, ScrollView, 
  Pressable, Modal, TextInput, useWindowDimensions 
} from "react-native";

export default function TasksScreen() {
    // State for tasks
    const [tasks, SetTasks] = useState<Task[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [totalPages, setTotalPages] = useState(1);

    // Add Modal
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addEmployeeId, setAddEmployeeId] = useState("");
    const [addTitle, setAddTitle] = useState("");
    const [addDescription, setAddDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Delete Modal
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(-1);
    const [isDeleting, setIsDeleting] = useState(false);

    function refreshTasks(currentPage: number, perPage: number) {
        getTasks(currentPage, perPage).then(([tasks, meta]) => {
            console.log(tasks)
            SetTasks(tasks);
            setCurrentPage(meta.current_page || 1);
            setTotalPages(meta.last_page || 1);
        }).catch((error) => {
            console.error("Error fetching tasks:", error);
        });
    }
    
    useEffect(() => {
        refreshTasks(currentPage, ITEMS_PER_PAGE);
    }, [currentPage, ITEMS_PER_PAGE]);

    // =========================
    // Pagination
    // =========================
    const goToPreviousPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
        refreshTasks(currentPage - 1, ITEMS_PER_PAGE);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
        refreshTasks(currentPage + 1, ITEMS_PER_PAGE);
    };

    // =========================
    // Add Task
    // =========================
    const openAddModal = async () => {
        setAddEmployeeId(-1);
        setAddTitle("");
        setAddDescription("");
        setAddModalVisible(true);
    };

    const closeAddModal = async () => {
        if (!isSaving) {
            setAddModalVisible(false);
        }
    };

    const handleAddTask = async () => {
        if(addEmployeeId == "") {
            alert("Please enter employee ID");
            return;
        }
        if (!addTitle.trim()) {
            alert("Please enter task title");
            return;
        }
        if (!addDescription.trim()) {
            alert("Please enter task description");
            return;
        }

        try {
            setIsSaving(true);

            const newTask = await createTask({
                employee_id: parseInt(addEmployeeId),
                title: addTitle.trim(),
                description: addDescription.trim(),
            });

            // Add new task to the list
            refreshTasks(currentPage, ITEMS_PER_PAGE);

            // Close modal
            setAddModalVisible(false);
            setAddEmployeeId("");
            setAddTitle("");
            setAddDescription("");
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task");
        } finally {
            setIsSaving(false);
        }
    };

    // =========================
    // Delete Employee
    // =========================
    const openDeleteModal = (id: number) => {
        setDeleteId(id);
        setDeleteModalVisible(true);
        };

        const closeDeleteModal = () => {
        setDeleteId(-1);
        if (!isDeleting) {
            setDeleteModalVisible(false);
        }
        };

        const handleDeleteTask = async () => {
        try {
            setIsDeleting(true);

            await deleteTask(deleteId);

            setDeleteModalVisible(false);
            setDeleteId(-1);

            // refresh the task list after deletion
            refreshTasks(currentPage, ITEMS_PER_PAGE);
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task");
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

        assigneeCell: {
            flex: 2,
        },
        titleCell: {
            flex: 2,
        },
        descriptionCell: {
            flex: 3,
        },
        statusCell: {
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
    })
    
    return (
        <View style={styles.container}>
            <View style={styles.table_header}>
                <Text style={styles.title}>Task List</Text>

                <Pressable
                    style={styles.button}
                    onPress={openAddModal}
                >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.buttonText}>Add Task</Text>
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
                    <Text style={[styles.cell, styles.assigneeCell]}>Assignee</Text>
                    <Text style={[styles.cell, styles.titleCell]}>Title</Text>
                    <Text style={[styles.cell, styles.descriptionCell]}>Description</Text>
                    <Text style={[styles.cell, styles.statusCell]}>Status</Text>
                    <Text style={[styles.cell, styles.actionCell]}>Actions</Text>
                </View>

                {/* Tasks for current page */}
                {tasks.map((task) => (
                    <View style={styles.row} key={"task-" + task.id}>
                    <Text style={[styles.cell, styles.assigneeCell]}>{task.employee?.name || "Unassigned"}</Text>
                    <Text style={[styles.cell, styles.titleCell]}>{task.title}</Text>
                    <Text style={[styles.cell, styles.descriptionCell]}>{task.description}</Text>
                    <Text style={[styles.cell, styles.statusCell]}>{task.status}</Text>
                    <Text style={[styles.cell, styles.actionCell]}>
                        <Pressable
                        style={styles.button}
                        onPress={() => openDeleteModal(task.id)}
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
                visible={addModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeAddModal}
            >
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add Task</Text>

                    <Pressable
                        style={styles.closeButton}
                        onPress={closeAddModal}
                        disabled={isSaving}
                    >
                        <Ionicons name="close" size={24} color="#374151" />
                    </Pressable>
                    </View>

                    {/* Assignee ID Input */}
                    <Text style={styles.inputLabel}>Assignee ID</Text>

                    <TextInput
                    style={styles.input}
                    placeholder="Enter task assignee ID"
                    value={addEmployeeId}
                    onChangeText={setAddEmployeeId}
                    autoCapitalize="sentences"
                    editable={!isSaving}
                    />

                    {/* Title Input */}
                    <Text style={styles.inputLabel}>Title</Text>

                    <TextInput
                    style={styles.input}
                    placeholder="Enter task title"
                    value={addTitle}
                    onChangeText={setAddTitle}
                    autoCapitalize="words"
                    editable={!isSaving}
                    />

                    {/* Description Input */}
                    <Text style={styles.inputLabel}>Description</Text>

                    <TextInput
                    style={styles.input}
                    placeholder="Enter task description"
                    value={addDescription}
                    onChangeText={setAddDescription}
                    autoCapitalize="sentences"
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
                        onPress={handleAddTask}
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
        </View>

    );
}
