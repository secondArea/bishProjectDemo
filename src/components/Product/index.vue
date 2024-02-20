<!-- Product.vue -->
<template>
    <div class="product">
      <div>
        <img class="image" src="../../../public/images/s-l960.jpg" :alt="product.name" />
      </div>
      <p>名称：{{ product.name }}</p>
      <p>价格：{{ product.price }}</p>
      <p>简介：{{ product.description }}</p>
      <p>库存: {{ product.inventory }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Product',
    props: {
      product: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .product {
    border: 1px solid #ccc;
    padding: 10px;
  }

  .image {
    max-width: 100%;
    height: auto;
  }
  </style>
  