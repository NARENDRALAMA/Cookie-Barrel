# Cookie Barrel Mobile API Guide

This guide provides comprehensive documentation for integrating with the Cookie Barrel API for mobile applications (React Native, Flutter, etc.).

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Kathmandu",
    "state": "Bagmati",
    "zipCode": "44600",
    "country": "Nepal"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": { ... },
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": { ... },
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

### Products

#### Get Products

```http
GET /api/products?category=cookies&search=chocolate&page=1&limit=10&featured=true
```

**Query Parameters:**

- `category`: cookies, cakes, pastries, beverages, special, all
- `search`: search term
- `page`: page number (default: 1)
- `limit`: items per page (default: 10)
- `featured`: true/false for featured products

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Chocolate Chip Cookies",
      "description": "Delicious chocolate chip cookies",
      "price": 5.99,
      "category": "cookies",
      "image": "image_url",
      "images": ["url1", "url2"],
      "ingredients": ["flour", "chocolate", "sugar"],
      "allergens": ["gluten", "dairy"],
      "nutritionalInfo": {
        "calories": 150,
        "protein": 2,
        "carbs": 20,
        "fat": 7,
        "sugar": 10
      },
      "isAvailable": true,
      "isFeatured": true,
      "stock": 50,
      "tags": ["popular", "chocolate"],
      "preparationTime": 15,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50,
    "limit": 10
  }
}
```

### Orders

#### Get User Orders

```http
GET /api/orders?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**

- `status`: pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled
- `page`: page number
- `limit`: items per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "orderNumber": "CB000001",
      "customer": "user_id",
      "items": [
        {
          "product": {
            "_id": "product_id",
            "name": "Chocolate Chip Cookies",
            "image": "image_url",
            "price": 5.99
          },
          "quantity": 2,
          "price": 5.99,
          "specialInstructions": "Extra crispy"
        }
      ],
      "totalAmount": 11.98,
      "deliveryFee": 5.0,
      "tax": 1.2,
      "finalAmount": 18.18,
      "status": "pending",
      "paymentStatus": "pending",
      "paymentMethod": "cash",
      "deliveryAddress": {
        "street": "123 Main St",
        "city": "Kathmandu",
        "state": "Bagmati",
        "zipCode": "44600",
        "country": "Nepal",
        "coordinates": {
          "lat": 27.7172,
          "lng": 85.324
        }
      },
      "contactInfo": {
        "phone": "+1234567890",
        "email": "john@example.com"
      },
      "specialInstructions": "Ring doorbell twice",
      "estimatedDeliveryTime": "2024-01-01T12:30:00.000Z",
      "actualDeliveryTime": null,
      "whatsappMessageId": "msg_123",
      "notes": "Customer prefers morning delivery",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 3,
    "total": 25,
    "limit": 10
  }
}
```

#### Create Order

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "specialInstructions": "Extra crispy"
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Kathmandu",
    "state": "Bagmati",
    "zipCode": "44600",
    "country": "Nepal",
    "coordinates": {
      "lat": 27.7172,
      "lng": 85.3240
    }
  },
  "contactInfo": {
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "paymentMethod": "cash",
  "specialInstructions": "Ring doorbell twice"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "order_id",
    "orderNumber": "CB000001",
    "customer": "user_id",
    "items": [...],
    "totalAmount": 11.98,
    "deliveryFee": 5.00,
    "tax": 1.20,
    "finalAmount": 18.18,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "deliveryAddress": {...},
    "contactInfo": {...},
    "specialInstructions": "Ring doorbell twice",
    "estimatedDeliveryTime": "2024-01-01T12:30:00.000Z",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Get Single Order

```http
GET /api/orders/{order_id}
Authorization: Bearer <token>
```

#### Update Order Status (Admin only)

```http
PUT /api/orders/{order_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Cancel Order (Customer only)

```http
PUT /api/orders/{order_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled"
}
```

## Error Handling

All API responses follow this format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Mobile App Integration Examples

### React Native Example

```javascript
// API Service
class CookieBarrelAPI {
  constructor() {
    this.baseURL = "http://localhost:3000/api";
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Auth methods
  async login(email, password) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  // Order methods
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "cancelled" }),
    });
  }
}

export default new CookieBarrelAPI();
```

### Flutter Example

```dart
// API Service
class CookieBarrelAPI {
  static const String baseURL = 'http://localhost:3000/api';
  String? _token;

  void setToken(String token) {
    _token = token;
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  Future<Map<String, dynamic>> _request(
    String endpoint, {
    String method = 'GET',
    Map<String, dynamic>? body,
  }) async {
    final response = await http.Request(
      method,
      Uri.parse('$baseURL$endpoint'),
    )
      ..headers.addAll(_headers)
      ..body = body != null ? jsonEncode(body) : null;

    final streamedResponse = await response.send();
    final responseBody = await streamedResponse.stream.bytesToString();
    final data = jsonDecode(responseBody);

    if (streamedResponse.statusCode >= 400) {
      throw Exception(data['message'] ?? 'Request failed');
    }

    return data;
  }

  // Auth methods
  Future<Map<String, dynamic>> login(String email, String password) async {
    final data = await _request('/auth/login',
      method: 'POST',
      body: {'email': email, 'password': password},
    );
    setToken(data['token']);
    return data;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    final data = await _request('/auth/register',
      method: 'POST',
      body: userData,
    );
    setToken(data['token']);
    return data;
  }

  // Product methods
  Future<Map<String, dynamic>> getProducts({
    String? category,
    String? search,
    int page = 1,
    int limit = 10,
    bool? featured,
  }) async {
    final params = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
    };
    if (category != null) params['category'] = category;
    if (search != null) params['search'] = search;
    if (featured != null) params['featured'] = featured.toString();

    final queryString = params.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    return _request('/products?$queryString');
  }

  // Order methods
  Future<Map<String, dynamic>> getOrders({
    String? status,
    int page = 1,
    int limit = 10,
  }) async {
    final params = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
    };
    if (status != null) params['status'] = status;

    final queryString = params.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    return _request('/orders?$queryString');
  }

  Future<Map<String, dynamic>> createOrder(Map<String, dynamic> orderData) async {
    return _request('/orders', method: 'POST', body: orderData);
  }

  Future<Map<String, dynamic>> getOrder(String orderId) async {
    return _request('/orders/$orderId');
  }

  Future<Map<String, dynamic>> cancelOrder(String orderId) async {
    return _request('/orders/$orderId',
      method: 'PUT',
      body: {'status': 'cancelled'},
    );
  }
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Exceeded requests return HTTP 429 with retry-after header

## CORS Configuration

- Development: `http://localhost:3000`, `http://localhost:5173`
- Production: Configure your production domain

## WebSocket Support (Future)

Real-time order updates will be available via WebSocket connections for live order tracking.

## Support

For API support or questions, contact the development team.

