const BusinessModel = require('../entity/module/business.model');
const ProductModel = require('../entity/module/product.model');
const Ollama = require("@langchain/ollama");

SYSTEM_PROMPT =
    `Bạn là một Trợ lý AI chuyên nghiệp, có nhiệm vụ tư vấn và đề xuất *doanh nghiệp* dựa trên dữ liệu sản phẩm đã được cung cấp bên trong hệ thống và yêu cầu cụ thể của khách hàng. CHỈ TRẢ VỀ BUSINESS_ID.

###QUY TẮC NGHIÊM NGẶT:
1. CHỈ đọc dữ liệu products được cung cấp
2. CHỈ trả về business_id, KHÔNG thêm bất kỳ text nào khác
3. KHÔNG giải thích, KHÔNG gợi ý, KHÔNG hỏi thêm
4. KHÔNG tự tạo ra thông tin mới

### Dữ liệu đầu vào
Bạn sẽ nhận được trong context:
- Một *danh sách sản phẩm*, mỗi phần tử bao gồm:
  - business_id (string): Mã định danh doanh nghiệp  
  - product_id (string): Mã định danh sản phẩm  
  - product_name (string): Tên sản phẩm  
  - product_description (string): Mô tả chi tiết  
  - product_price (string hoặc number): Giá sản phẩm (VNĐ)  

### Mục tiêu
Trên cơ sở yêu cầu của khách hàng, bạn phải lựa chọn ra tối đa *5 doanh nghiệp* (business_id) phù hợp nhất, xếp theo thứ tự độ tương thích giảm dần, và chỉ trả về *mã doanh nghiệp*, mỗi mã trên một dòng.

### Hướng dẫn chi tiết

1. *Hiểu rõ yêu cầu khách hàng*  
   - Tách thấu các yếu tố:  
     - *Loại sản phẩm* (ví dụ: cà phê, mỹ phẩm, phụ kiện công nghệ…)  
     - *Đặc tính mong muốn* (ví dụ: không gian thoải mái, hữu cơ, giá rẻ, cao cấp…)  
     - *Khoảng giá* hoặc *ngân sách* (nếu khách hàng chỉ định)  
     - *Yếu tố phụ* (ví dụ: có topping trái cây, phục vụ tại chỗ, giao hàng tận nơi…)

2. *Phân tích và gán điểm*  
   - So sánh từng sản phẩm với yêu cầu qua:  
     - *Tên sản phẩm* và *mô tả*: tìm từ khóa trùng khớp hoặc tương đương (đồng nghĩa, biến thể ngôn ngữ).  
     - *Giá sản phẩm*: kiểm tra xem trong khoảng ngân sách hay ưu tiên giá thấp/giá cao.  
     - Tính *độ liên quan* cho mỗi sản phẩm (ví dụ 0-1), sau đó lấy *điểm trung bình* cho mỗi doanh nghiệp dựa trên các sản phẩm của họ.  

3. *Chọn lọc và xếp hạng doanh nghiệp*  
   - Lọc ra các doanh nghiệp có điểm trung bình cao nhất.  
   - Nếu có nhiều doanh nghiệp ngang điểm, ưu tiên doanh nghiệp có *số lượng sản phẩm phù hợp lớn hơn*.  
   - Chỉ giữ *5 doanh nghiệp* có thứ tự cao nhất.  

4. *Định dạng kết quả*  
   - Trả về duy nhất business_id, mỗi dòng một mã.  
   - *Không* kèm theo bất cứ thông tin thuyết minh, tên sản phẩm, mô tả hay giá cả.  
   - *Không* sử dụng HTML, Markdown, hay ký tự đặc biệt khác.  

5. *Xử lý trường hợp đặc biệt*  
   - Nếu *không tìm thấy* doanh nghiệp nào phù hợp, trả về một dòng duy nhất chứa chuỗi trống hoặc null.  
   - Nếu số doanh nghiệp phù hợp *< 5*, chỉ liệt kê những doanh nghiệp đó.  

6. *Ví dụ*  
   - *Yêu cầu*: “Tôi muốn quán trà hữu cơ, giá tầm 40-60k, không gian yên tĩnh.”  
   - *Đầu ra*:
     
     6874bef6413e817b336a2ffd
     6874c1ef413e817b336a300a
     6874c1e1413e817b336a3009
     
*KHÔNG ĐƯỢC XUẤT HIỆN*
- Giải thích
- Gợi ý
- Câu hỏi
- Markdown
- Dấu gạch ngang
- Số thứ tự
- Bất kỳ text nào khác ngoài business_id


*QUY TẮC CƠ BẢN*  
 - Chỉ sử dụng dữ liệu đã được cung cấp.
 - Cung cấp dữ liệu output trong phạm vi dữ liệu đã được cung cấp.
 - Đầu ra chỉ bao gồm business_id, mỗi mã trên một dòng, không có bất kỳ thông tin bổ sung nào khác, nếu không có doanh nghiệp nào phù hợp thì trả về một dòng duy nhất chứa chuỗi trống hoặc null.
 - Không thêm thắt hay suy luận thông tin bên ngoài.
 - Luôn ưu tiên tính chính xác và ngắn gọn trong kết quả.
 - Nếu không hiểu rõ yêu cầu, hãy trả về một kết quả gần giống với yêu cầu nhất có thể, nhưng vẫn đảm bảo tuân thủ các quy tắc trên.
 - không được trả về lỗi, luôn phải trả về kết quả theo định dạng đã nêu, luôn phải có kết quả trả về, hỏi đồ uống phải trả về các quán cà phê, hỏi đồ ăn phải trả về các quán ăn, hỏi đồ ăn vặt phải trả về các quán ăn vặt, hỏi đồ uống có cồn phải trả về các quán bar, pub, beer club, hỏi đồ ăn nhanh phải trả về các quán fast food, hỏi nhà hàng phải trả về các nhà hàng.
`
function extractRecommendation(responseText) {
    const thinkTagEnd = responseText.indexOf("</think>");
    if (thinkTagEnd !== -1) {
        return responseText.slice(thinkTagEnd + "</think>".length).trim();
    } else {
        // Fallback nếu không tìm thấy tag
        return responseText.trim();
    }
}

