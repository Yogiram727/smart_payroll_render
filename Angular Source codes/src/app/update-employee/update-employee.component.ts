import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  id: number;
  employee: Employee = new Employee();
  errorMessage: string = '';
  successMessage: string = '';
  currentStep: number = 1;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails(): void {
    this.employeeService.getEmployeeById(this.id).subscribe(
      data => {
        this.employee = data;
        this.errorMessage = '';
      },
      error => {
        console.log(error);
        this.errorMessage = 'Error occurred while fetching employee details';
      }
    );
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSubmit() {
    this.employeeService.updateEmployee(this.id, this.employee).subscribe(
      () => {
        console.log('Employee updated successfully');
        this.successMessage = 'Employee updated successfully! Redirecting...';
        this.errorMessage = '';
        
        setTimeout(() => {
          this.goToEmployeeList();
        }, 2000);
      },
      error => {
        console.error(error);
        this.errorMessage = error.message || 'Failed to update employee. Please try again.';
        this.successMessage = '';
      }
    );
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']);
  }
}