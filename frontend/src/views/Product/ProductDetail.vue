<template>
  <div class="container mt-5 mb-5">
    <div class="product-detail">
      <b-row v-if="isBusy">
        <b-col md="12" class="text-center loading-page">
          <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col md="4">
          <div class="image-detail-product" v-if="detailProduct !== null">
            <img :src="detailProduct.image_url">
          </div>
        </b-col>
        <b-col md="8">
          <div class="content-detail-product" v-if="detailProduct !== null">
            <h1 class="title-detail-product">{{ detailProduct.name }}</h1>
            <h1 class="price-detail-product">{{ toIDRprice }}</h1>
            <div class="cat-detail mb-3">
              <span>Category : </span>
              <span class="cat-detail-product mr-3">{{ categoryUppercase }}</span>
            </div>
            <div class="cat-detail mb-3">
              <span>Status : </span>
              <span class="cat-detail-product">{{ detailProduct.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK' }}</span>
            </div>
            <b-button class="btn-beli mt-3 mr-2" size="lg" @click="doAddCart(detailProduct.id)"><i class="fa fa-shopping-cart"></i>&nbsp;Masukan Keranjang</b-button>
            <b-button class="mt-3" variant="dark" size="lg" @click="backHome"><i class="fa fa-chevron-circle-left"></i>&nbsp;Kembali Belanja</b-button>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { url } from '@/mixins/mixins'

export default {
  props: ['id'],
  mixins: [url],
  data(){
    return {
      detailProduct: null,
      isBusy: false
    }
  },
  created() {
    this.getDetailProduct()
  },
  computed: {
    categoryUppercase(){
      if(this.detailProduct !== null){
        return this.detailProduct.Category.name.toUpperCase()
      }
    },
    toIDRprice(){
      if(this.detailProduct !== null){
        let resultPrice = ''
        let strPrice = String(this.detailProduct.price)
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
  },
  methods: {
    doAddCart(id){
      if(!localStorage.getItem('token')){
        this.$store.commit('SET_MODAL', true)
      }else{
        const token = localStorage.getItem('token')
        const user_id = JSON.parse(localStorage.getItem('user')).id
        let objAddCart = {
          UserId: user_id,
          ProductId: id
        }
        axios.post(`${this.url}/cart`, objAddCart, {
          headers: { Bearer : token }
        })
        .then(res => {
          this.$vToastify.notifSuccess('Berhasil ditambah ke keranjang', 'Yeay!')
          this.$router.push({ name: 'Cart' })
        })
        .catch(err => {
          this.$vToastify.notifError('Gagal masukan cart', 'Gagal!')
        })
      }
    },
    backHome(){
      this.$router.push({ name: 'Home' })
    },
    getDetailProduct(){
      this.isBusy = true
      axios.get(`${this.url}/product/${this.id}`)
      .then(res => {
        this.isBusy = false
        this.detailProduct = res.data.payload
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
}
</script>

<style scoped>

</style>