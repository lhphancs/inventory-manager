import { ProductsComponent } from '../products.component';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { Stack } from '../../../classesAndInterfaces/stack';
import { SelectionModel } from '@angular/cdk/collections';
import { Product } from '../../../classesAndInterfaces/product';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSort, MatTableDataSource, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';

import { openSnackbar } from '../../snackbar';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'products-display',
  templateUrl: './products-display.component.html',
  styleUrls: ['./products-display.component.css']
})
export class ProductsDisplayComponent implements OnInit {
  userId;
  filterValue: string;
  products: Product[];
  displayedColumns: string[] = ['select', 'brand', 'name', 'stockNo', 'costPerBox', 'quantityPerBox', 'UPC', 'purchasedLocation', 'asins'];
  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);
  deletedGroupsStack: Stack; // Used to undo delete

  constructor(private productsComponent:ProductsComponent,
    private databaseProductsService: DatabaseProductsService
    , public snackBar: MatSnackBar, private dialog: MatDialog){
      this.deletedGroupsStack = new Stack();
  }

  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit() {
    this.userId = this.productsComponent.userId;
    this.databaseProductsService.getProducts(this.userId).subscribe( (data) => {
      if(data['success']){
        this.products = data['products'];
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.sort = this.sort;
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteFromView(){
    this.selection.selected.forEach(item => {
      let index: number = this.products.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
      this.dataSource.filter = this.filterValue;
    });
    this.selection = new SelectionModel<Product>(true, []);
  }

  getUPCsFromProducts(produts){
    let UPCs = [];
    produts.forEach(item => {
      UPCs.push(item.UPC);
    });
    return UPCs;
  }

  removeSelectedRows() {
    let productsToDelete = [];
    this.selection.selected.forEach(item => {
      productsToDelete.push(item);
    });

    let UPCsToDelete = this.getUPCsFromProducts(productsToDelete);
    this.databaseProductsService.deleteProducts(this.userId, UPCsToDelete).subscribe( (data) =>{
      if(data['success']){
        this.deleteFromView();
        this.deletedGroupsStack.push(productsToDelete);
      }
      openSnackbar(this.snackBar, data['msg']);
    });
  }

  addToView(productsToAdd){
    productsToAdd.forEach(item => {
      this.dataSource.data.push(item);
    });
    this.dataSource.filter = this.filterValue;
  }

  undoDelete(){
    let productsToAddBack = this.deletedGroupsStack.peek();
    this.databaseProductsService.addManyProducts(this.userId
      , productsToAddBack).subscribe( (data) =>{
      if(data['success']){
        this.addToView(productsToAddBack);
        this.deletedGroupsStack.pop();
      }
      openSnackbar(this.snackBar, data['msg']);
    });
  }

  openDeleteConfirmDialog(){
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{title: "Confirmation", msg: "Are you sure you want to delete?"}
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if(result)
        this.removeSelectedRows();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}