class AiService {
    // Helper method to get all businesses
    async getAllBusinesses() {
        try {
            return await BusinessModel.find().lean().populate('business_category_id'); // Use .lean() for plain JS objects
        } catch (error) {
            throw new Error(`Error fetching businesses: ${error.message}`);
        }
    }

    // Helper method to get all products
    async getAllProducts() {
        try {
            return await ProductModel.find().lean();
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    // Main method to get businesses with their products
    async getAllBusinessWithProducts() {
        try {
            const businesses = await this.getAllBusinesses();
            const products = await this.getAllProducts();

            return businesses.map(business => ({
                "business_id": business._id,
                "business_name": business.business_name,
                "business_address": business.business_address,
                "business_detail": business.business_detail,
                "business_status": business.business_status,
                "business_image": business.business_image,
                "business_category": business.business_category_id.category_name,
                "products": products.filter(product =>
                    product.business_id.toString() === business._id.toString()
                ).map(product => ({
                    "product_id": product._id,
                    "product_name": product.product_name,
                    "product_description": product.product_description,
                    "product_price": product.product_price
                }))
            }));
        } catch (error) {
            throw new Error(`Error fetching businesses with products: ${error.message}`);
        }
    }

    async getBussinessWithProductsById(businessId) {
        try {
            const business = await BusinessModel.findById(businessId).lean().populate('business_category_id');
            if (!business) {
                throw new Error(`Business with ID ${businessId} not found`);
            }
            const products = await ProductModel.find({ business_id: businessId }).lean();
            return {
                "business_id": business._id,
                "business_name": business.business_name,
                "business_address": business.business_address,
                "business_detail": business.business_detail,
                "business_status": business.business_status,
                "business_image": business.business_image,
                "business_category": business.business_category_id.category_name,
                "products": products.map(product => ({
                    "product_id": product._id,
                    "product_name": product.product_name,
                    "product_description": product.product_description,
                    "product_price": product.product_price
                })),
            };
        } catch (error) {
            throw new Error(`Error fetching business with products by ID ${businessId}: ${error.message}`);
        }
    }

    // async checkOllamaConnection() {
    //     try {
    //         const model = new Ollama.ChatOllama({
    //             baseUrl: "http://localhost:11434",
    //             model: "qwen3:1.7b",
    //         });
    //         // Gửi yêu cầu thử đơn giản
    //         const response = await model.invoke([
    //             {
    //                 role: "user",
    //                 content: "Ping",
    //             },
    //         ]);
    //         console.log("Kết nối tới Ollama thành công! Phản hồi:", response.content);
    //         return true;
    //     } catch (error) {
    //         console.error("Lỗi kết nối tới Ollama:", error.message);
    //         return false;
    //     }
    // }

    async getRecommendations(text) {
        try {
            // const isConnected = await this.checkOllamaConnection();
            // if (!isConnected) {
            //     throw new Error("Không thể kết nối tới Ollama server");
            // }
            const data = await this.getAllBusinessWithProducts();
            const products = data.flatMap(business =>
                business.products.map(product => ({
                    business_id: business.business_id.toString(),
                    product_id: product.product_id.toString(),
                    product_name: product.product_name,
                    product_description: product.product_description,
                    product_price: product.product_price
                }))
            );

            const model = new Ollama.ChatOllama({
                baseUrl: "https://ollama.lab105.io.vn",
                model: "qwen3:1.7b",
                temperature: 0.01,
                maxTokens: 1000,
                topP: 0.9,
                topK: 20
            });

            const response = await model.invoke([
                {
                    role: "system",
                    content: SYSTEM_PROMPT + `\n\n Dưới đây là danh sách sản phẩm:\n${JSON.stringify(products, null, 2)}`
                },
                {
                    role: "user",
                    content: `Yêu cầu của khách hàng: ${text}`
                }
            ]);
            // Here you would typically call an AI service or model to get recommendations based on the text input.            
            //Fill service AI in here
            console.log(JSON.stringify(products, null, 2));
            const recommendations = response.content;
            console.log("Recommendations:", recommendations);
            const final_recommendations = extractRecommendation(recommendations).split('\n');

            const results = await Promise.all(
                final_recommendations.map(id => this.getBussinessWithProductsById(id))
            );

            return results;
        }
        catch (error) {
            throw new Error(`Error getting recommendations: ${error.message}`);
        }
    }
}

module.exports = new AiService();