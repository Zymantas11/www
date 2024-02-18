import _ from 'lodash';
import '../scss/style.scss'
import * as bootstrap from 'bootstrap'
import productService  from "./productApi.js";

$(function () {
    loadProductListPage();
    $('#addProductPage').on('click', loadAddProductPage);
    $('#productListPage').on('click', loadProductListPage);
}());

function loadAddProductPage() {
    var $pageContent = $('#pageContent');
    $pageContent.html('');
    $pageContent.append(addMessage('Product successfully added.'));
    var $form = $('<form>', { style: 'width: 50%;' });
    $form.append(addField('productTitle', 'text', 'Title'));
    $form.append(addField('productPrice', 'text', 'Price'));
    $form.append(addField('productImgUrl', 'text', 'Image Url'));
    $form.append(addField('productDescription', 'text', 'Description'));
    $form.append(addField('productSalesLocation', 'text', 'Sales Location'));
    $form.append($('<button>', { type: 'submit', class: 'btn btn-primary', id: "submitFormButton" }).text('Submit'));
    $form.submit(function (e) {
        e.preventDefault();
        var product = {
            title: $(this).find('#productTitle').val(),
            price: $(this).find('#productPrice').val(),
            imgUrl: $(this).find('#productImgUrl').val(),
            description: $(this).find('#productDescription').val(),
            salesLocation: $(this).find('#productSalesLocation').val(),
        }
        $form[0].reset();
        productService.add(product).then(function (product) {
            $('#successMessage').show();
        });
    });

    $pageContent.append($form);
}

function addField(id, type, title) {
    var $fieldContainer = $('<div>', { class: 'mb-3' });
    $fieldContainer.append($('<label>', { for: id, class: 'form-label' }).text(title));
    $fieldContainer.append($('<input>', { type: type, class: 'form-control', id: id, required: 'required' }));
    return $fieldContainer;
}

function sortByPrice(thisProduct, thatProduct) {
    var thisPrice = Number(thisProduct.price);
    var thatPrice = Number(thatProduct.price);
    return ((thisPrice < thatPrice) ? -1 : ((thisPrice > thatPrice) ? 1 : 0));
}

function loadProductListPage() {
    var $pageContent = $('#pageContent');
    var $productListContainer = $('<div>', { class: 'row g-5' });
    productService.list().then(function (products) {
        products.sort(sortByPrice);

        $pageContent.html('');
        for (var index = 0; index < products.length; index++) {
            var product = products[index];
            $productListContainer.append(loadProduct(product));
        }
        $pageContent.append($productListContainer);
    });
}

function loadProduct(product) {
    var $card = $('<div>', { class: 'card product' });
    var $cardBody = $('<div>', { class: 'card-body' });
    $cardBody.append($('<img>', { src: product.imgUrl,  class: 'img-thumbnail float-start mx-3' }));
    $cardBody.append($('<h5>', { class: 'card-title' }).text(product.title));
    $cardBody.append($('<h6>', { class: 'card-subtitle' }).text(product.price));
    $cardBody.on('click', function () {
        loadFullProductPage(product.id);
    })
    $card.append($cardBody);
    return $('<div>', { class: 'col-sm-6' }).append($card);
}

function loadFullProductPage(id) {
    var $pageContent = $('#pageContent');

    var $productListContainer = $('<div>', { class: 'row g-5' });
    productService.get(id).then(function (product) {
        $pageContent.html('');
        $pageContent.append(addMessage('Product successfully deleted.'));
        var $card = $('<div>', {class: 'card product'});
        var $cardBody = $('<div>', {class: 'card-body'});
        $cardBody.append($('<img>', {src: product.imgUrl, class: 'img-thumbnail float-start mx-3'}));
        $cardBody.append($('<h5>', {class: 'card-title'}).text(product.title));
        $cardBody.append($('<h6>', {class: 'card-subtitle'}).text(product.price));
        $cardBody.append($('<span>', {class: 'card-text'}).text(product.description));
        $cardBody.append($('<p>', {class: 'card-text'}).text(product.salesLocation));
        $card.append($cardBody);
        $pageContent.append($productListContainer.append($('<div>', {class: 'col-sm-6'}).append($card)));

        var $backButton = $('<button>', { type: 'button', class: 'btn btn-outline-primary', text: 'Back', style: 'margin-right: 6px;' });
        $backButton.on('click', loadProductListPage);
        var $deleteButton = $('<button>', { type: 'button', class: 'btn btn-danger', text: 'Delete', id: 'deleteButton' });
        $deleteButton.on('click', function () {
            productService.delete(id).then(function (product) {
                $('.product').remove();
                $('#deleteButton').remove();
                $('#successMessage').show();
            });
        });
        var $actions = $('<div>', { class: 'mt-3' });
        $actions.append($backButton);
        $actions.append($deleteButton);

        $pageContent.append($actions);
    });
}

function addMessage(text) {
    return $('<div>', { id: 'successMessage', class: 'alert alert-success', role: 'alert', text: text, style: 'display: none;' });
}