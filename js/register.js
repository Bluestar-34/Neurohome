// 用户名格式校验函数
function validateUsername(username) {
    if (username.length < 3 || username.length > 6) {
        return "账号长度需为3~6位";
    }
    if (/admin/i.test(username)) {
        return "账号不能包含敏感词admin";
    }
    return "";
}

const usernameInput = document.getElementById('username');
const usernameMsg = document.getElementById('username-error');
const registerForm = document.querySelector('form');

if (usernameInput) {
    usernameInput.addEventListener('input', function() {
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

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
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
        togglePasswordBtn.textContent = isPassword ? '🔒' : '👁';
    });
} 