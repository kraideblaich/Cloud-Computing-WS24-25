import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Product} from '../../models/product.model';
import {CartService} from '../../services/shopping-cart/shopping-cart.service';
import {MatIcon} from '@angular/material/icon';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-details-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    CurrencyPipe
  ],
  templateUrl: './product-details-dialog.component.html',
  styleUrl: './product-details-dialog.component.css'
})
export class ProductDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cartService: CartService) {
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product.id);
  }
}
