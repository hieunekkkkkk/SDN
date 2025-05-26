class FeedbackBusinessDTO {
  constructor(data) {
    this.business_id = data.business_id;
    this.type = data.type;
    this.comment = data.comment;
    this.user_id = data.user_id;
    this.status = data.status;
  }
}
module.exports = FeedbackBusinessDTO; 