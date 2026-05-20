import { Component, OnInit } from '@angular/core';
import { Salary } from '../salary';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryService } from '../salary.service';

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.css']
})
export class SalaryDetailsComponent implements OnInit {
  id: number;
  salary: Salary;
  currentDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salaryService: SalaryService
  ) {
    this.salary = new Salary();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.salaryService.getSalaryById(this.id).subscribe(data => {
      this.salary = data;
    });
  }

  getTotalEarnings(): number {
    return (this.salary.basicSalary || 0) + 
           (this.salary.dearnessAllowance || 0) + 
           (this.salary.houseRentAllowance || 0);
  }

  getTotalDeductions(): number {
    return (this.salary.pfContribution || 0) + 
           (this.salary.ssfContribution || 0) + 
           (this.salary.medicalInsurance || 0) + 
           (this.salary.monthlyIncomeTax || 0);
  }

  convertToWords(amount: number): string {
    if (!amount) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
                  'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWords = (n: number): string => {
      if (n === 0) return '';
      if (n < 20) return ones[n] + ' ';
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + numToWords(n % 10);
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + numToWords(n % 100);
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand ' + numToWords(n % 1000);
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh ' + numToWords(n % 100000);
      return numToWords(Math.floor(n / 10000000)) + ' Crore ' + numToWords(n % 10000000);
    };
    
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    
    let result = numToWords(rupees) + 'Rupees';
    if (paise > 0) {
      result += ' and ' + numToWords(paise) + 'Paise';
    }
    result += ' Only';
    
    return result.trim();
  }

  printSalaryDetails() {
    const printContent = document.getElementById('printContent');
    
    if (printContent) {
      const originalTitle = document.title;
      document.title = `Salary_Slip_${this.salary.employeeId}_${this.salary.firstName}`;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Salary Slip - ${this.salary.firstName} ${this.salary.lastName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
              }
              .print-content {
                max-width: 800px;
                margin: 0 auto;
              }
              @media print {
                body {
                  padding: 0;
                  margin: 0;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-content">
              ${printContent.innerHTML}
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
      
      document.title = originalTitle;
    } else {
      console.error("Element with id 'printContent' not found.");
    }
  }

  goBack(): void {
    this.router.navigate(['/salaries']);
  }
}