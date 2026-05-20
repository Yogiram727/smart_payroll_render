import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  
  // Stats
  totalEmployees: number = 0;
  maleCount: number = 0;
  femaleCount: number = 0;
  uniqueDepartments: number = 0;
  totalSalary: number = 0;
  
  // Filters
  searchTerm: string = '';
  filterDepartment: string = '';
  filterDesignation: string = '';
  
  // Filter lists
  departmentsList: string[] = [];
  designationsList: string[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees(): void {
    this.employeeService.getEmployeesList().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = [...this.employees];
      this.calculateStats();
      this.extractFilterOptions();
    });
  }

  calculateStats(): void {
    this.totalEmployees = this.employees.length;
    this.maleCount = this.employees.filter(emp => emp.gender === 'Male').length;
    this.femaleCount = this.employees.filter(emp => emp.gender === 'Female').length;
    
    const departments = new Set(this.employees.map(emp => emp.department).filter(dept => dept));
    this.uniqueDepartments = departments.size;
    
    this.totalSalary = this.employees.reduce((sum, emp) => sum + (emp.basicSalary || 0), 0);
  }

  extractFilterOptions(): void {
    const departments = new Set(this.employees.map(emp => emp.department).filter(dept => dept));
    this.departmentsList = Array.from(departments);
    
    const designations = new Set(this.employees.map(emp => emp.designation).filter(desig => desig));
    this.designationsList = Array.from(designations);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.employees];
    
    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        (emp.firstName && emp.firstName.toLowerCase().includes(term)) ||
        (emp.lastName && emp.lastName.toLowerCase().includes(term)) ||
        (emp.email && emp.email.toLowerCase().includes(term)) ||
        (emp.designation && emp.designation.toLowerCase().includes(term))
      );
    }
    
    // Department filter
    if (this.filterDepartment) {
      filtered = filtered.filter(emp => emp.department === this.filterDepartment);
    }
    
    // Designation filter
    if (this.filterDesignation) {
      filtered = filtered.filter(emp => emp.designation === this.filterDesignation);
    }
    
    this.filteredEmployees = filtered;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterDepartment = '';
    this.filterDesignation = '';
    this.filteredEmployees = [...this.employees];
    this.currentPage = 1;
  }

  employeeDetails(id: number): void {
    this.router.navigate(['employee-details', id]);
  }

  updateEmployee(id: number): void {
    this.router.navigate(['update-employee', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.getEmployees();
      });
    }
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['create-employee']);
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName && !lastName) return '?';
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }
}