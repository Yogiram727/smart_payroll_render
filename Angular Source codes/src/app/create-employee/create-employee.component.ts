import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { Message } from '../Message';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employee: Employee = new Employee();
  msg: Message = new Message();
  errorMessage: string = '';
  successMessage: string = '';
  currentStep: number = 1;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize any default values
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

  saveEmployee() {
    this.employeeService.createEmployee(this.employee).subscribe(
      () => {
        console.log('Employee added successfully');
        this.successMessage = 'Employee created successfully! Redirecting...';
        this.errorMessage = '';
        
        setTimeout(() => {
          this.goToEmployeeList();
        }, 2000);
      },
      (error) => {
        console.error(error);
        this.errorMessage = error.message || 'Failed to create employee. Please try again.';
        this.successMessage = '';
      }
    );
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    } else {
      this.saveEmployee();
    }
  }
}