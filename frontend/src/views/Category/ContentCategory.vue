<template>
  <div>
    <b-row v-if="isBusy">
      <b-col md="12" class="text-center loading-page">
        <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col md=12 v-if="getProducts.length === 0">
        <div class="category-empty">
          <h3>Barang sedang kosong pada kategori ini</h3>
        </div>
      </b-col>
      <b-col md="3" v-else class="mb-4 res-2mobile res-3pad" v-for="product in getProducts" :key="product.id">
        <b-card class="card-product" @click="goDetailProduct(product.id)" :img-src="product.image_url" img-top>
          <div class="content-bottom">
            <div class="product-name">
              <h5>{{ product.name }}</h5>
            </div>
            <p class="product-category">{{ product.Category.name }}</p>
            <h6 class="product-price">{{ toIDRprice(product.price) }}</h6>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ['catname', 'id'],
  data(){
    return {}
  },
  created(){
    this.getAllProducts()
  },
  computed: {
    getProducts(){
      let productsByCategory = this.$store.state.products.filter(el => {
        return el.CategoryId === this.id
      })
      return productsByCategory
    },
    isBusy(){
      return this.$store.state.isBusy
    }
  },
  watch: {
    id(){
      this.getAllProducts()
    }
  },
  methods: {
    getAllProducts(){
      this.$store.dispatch('getProducts')
    },
    goDetailProduct(id){
      this.$router.push({ name: `ProductDetail`, params: { id: id }})
    },
    toIDRprice(price){
      let resultPrice = ''
      let strPrice = String(price)
      for(let j = 0; j < strPrice.length; j++){
        if((strPrice.length - j) % 3 === 0 && j !== 0){
          resultPrice += '.' + strPrice[j]
        }else{
          resultPrice += strPrice[j]
        }
      }
      return `Rp. ${resultPrice}`
    }
  }
}
</script>

<style>

</style>