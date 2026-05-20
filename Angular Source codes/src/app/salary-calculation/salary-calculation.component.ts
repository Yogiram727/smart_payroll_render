import { Component, OnInit } from '@angular/core';
import { Salary } from '../salary';
import { SalaryService } from '../salary.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salary-calculation',
  templateUrl: './salary-calculation.component.html',
  styleUrls: ['./salary-calculation.component.css']
})
export class SalaryCalculationComponent implements OnInit {
  salaries: Salary[] = [];
  filteredSalaries: Salary[] = [];
  
  // Stats
  totalRecords: number = 0;
  uniqueEmployees: number = 0;
  totalPayout: number = 0;
  avgSalary: number = 0;
  
  // Filters
  searchTerm: string = '';
  filterMonth: string = '';
  filterYear: string = '';
  
  // Filter lists
  monthsList: string[] = [];
  yearsList: number[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private salaryService: SalaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSalary();
  }

  private getSalary(): void {
    this.salaryService.getSalaryList().subscribe(data => {
      this.salaries = data;
      this.filteredSalaries = [...this.salaries];
      this.calculateStats();
      this.extractFilterOptions();
    });
  }

  calculateStats(): void {
    this.totalRecords = this.salaries.length;
    
    // Count unique employees
    const uniqueEmpIds = new Set(this.salaries.map(s => s.employeeId));
    this.uniqueEmployees = uniqueEmpIds.size;
    
    // Calculate total payout
    this.totalPayout = this.salaries.reduce((sum, s) => sum + (s.netMonthlySalary || 0), 0);
    
    // Calculate average salary
    this.avgSalary = this.totalRecords > 0 ? this.totalPayout / this.totalRecords : 0;
  }

  extractFilterOptions(): void {
    const months = new Set<string>();
    const years = new Set<number>();
    
    this.salaries.forEach(salary => {
      if (salary.dateofSalary) {
        const date = new Date(salary.dateofSalary);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        months.add(monthYear);
        years.add(date.getFullYear());
      }
    });
    
    this.monthsList = Array.from(months);
    this.yearsList = Array.from(years).sort((a, b) => b - a);
  }

  formatDate(dateValue: any): string {
    if (!dateValue) return 'N/A';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.salaries];
    
    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(salary =>
        (salary.firstName && salary.firstName.toLowerCase().includes(term)) ||
        (salary.lastName && salary.lastName.toLowerCase().includes(term)) ||
        (salary.employeeId && salary.employeeId.toString().includes(term)) ||
        (salary.designation && salary.designation.toLowerCase().includes(term))
      );
    }
    
    // Month filter
    if (this.filterMonth) {
      filtered = filtered.filter(salary => {
        if (!salary.dateofSalary) return false;
        try {
          const date = new Date(salary.dateofSalary);
          const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          return monthYear === this.filterMonth;
        } catch (e) {
          return false;
        }
      });
    }
    
    // Year filter
    if (this.filterYear) {
      filtered = filtered.filter(salary => {
        if (!salary.dateofSalary) return false;
        try {
          const date = new Date(salary.dateofSalary);
          return date.getFullYear().toString() === this.filterYear;
        } catch (e) {
          return false;
        }
      });
    }
    
    this.filteredSalaries = filtered;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterMonth = '';
    this.filterYear = '';
    this.filteredSalaries = [...this.salaries];
    this.currentPage = 1;
  }

  salaryDetails(id: number): void {
    this.router.navigate(['salary-details', id]);
  }

  updateSalary(id: number): void {
    this.router.navigate(['update-salary', id]);
  }

  deleteSalary(id: number): void {
    if (confirm('Are you sure you want to delete this salary record?')) {
      this.salaryService.deleteSalary(id).subscribe(data => {
        console.log(data);
        this.getSalary();
      });
    }
  }

  navigateToAddSalary(): void {
    this.router.navigate(['add-salary']);
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName && !lastName) return '?';
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }
}