import type { Employee } from "../types/employee";
import type { Task } from "../types/task";

const API_URL = "{use_your_ip}/api";

export async function getEmployees(page: number = 1, perPage: number = 10): Promise<[Employee[], object]> {
  try {
    const response = await fetch(`${API_URL}/employee?page=${page}&per_page=${perPage}`);

    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }

    const result = await response.json();

    return [result.data, result.meta];
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export async function createEmployee(employee: Omit<Employee, "id">): Promise<Employee> {
  try {
    const response = await fetch(`${API_URL}/employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("API error:", response.status, result);

      throw new Error(
        result.message || `Request failed with status ${response.status}`
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
}

export async function deleteEmployee(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/employee/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const result = await response.json();
      console.error("API error:", response.status, result);
      throw new Error(
        result.message || `Request failed with status ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
}

export async function getTasks(page: number = 1, perPage: number = 10): Promise<[Task[], object]> {
  try {
    const response = await fetch(`${API_URL}/task?page=${page}&per_page=${perPage}`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const result = await response.json();

    return [result.data, result.meta];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function createTask(task: Omit<Task, "id" | "employee" | "status">): Promise<Task> {
  try {
    console.log(JSON.stringify(task));
    const response = await fetch(`${API_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("API error:", response.status, result);

      throw new Error(
        result.message || `Request failed with status ${response.status}`
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/task/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const result = await response.json();
      console.error("API error:", response.status, result);
      throw new Error(
        result.message || `Request failed with status ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
}