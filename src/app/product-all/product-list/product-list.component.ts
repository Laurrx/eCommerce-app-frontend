import {Component, Input, OnInit} from '@angular/core';
import { Product } from 'src/app/home-page/shared/product.model';
import {BasketService} from "../../shopping-cart/shared/basket.service";
import {CategoriesService} from "../../product-categories/shared/categories.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements  OnInit{
  @Input() mockProduct!: Product[];
  @Input() lalalala!: Product[];

  constructor(private basketService: BasketService,
              private router: Router,

  private mockproductService: CategoriesService
              ) {}

  filterList(category: string) {
    console.log('Selected Category:', category);
    category
      ? this.mockProduct.filter((product: Product) => product.category === category) && console.log(this.mockProduct)
      : this.mockProduct && console.log('aaa');
  }
  addToBasket(product: Product, event: any): void {
    event.stopPropagation()

    // this.basketService.addToBasket(product);
    // this.basketService.log();
    console.log(product.id);
    this.basketService.createOrder(product.id)
  }

  ngOnInit(): void {
    console.log(this.lalalala);
    this.mockproductService.getCategories().subscribe()
  }
  getProductDetails(id: number, event: any) {
    event.stopPropagation()
    this.router.navigate([`product-details/${id}`]);

  }


}
