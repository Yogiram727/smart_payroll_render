import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  id: number;
  employee: Employee;
  currentDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employee = new Employee();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(this.id).subscribe(data => {
      this.employee = data;
    });
  }

  calculateExperience(): number {
    if (!this.employee.dateofJoining) return 0;
    const joinDate = new Date(this.employee.dateofJoining);
    const today = new Date();
    const years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();
    if (months < 0) {
      return years - 1;
    }
    return years;
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName && !lastName) return '?';
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }

  printEmployeeDetails() {
    const printContent = document.getElementById('printContent');
    
    if (printContent) {
      const originalTitle = document.title;
      document.title = `Employee_${this.employee.employeeId}_${this.employee.firstName}`;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Employee Details - ${this.employee.firstName} ${this.employee.lastName}</title>
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
    this.router.navigate(['/employees']);
  }
}