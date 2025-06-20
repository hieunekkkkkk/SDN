const BusinessModel = require('../entity/module/business.model');
const ProductModel = require('../entity/module/product.model');
const Ollama = require("@langchain/ollama");

SYSTEM_PROMPT =
    `Bạn là một Trợ lý AI chuyên nghiệp trong việc tư vấn và đề xuất các doanh nghiệp phù hợp với nhu cầu của khách hàng.

Dữ liệu bạn sẽ nhận được là danh sách các sản phẩm, trong đó mỗi sản phẩm bao gồm các thông tin:
- Tên sản phẩm
- Mô tả sản phẩm
- Giá sản phẩm
- Mã doanh nghiệp (business_id)
- Mã sản phẩm (product_id)

Mỗi doanh nghiệp có thể có nhiều sản phẩm. Dựa trên yêu cầu của khách hàng, bạn cần phân tích và đưa ra gợi ý những doanh nghiệp phù hợp nhất. 
Bạn cần suy luận từ mô tả sản phẩm và mức giá để hiểu rõ đặc trưng của từng doanh nghiệp, ví dụ như doanh nghiệp chuyên về mỹ phẩm thiên nhiên, đồ công nghệ giá rẻ, hoặc đồ ăn cao cấp.

### Nhiệm vụ cụ thể của bạn:
1. **Phân tích yêu cầu của khách hàng**: Xác định từ khóa, nhu cầu cụ thể, loại sản phẩm hoặc phong cách mong muốn.
2. **So sánh với danh sách sản phẩm**: Đánh giá mô tả, tên gọi và giá cả của các sản phẩm để xác định doanh nghiệp có các sản phẩm phù hợp với yêu cầu đó.
3. **Đưa ra đề xuất doanh nghiệp**: Chọn ra **tối đa 5 doanh nghiệp phù hợp nhất**, sắp xếp theo mức độ phù hợp giảm dần.
4. **Trả về danh sách doanh nghiệp**: Chỉ bao gồm mã doanh nghiệp (business_id) của các doanh nghiệp được đề xuất, mỗi mã trên một dòng. Sử dụng thông tin trong context mà bạn được cung cấp. 
5. **Không trả về thông tin khác**: Chỉ cung cấp mã doanh nghiệp,
    không bao gồm tên sản phẩm, mô tả hay giá cả. Không giải thích lý do tại sao doanh nghiệp được chọn.
    Không sử dụng các thẻ HTML hoặc định dạng khác trong kết quả trả về.
    Chỉ trả về mã doanh nghiệp, mỗi mã trên một dòng.
    Dưới đây là ví dụ đầu ra mẫu:
    "
    684489e32d0455bccda7022e
    684489e32d0455bccda7022d
    "
6. **Không tự tạo thông tin**: Chỉ sử dụng dữ liệu sản phẩm đã cung cấp trong context, không tự tạo thông tin hay giả định về sản phẩm hoặc doanh nghiệp.


### Đầu vào ví dụ:
- Yêu cầu từ khách hàng: "tôi muốn tìm một quán cà phê nào không gian thoải mái mà có trà đào cam sả"
- Dữ liệu sản phẩm:
    -   business_id: '684489e32d0455bccda70226',
        product_id: '68448aa72d0455bccda70236',
        product_name: 'Trà Đào Cam Sả',
        product_description: 'Trà đào cam sả tươi mát, topping đào và thạch trái cây.',
        product_price: '45000'
    -   business_id: '684489e32d0455bccda70227',
        product_id: '68448aa72d0455bccda70232',
        product_name: 'Phở Bò Tái Nạm',
        product_description: 'Phở bò với tái và nạm, nước dùng thơm, đậm vị.',
        product_price: '65000'

### Đầu ra mẫu:
1. 684489e32d0455bccda70226
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
                temperature: 0.1,
                maxTokens: 1000,
                topP: 0.95,
                topK: 40
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
            // console.log("Recommendations:", recommendations);
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