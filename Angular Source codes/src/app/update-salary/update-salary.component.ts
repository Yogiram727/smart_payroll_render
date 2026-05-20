import { Component, OnInit } from '@angular/core';
import { Salary } from '../salary';
import { SalaryService } from '../salary.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-salary',
  templateUrl: './update-salary.component.html',
  styleUrls: ['./update-salary.component.css']
})
export class UpdateSalaryComponent implements OnInit {
  id: number;
  salary: Salary = new Salary();
  calculateDeduction: boolean = false;
  calculateTaxableIncome: boolean = false;
  calculateMonthlyIncomeTaxNetSalary: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private salaryService: SalaryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadSalaryData();
  }

  loadSalaryData(): void {
    this.salaryService.getSalaryById(this.id).subscribe(
      data => {
        this.salary = data;
        this.errorMessage = '';
      },
      error => {
        console.log(error);
        this.errorMessage = 'Error occurred while fetching salary details';
      }
    );
  }

  onAllowanceChange(): void {
    // Recalculate when allowances change
    if (this.calculateTaxableIncome) {
      this.onCalculateTaxableIncomeChange();
    }
    if (this.calculateMonthlyIncomeTaxNetSalary) {
      this.onCalculateMonthlyIncomeTaxNetSalaryChange();
    }
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
    
    // Recalculate taxable income if needed
    if (this.calculateTaxableIncome) {
      this.onCalculateTaxableIncomeChange();
    }
  }

  onCalculateTaxableIncomeChange() {
    if (this.calculateTaxableIncome) {
      this.salary.grossMonthlySalary = this.salary.basicSalary + 
                                        (this.salary.dearnessAllowance || 0) + 
                                        (this.salary.houseRentAllowance || 0);
      
      this.salary.taxableMonthlyIncome = this.salary.grossMonthlySalary - 
                                          (this.salary.pfContribution + 
                                           this.salary.ssfContribution + 
                                           this.salary.medicalInsurance);
      
      this.salary.taxableAnnualIncome = this.salary.taxableMonthlyIncome * 12;
    } else {
      this.salary.grossMonthlySalary = 0;
      this.salary.taxableMonthlyIncome = 0;
      this.salary.taxableAnnualIncome = 0;
    }
    
    // Recalculate net salary if needed
    if (this.calculateMonthlyIncomeTaxNetSalary) {
      this.onCalculateMonthlyIncomeTaxNetSalaryChange();
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

  onSubmit() {
    this.salaryService.updateSalary(this.id, this.salary).subscribe(
      () => {
        console.log('Salary updated successfully');
        this.successMessage = 'Salary updated successfully! Redirecting...';
        this.errorMessage = '';
        
        setTimeout(() => {
          this.goToSalaryList();
        }, 2000);
      },
      error => {
        console.error(error);
        this.errorMessage = error.message || 'Failed to update salary. Please try again.';
        this.successMessage = '';
      }
    );
  }

  goToSalaryList() {
    this.router.navigate(['/salaries']);
  }
}