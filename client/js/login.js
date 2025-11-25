$(document).ready(function () {
    // 檢查是否已登入
    const user = MockData.getCurrentUser();
    if (user && user.role === 'client') {
        window.location.href = 'index.html';
    }

    $('#loginBtn').click(function () {
        const phone = $('#phone').val();
        const password = $('#password').val();

        const result = MockData.login(phone, password);
        if (result.success) {
            if (result.user.role === 'client') {
                window.location.href = 'index.html';
            } else {
                $('#errorMsg').text('請透過管理員入口登入').removeClass('is-hidden');
            }
        } else {
            $('#errorMsg').text(result.message).removeClass('is-hidden');
        }
    });
});
