export interface Employee {
  id: number;
  employee_id: string;
  department_id: number;
  name: string;
  address: string;
}

export interface Department {
  id: number;
  department_name: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

export interface Attendance {
  id: number;
  employee_id: string;
  clock_in: string;
  clock_out: string;
  employee?: Employee;
}

export interface EmployeeRequest {
  employee_id: string;
  department_id: number;
  name: string;
  address: string;
}

export interface DepartmentRequest {
  department_name: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

export interface ClockRequest {
  employee_id: string;
}