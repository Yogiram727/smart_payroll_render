import { Component, OnInit } from '@angular/core';
import { Salary } from '../salary';
import { NgForm } from '@angular/forms';
import { SalaryService } from '../salary.service';
import { Router } from '@angular/router';
import { Message } from '../Message';

@Component({
  selector: 'app-add-salary',
  templateUrl: './add-salary.component.html',
  styleUrls: ['./add-salary.component.css']
})
export class AddSalaryComponent implements OnInit {

  salary: Salary = new Salary();
  employeeIds: number[] = [];
  msg: Message = new Message();
  calculateDeduction: boolean = false;
  calculateTaxableIncome: boolean = false;
  calculateMonthlyIncomeTaxNetSalary: boolean = false;
  errorMessage: string = '';  // ← ADD THIS LINE

  constructor(private salaryService: SalaryService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployeeIds();
    this.salary = new Salary();
  }

  onCalculateDeductionChange() {
    if (this.calculateDeduction) {
      this.salary.pfContribution = this.salary.basicSalary * 0.1;
      this.salary.ssfContribution = this.salary.basicSalary * 0.13;
      this.salary.medicalInsurance = this.salary.basicSalary * 0.05;
    } else {
      this.salary.pfContribution = 0;
      this.salary.ssfContribution = 0;
      this.salary.medicalInsurance = 0;
    }
  }

  onCalculateTaxableIncomeChange() {
    if (this.calculateTaxableIncome) {
      this.salary.grossMonthlySalary = this.salary.basicSalary + this.salary.dearnessAllowance + this.salary.houseRentAllowance;
      this.salary.taxableMonthlyIncome = this.salary.grossMonthlySalary - (this.salary.pfContribution + this.salary.ssfContribution + this.salary.medicalInsurance);
      this.salary.taxableAnnualIncome = this.salary.taxableMonthlyIncome * 12;
    } else {
      this.salary.grossMonthlySalary = 0;
      this.salary.taxableMonthlyIncome = 0;
      this.salary.taxableAnnualIncome = 0;
    }
  }

  onCalculateMonthlyIncomeTaxNetSalaryChange() {
    if (this.calculateMonthlyIncomeTaxNetSalary) {
      this.salary.monthlyIncomeTax = (this.salary.taxableAnnualIncome * 0.01) / 12;
      this.salary.netMonthlySalary = this.salary.grossMonthlySalary - this.salary.monthlyIncomeTax;
    } else {
      this.salary.monthlyIncomeTax = 0;
      this.salary.netMonthlySalary = 0;
    }
  }

  fetchEmployeeIds() {
    this.salaryService.getEmployeeIds().subscribe(
      (ids: number[]) => {
        this.employeeIds = ids;
      },
      (error) => {
        console.error('Error fetching employee IDs:', error);
        this.errorMessage = 'Failed to load employee IDs';
      }
    );
  }

  onEmployeeIdChange() {
    if (this.salary.employeeId) {
      console.log('Selected Employee ID:', this.salary.employeeId);
      this.salaryService.getEmployeeDetails(this.salary.employeeId).subscribe(
        (employee: any) => {
          this.salary.firstName = employee.firstName;
          this.salary.lastName = employee.lastName;
          this.salary.email = employee.email;
          this.salary.designation = employee.designation;
          this.salary.maritalStatus = employee.maritalStatus;
          this.salary.basicSalary = employee.basicSalary;
          this.errorMessage = ''; // Clear any previous errors
        },
        (error) => {
          console.error('Error fetching employee details:', error);
          this.errorMessage = 'Failed to load employee details';
        }
      );
    }
  }

  saveSalary() {
    this.salaryService.createSalary(this.salary).subscribe(
      data => {
        console.log(data);
        this.goToSalaryList();
      },
      error => {
        console.log(error);
        this.errorMessage = 'Failed to save salary record. Please try again.';
      }
    );
  }

  goToSalaryList() {
    this.router.navigate(['/salaries']);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.controls['employeeId']?.markAsTouched();
      form.controls['dateofSalary']?.markAsTouched();
      this.errorMessage = 'Please fill all required fields';
      return;
    } else {
      this.errorMessage = '';
      this.saveSalary();
    }
  }
}