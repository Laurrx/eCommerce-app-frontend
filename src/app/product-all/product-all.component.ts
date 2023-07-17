import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../home-page/shared/product.model';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriesService} from "../product-categories/shared/categories.service";
import {ProductsService} from '../home-page/shared/products.service';
import {Review} from "../home-page/shared/review.model";

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.css']
})
export class ProductAllComponent implements OnInit {
  @Input () selectedCategory!: any;
  loading: boolean = true;
  public mockProducts: Product[] = [];
  public categories: any[] = [];
  public placeholder: any = [];
  public filteredList: any[] = [];
  public totalRows: number = 0;

  constructor(private productService: ProductsService,
              private route: ActivatedRoute,
              private router: Router
              ) {}

  ngOnInit(): void {
   this.loading = true;
   this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((list) => {
      this.filteredList = list.map((item: any) => {
        const url = `http://localhost:8081/api/images/download?name=${item.imagesName[0]}`;
        return {
          ...item,
          rating: 0,
          productImage: url,
        };
      });
      // Retrieve reviews for each item and update the rating
      this.filteredList.forEach((item: any) => {
        this.productService.getProductReviews(item.id).subscribe((reviews) => {
          item.reviews = reviews;
          item.rating = this.calculateRating(item.reviews);
          this.placeholder = this.filteredList;
          this.loading = false;
          this.totalRows = this.filteredList.length;
        });
      });
    });

    if(this.route.snapshot) {
      this.applyFilters(this.route.snapshot.params)
    }

  }

  applyFilters(filters: any) {
    const selectedCategoryId = filters.categoryId;
    const priceMin = filters.priceMin;
    const priceMax = filters.priceMax;

    // Apply the filters
    if (selectedCategoryId) {
      this.filteredList = this.placeholder.filter((product: Product) => product.categoryId == selectedCategoryId);
    } else {
      this.filteredList = this.placeholder;
    }

    if (priceMin && priceMax) {
      this.filteredList = this.filteredList.filter((product: Product) => {
        const price = product.price;
        return price >= priceMin && price <= priceMax;
      });
    }

    // Update the total rows and displayed rows
    this.totalRows = this.filteredList.length;
  }

  calculateRating(reviews: Review[]): number {
    let totalRating = 0;
    for (let review of reviews) {
      totalRating += review.rating;
    }
    return Math.round(totalRating / reviews.length);
  }


  clearFilters(selectedCategory: any) {
    this.selectedCategory = selectedCategory.selectedCategory;
    console.log('Selected Category:', this.selectedCategory.id);
      this.filteredList = this.placeholder;
      console.log(this.route.snapshot.params)
      this.router.navigate(['/products']);

    }
}
