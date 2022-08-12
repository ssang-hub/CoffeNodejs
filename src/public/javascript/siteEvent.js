let quantity = document.querySelectorAll('.quantity-product');
let btn_cart = document.querySelectorAll('.cart-shopping-btn');

function minusQuantity() {
    for (let i = 0; i < quantity.length; i++) {
        if (parseInt(quantity[i].value) <= 0) {
            continue;
        } else {
            quantity[i].value = (parseInt(quantity[i].value) - 1).toString();
        }
    }
}
function plusQuantity() {
    for (let i = 0; i < quantity.length; i++) {
        quantity[i].value = (parseInt(quantity[i].value) + 1).toString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    var btn_cart = $('.cart-shopping-btn').toArray();
    var images = $('.card-img-top').toArray();
    var price = $('.price-text').toArray();
    var name = $('.product-name a').toArray();
    $('#modalProduct').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var recipient = button.data('id');
        var modal = $(this);
        modal.find('#product-id').val(recipient);
    });

    btn_cart.forEach((item, index) => {
        item.addEventListener('click', function () {
            $('#quantity-input').val('1');
            $('#image-product-modal').attr('src', images[index].getAttribute('src'));
            $('#modal-productname').text(name[index].textContent);
            $('#modal-priceproduct').text(price[index].textContent);
            $('#note-order').val('');
        });
    });
});
