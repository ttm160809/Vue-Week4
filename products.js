import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import paginationCard from './paginationCard.js';
import productsModal from './productsModal.js';
import delProductsModal from './delProductsModal.js';

const url = 'https://vue3-course-api.hexschool.io';
const myToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
axios.defaults.headers.common['Authorization'] = myToken;
const myPath = 'ttmtest';

createApp({
    data(){
        return{
            products:[],
            pages:{},
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    methods:{
        checkLogin(){
            axios.post(`${url}/v2/api/user/check`)
            .then((res) => {
                this.getProducts()
            })
            .catch((err) => {
                location.href = './index.html';
                alert(err.response.data.message);
            })
        },
        getProducts(page = 1){ // 參數預設值
            axios.get(`${url}/v2/api/${myPath}/admin/products?page=${page}`)
            .then((res) => {
                this.products = res.data.products;
                this.pages = res.data.pagination;
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        openModal(status, item){
            if (status === "new") {
                this.isNew = true;
                this.tempProduct= {
                    imagesUrl: [],
                };
                this.$refs.oModal.openProductModal()
            }else if(status === "edit"){ 
                this.isNew = false;
                this.tempProduct = { ...item };
                this.$refs.oModal.openProductModal()
            }else if(status === "del"){ 
                this.tempProduct = { ...item };
                this.$refs.dModal.openDelProductModal()
            }
        },
        updateProduct(){
            let updateStatus = "post";
            let updateUrl = `${url}/v2/api/${myPath}/admin/product`

            if (this.isNew === false) {
                updateStatus = "put";
                updateUrl = `${url}/v2/api/${myPath}/admin/product/${this.tempProduct.id}`
            }

            axios[updateStatus]( updateUrl, { data: this.tempProduct } )
            .then((res) => {
                alert(res.data.message);
                this.$refs.oModal.closeProductModal()
                this.getProducts();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        deleteProduct(){
            axios.delete( `${url}/v2/api/${myPath}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct } )
            .then((res) => {
                alert(res.data.message);
                this.$refs.dModal.closeDelProductModal()
                this.getProducts();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        createImages(){
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('')
        }
    },
    mounted(){
        this.checkLogin();
    },
    components:{
        paginationCard,
        productsModal,
        delProductsModal
    }
}).mount('#app')