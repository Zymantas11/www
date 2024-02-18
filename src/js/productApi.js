
const projectSecret = '65d215ca987977636bfbed0c';
const resourceName = 'products';

const axios = require('axios');

const instance = axios.create({
    baseURL: `https://${projectSecret}.mockapi.io/api/`
});

const productService = {
    list: function () {
        return instance.get(`${resourceName}`).then(response => response.data);
    },
    add: function (product) {
        return instance.post(`${resourceName}`, product).then(response => response.data);
    },
    get: function (id) {
        return instance.get(`${resourceName}/${id}`).then(response => response.data);
    },
    delete: function (id) {
        return instance.delete(`${resourceName}/${id}`).then(response => response.data);
    }
}

export default productService;
