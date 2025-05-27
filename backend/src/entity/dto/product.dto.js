class ProductDTO {
  constructor(data) {
    this.business_id = data.business_id;
    this.product_name = data.product_name;
    this.product_image = data.product_image;
    this.product_description = data.product_description;
    this.product_number = data.product_number;
    this.product_price = data.product_price;
    this.product_rating = data.product_rating;
  }
}
module.exports = ProductDTO; 