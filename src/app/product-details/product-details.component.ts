import { Component, OnInit } from '@angular/core';
import { Product } from '../home-page/shared/product.model';
import { ProductsService } from '../home-page/shared/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BasketService } from '../shopping-cart/shared/basket.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Review } from '../home-page/shared/review.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {} as Product;
  images: { url: string }[] = [];
  position: string = 'bottom';
  overallRating: number = 0;
  discountedPrice: number = 0;
  reviews: Review[] = [];
  reviewForm = this.fb.group({
    rating: new FormControl(0, { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    comment: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private basketService: BasketService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.productService.getProduct(id).subscribe((product) => {
      this.product = product;
      this.discountedPrice = Math.round(
        product.price - product.price * (product.discountPercentage / 100)
      );
      product.rating = this.overallRating;
      // this.getImages();
    });
    this.productService.getProductReviews(id).subscribe((reviews) => {
      this.reviews = reviews;
      this.calculateRating();
    });
  }

  scrollToSection(id: string) {
    const section = document.getElementById(id)!;
    section.scrollIntoView({ behavior: 'smooth' });
  }

  // getImages() {
  //   for (let photo of this.product.images) {
  //     this.images.push({ url: photo });
  //   }
  //   this.images = [...this.images];
  // }

  onSubmit() {
    if (this.authService.isAuthenticated()) {
      const review: Review = {
        rating: this.reviewForm.controls.rating.value,
        title: this.reviewForm.controls.title.value,
        comment: this.reviewForm.controls.comment.value,
      };

      this.productService.saveReview(this.product.id, review);
      this.reviews.push(review);
      this.reviewForm.reset();
    } else {
      this.router.navigate(['login']);
    }
  }

  addToFavorite(product: Product) {
    if (this.authService.isAuthenticated()) {
      const favoriteProductsList: Product[] = JSON.parse(
        localStorage.getItem('favoriteProducts') || '[]'
      );
      if (favoriteProductsList.some((element) => element.id === product.id)) {
      } else favoriteProductsList.push(product);

      localStorage.setItem(
        'favoriteProducts',
        JSON.stringify(favoriteProductsList)
      );
      this.productService.favoriteProductsObservable.next(favoriteProductsList);
    } else {
      this.router.navigate(['login']);
    }
  }

  calculateRating() {
    let totalRating = 0;
    for (let review of this.reviews) {
      totalRating += review.rating;
    }
    this.overallRating = Math.round(totalRating / this.reviews.length);
    return this.overallRating;
  }

  addToCart(product: Product) {
    if (this.authService.isAuthenticated()) {
      //write logic to add product to cart
    } else {
      this.router.navigate(['login']);
    }
  }
}
