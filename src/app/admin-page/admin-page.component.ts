import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../home-page/shared/products.service';
import { Product } from '../home-page/shared/product.model';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  visible = false;
  deleteVisible = false;
  header = '';
  productsList: any = [];
  selectedProduct: any = [];
  rows: any = [5, 10, 15];
  row: any = 5;

  constructor(private productsService: ProductsService) {}

  showDialogNewProduct() {
    this.visible = true;
    this.header = 'Add new product';
  }

  showDialogEditProduct(product: any, event: any) {
    this.visible = true;
    this.header = 'Edit product';
    this.selectedProduct = product;
  }

  showDialogDeleteProduct(product: any, event: any) {
    this.header = 'Delete';
    this.deleteVisible = true;
    event.stopPropagation();
    this.selectedProduct = product;
  }

  onClose() {
    this.visible = false;
  }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((list: any) => {
      this.productsList = list;
    });
  }

  onCloseDelete() {
    this.deleteVisible = false;
  }

  savedProduct($event: any) {
    this.ngOnInit();
  }

  deletedProduct(event: Event) {
    this.ngOnInit();
  }
}
