// 账号格式校验函数
function validateUsername(username) {
    // console.log("validateUsername called with:", username);
    // 长度 3~6
    if (username.length < 3 || username.length > 6) {
        return "账号长度需为3~6位";
    }
    // 不允许包含 admin（不区分大小写）
    if (/admin/i.test(username)) {
        return "账号不能包含敏感词admin";
    }
    return "";
}

// 获取元素
const usernameInput = document.getElementById('username');
const usernameMsg = document.getElementById('username-error');
const loginForm = document.querySelector('form');

if (usernameInput) {
    // 输入时实时校验
    usernameInput.addEventListener('input', function() {
        // console.log("input event triggered, value:", usernameInput.value);
        const msg = validateUsername(usernameInput.value);
        usernameMsg.textContent = msg;
        if (msg) {
            usernameMsg.style.color = 'white';
        } else {
            usernameMsg.style.color = 'white';
            usernameMsg.textContent = '账号格式正确';
        }
    });
}

if (loginForm) {
    // 表单提交时校验
    loginForm.addEventListener('submit', function(e) {
        const msg = validateUsername(usernameInput.value);
        if (msg) {
            usernameMsg.textContent = msg;
            usernameMsg.style.color = 'white';
            usernameInput.focus();
            e.preventDefault();
        }
    });
}

// 密码显示/隐藏功能
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');

if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePasswordBtn.textContent = isPassword ? '' : '👁';
    });
}