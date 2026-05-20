import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };

  pieChartType: 'pie' = 'pie';

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    }
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getEmployeesList().subscribe(
      employees => {
        this.prepareChartData(employees);
        console.log('Employees:', employees);
      },
      error => {
        console.error('Error fetching employee data', error);
      }
    );
  }

  prepareChartData(employees: any[]) {
    const roleCount: { [key: string]: number } = {};

    employees.forEach(emp => {
      const role = emp.designation || 'Others';
      roleCount[role] = (roleCount[role] || 0) + 1;
    });

    this.pieChartData = {
      labels: Object.keys(roleCount),
      datasets: [{ data: Object.values(roleCount) }]
    };
  }
}