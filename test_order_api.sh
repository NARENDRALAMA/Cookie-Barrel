#!/bin/bash

# Test Order API with curl
# This script tests the POST /api/orders endpoint

BASE_URL="http://192.168.1.75:5001/api"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGZmNWI0MmZhYWVlMWZjNGY0MTY1YWEiLCJpYXQiOjE3NjE5MTY1ODcsImV4cCI6MTc2MjUyMTM4N30.p-YAGEr7dtBVw8H5aGYH3vCyPjQTY-I3-DlILmsRk-Q"
PRODUCT_ID="6904a857517276afcdf34cbd"

echo "========================================="
echo "Testing Order API - Create Order"
echo "========================================="
echo ""

echo "Request Details:"
echo "  URL: ${BASE_URL}/orders"
echo "  Method: POST"
echo "  Product ID: ${PRODUCT_ID}"
echo "  Quantity: 1"
echo ""

curl -X POST "${BASE_URL}/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d "{
    \"items\": [
      {
        \"productId\": \"${PRODUCT_ID}\",
        \"quantity\": 1
      }
    ],
    \"deliveryAddress\": {
      \"street\": \"Sanothimi\",
      \"city\": \"Bhaktapur\",
      \"state\": \"Bagmati\",
      \"zipCode\": \"44800\"
    },
    \"contactInfo\": {
      \"phone\": \"9860137220\",
      \"email\": \"kc.suhant@gmail.com\"
    },
    \"paymentMethod\": \"cash\",
    \"specialInstructions\": \"Test order from curl\",
    \"notes\": \"Test order from curl\"
  }" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s -S | jq '.' 2>/dev/null || cat

echo ""
echo "========================================="

