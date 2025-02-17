import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Product} from '../../models/product.model';
import {ProductService} from '../../services/product/product.service';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {ProductAdminDialogComponent} from '../product-admin-dialog/product-admin-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-admin-panel',
  imports: [
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSortModule,
    MatPaginator,
  ],
  providers: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router:Router, private productService: ProductService, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(){
    this.productService.fetchProducts();
    this.productService.products$.subscribe((products) => {
      this.dataSource.data = products;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onAddProduct() {
    const dialogRef = this.dialog.open(ProductAdminDialogComponent, {
      width: '400px',
      data: { product: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.productService.addProduct(result);
      }
    });
  }

  onEditProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductAdminDialogComponent, {
      width: '400px',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.productService.updateProduct({ ...product, ...result });
      }
    });
  }

  onDeleteProduct(id: number) {
    //this.productService.deleteProduct(id);
  }

  onBackButtonClick() {
    this.router.navigate(['']);
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
