import type { Employee } from "./employee";

export interface Task {
    id: number;
    employee_id: number;
    employee: Employee;
    title: string;
    description: string;
    status: string;
}