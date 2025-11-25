$(document).ready(function () {
    // 檢查是否已登入
    const user = MockData.getCurrentUser();
    if (user && ['client', 'buyer', 'admin'].includes(user.role)) {
        window.location.href = 'index.html';
    }

    $('#loginBtn').click(function () {
        const phone = $('#phone').val();
        const password = $('#password').val();

        const result = MockData.login(phone, password);
        if (result.success) {
            if (['client', 'buyer', 'admin'].includes(result.user.role)) {
                window.location.href = 'index.html';
            } else {
                $('#errorMsg').text('未知角色').removeClass('is-hidden');
            }
        } else {
            $('#errorMsg').text(result.message).removeClass('is-hidden');
        }
    });
});
