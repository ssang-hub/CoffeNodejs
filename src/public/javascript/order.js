document.addEventListener('DOMContentLoaded', function () {
    var delete_order = $('.delete-order-btn');
    var confirm_delete = $('#confirm-delete');
    var delete_order_form = $('#delete-order-form');
    var delete_order_input = $('#delete-order-input');
    var delete_order_status = $('#delete-order-status');
    var status_order = $('.status-order');
    var confirm_delivered = $('.confirmDelivered');
    var confirm_order_input = $('#confirm-order-input');
    var confirm_order_form = $('#confirm-order-form');
    var confirm_submit = $('#confirm-submit');

    confirm_delivered.click(function () {
        confirm_order_input.val($(this).attr('data-idOrder'));
        confirm_submit.click(function () {
            confirm_order_form.submit();
        });
    });
    // order step variable
    var step0 = $('.step-0');
    var step1 = $('.step-1');
    var step2 = $('.step-2');
    var step3 = $('.step-3');
    //Click button delete order
    delete_order.click(function () {
        var id = $(this).attr('data-idOrder');
        var status = $(this).attr('data-Status');

        // confirm delete order
        confirm_delete.click(function () {
            delete_order_input.val(id);
            delete_order_status.val(status);
            delete_order_form.submit();
        });
    });

    status_order.each(function (index) {
        if ($(this).val() == 'Giao hàng thành công') {
            step3[index].classList.add('status-active');
        } else if ($(this).val() == 'Đang giao hàng') {
            step2[index].classList.add('status-active');
        } else if ($(this).val() == 'Chuẩn bị sản phẩm') {
            step1[index].classList.add('status-active');
        } else {
            step0[index].classList.add('status-active');
        }
    });

    //show status order
});
