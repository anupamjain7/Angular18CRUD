import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { 
  
  employeeForm: FormGroup = new FormGroup({});
  isEditMode: boolean = false; 
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];

  constructor(){
    this.createForm();
    // debugger;
    const oldData = localStorage.getItem("EmpData") || '[]';
    if(oldData != null) { 
      const parseData =  JSON.parse(oldData);
      this.employeeList =  parseData;
    }
  }
  reset() {
    this.employeeObj = new EmployeeModel();
    this.isEditMode = false; 
    this.createForm() 
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empid: new FormControl(this.employeeObj.empid),
      name: new FormControl(this.employeeObj.name,[Validators.required]),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo,[Validators.required]),
      emailId: new FormControl(this.employeeObj.emailId,[Validators.required]),
      pinCode: new FormControl(this.employeeObj.pinCode,[Validators.minLength(6)]),
      state: new FormControl(this.employeeObj.state) 
    })
  }

  onSave() {
    
    // debugger;
    const oldData = localStorage.getItem("EmpData");
    if(oldData != null) {
      const parseData =  JSON.parse(oldData);
      this.employeeForm.controls['empid'].setValue(parseData.length +1);
      console.log(this.employeeForm.value);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeList.unshift(this.employeeForm.value); 
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList))
    this.reset()
  }

  onEdit(item: EmployeeModel) {
    this.isEditMode = true;
    this.employeeObj =  item;
    this.createForm();
    this.employeeForm.controls['empid'].setValue(item.empid); 
  }
  onUpdate() {
    const index = this.employeeList.findIndex(m => m.empid === this.employeeForm.controls['empid'].value);
    if (index !== -1) {
      this.employeeList[index] = { ...this.employeeForm.value }; // Update employee record
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
      this.reset();
    }
  }

  onDelete(id: number) {
    const isDelete=  confirm("Are you sure want to Delete");
    if(isDelete) {
      const index =  this.employeeList.findIndex(m=>m.empid === id);
      if(index !== -1){
      this.employeeList.splice(index,1);
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList)) ;
      }
    }
  }

}