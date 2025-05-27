class BusinessDTO {
  constructor(data) {
    this.owner_id = data.owner_id;
    this.business_name = data.business_name;
    this.business_address = data.business_address;
    this.business_location = data.business_location;
    this.business_category = data.business_category;
    this.business_detail = data.business_detail;
    this.business_time = data.business_time;
    this.business_phone = data.business_phone;
    this.business_status = data.business_status;
    this.business_rating = data.business_rating;
    this.business_view = data.business_view;
    this.business_image = data.business_image;
    this.business_product = data.business_product;
    this.business_active = data.business_active;
  }
}
module.exports = BusinessDTO; 