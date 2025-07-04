// 个人中心页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 标签页切换功能
    initTabSwitching();
    
    // 内容筛选功能
    initContentFiltering();
    
    // 搜索功能
    initSearchFeatures();
    
    // 其他交互功能
    initOtherInteractions();
});

// 标签页切换
function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // 移除所有活跃状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 激活当前标签
            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // 加载对应内容（如果需要）
            loadTabContent(targetTab);
        });
    });
}

// 内容筛选功能
function initContentFiltering() {
    // 筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他按钮的活跃状态
            filterBtns.forEach(b => b.classList.remove('active'));
            // 激活当前按钮
            btn.classList.add('active');
            
            // 执行筛选
            const filterType = btn.textContent.trim();
            filterContent(filterType);
        });
    });
    
    // 排序选择
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortType = e.target.value;
            sortContent(sortType);
        });
    }
    
    // 关注页面的标签切换
    const followingTabs = document.querySelectorAll('.following-tabs .tab-btn');
    followingTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            followingTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabType = btn.textContent.includes('关注中') ? 'following' : 'followers';
            loadFollowingData(tabType);
        });
    });
}

// 搜索功能
function initSearchFeatures() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // 搜索按钮点击
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });
        
        // 回车搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
        
        // 实时搜索建议（可选）
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        }, 300));
    }
}

// 其他交互功能
function initOtherInteractions() {
    // 编辑资料按钮
    const editProfileBtn = document.querySelector('.btn-primary');
    if (editProfileBtn && editProfileBtn.textContent.includes('编辑资料')) {
        editProfileBtn.addEventListener('click', () => {
            openEditProfileModal();
        });
    }
    
    // 头像编辑按钮
    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', () => {
            openAvatarUploadModal();
        });
    }
    
    // 内容操作按钮
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-btn')) {
            const action = e.target.textContent.trim();
            const contentItem = e.target.closest('.content-item');
            
            if (action === '编辑') {
                editContent(contentItem);
            } else if (action === '删除') {
                deleteContent(contentItem);
            }
        }
    });
    
    // 关注/取消关注按钮
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-sm') && e.target.textContent.includes('关注')) {
            toggleFollow(e.target);
        }
    });
    
    // 收藏夹点击
    const folderItems = document.querySelectorAll('.folder-item');
    folderItems.forEach(item => {
        item.addEventListener('click', () => {
            const folderName = item.querySelector('h4').textContent;
            openFolder(folderName);
        });
    });
}

// 标签内容加载
function loadTabContent(tabType) {
    switch (tabType) {
        case 'overview':
            loadOverviewData();
            break;
        case 'contents':
            loadUserContents();
            break;
        case 'collections':
            loadCollections();
            break;
        case 'history':
            loadHistory();
            break;
        case 'following':
            loadFollowingData('following');
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// 内容筛选
function filterContent(filterType) {
    const contentItems = document.querySelectorAll('.content-item');
    
    contentItems.forEach(item => {
        const contentMeta = item.querySelector('.content-meta');
        if (!contentMeta) return;
        
        const contentType = contentMeta.textContent.toLowerCase();
        
        if (filterType === '全部') {
            item.style.display = 'block';
        } else {
            const shouldShow = contentType.includes(filterType.toLowerCase());
            item.style.display = shouldShow ? 'block' : 'none';
        }
    });
    
    // 显示动画
    animateContentItems();
}

// 内容排序
function sortContent(sortType) {
    const contentGrid = document.querySelector('.content-grid');
    const contentItems = Array.from(contentGrid.querySelectorAll('.content-item'));
    
    contentItems.sort((a, b) => {
        switch (sortType) {
            case '最新发布':
                return new Date(getContentDate(b)) - new Date(getContentDate(a));
            case '最多点赞':
                return getContentLikes(b) - getContentLikes(a);
            case '最多浏览':
                return getContentViews(b) - getContentViews(a);
            case '最多评论':
                return getContentComments(b) - getContentComments(a);
            default:
                return 0;
        }
    });
    
    // 重新排列DOM元素
    contentItems.forEach(item => contentGrid.appendChild(item));
    animateContentItems();
}

// 搜索执行
function performSearch(query) {
    console.log('搜索:', query);
    
    // 这里可以实现实际的搜索逻辑
    // 比如筛选显示的内容、高亮匹配的文本等
    
    const contentItems = document.querySelectorAll('.content-item');
    contentItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const meta = item.querySelector('.content-meta').textContent.toLowerCase();
        
        const matches = title.includes(query.toLowerCase()) || meta.includes(query.toLowerCase());
        item.style.display = matches ? 'block' : 'none';
    });
    
    // 更新搜索历史
    updateSearchHistory(query);
}

// 编辑资料模态框
function openEditProfileModal() {
    // 这里可以实现编辑资料的模态框
    alert('编辑资料功能待实现');
}

// 头像上传模态框
function openAvatarUploadModal() {
    // 这里可以实现头像上传功能
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadAvatar(file);
        }
    });
    input.click();
}

// 内容编辑
function editContent(contentItem) {
    const title = contentItem.querySelector('h4').textContent;
    console.log('编辑内容:', title);
    // 这里可以跳转到编辑页面或打开编辑模态框
}

// 内容删除
function deleteContent(contentItem) {
    const title = contentItem.querySelector('h4').textContent;
    if (confirm(`确定要删除 "${title}" 吗？`)) {
        contentItem.remove();
        showNotification('内容已删除');
    }
}

// 关注切换
function toggleFollow(button) {
    const isFollowing = button.textContent.includes('已关注');
    
    if (isFollowing) {
        button.textContent = '关注';
        button.classList.remove('btn-secondary');
        button.classList.add('btn-primary');
    } else {
        button.textContent = '已关注';
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
    }
    
    // 这里可以发送API请求更新关注状态
    showNotification(isFollowing ? '已取消关注' : '已关注');
}

// 数据加载函数（模拟）
function loadOverviewData() {
    // 加载概览数据
    console.log('加载概览数据');
}

function loadUserContents() {
    // 加载用户内容
    console.log('加载用户内容');
}

function loadCollections() {
    // 加载收藏数据
    console.log('加载收藏数据');
}

function loadHistory() {
    // 加载历史记录
    console.log('加载历史记录');
}

function loadFollowingData(type) {
    // 加载关注数据
    console.log('加载关注数据:', type);
}

function loadAnalyticsData() {
    // 加载分析数据
    console.log('加载分析数据');
    
    // 模拟加载图表
    setTimeout(() => {
        const chartPlaceholder = document.querySelector('.chart-placeholder');
        if (chartPlaceholder) {
            chartPlaceholder.innerHTML = `
                <div style="background: rgba(255,255,255,0.1); height: 200px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                    <p style="color: #ccc;">📈 数据图表区域<br/>浏览量、点赞数、评论数趋势图</p>
                </div>
            `;
        }
    }, 1000);
}

function loadSettings() {
    // 加载设置页面
    console.log('加载设置');
}

// 工具函数
function getContentDate(item) {
    const meta = item.querySelector('.content-meta').textContent;
    // 这里应该解析实际的日期
    return new Date();
}

function getContentLikes(item) {
    const stats = item.querySelector('.content-stats');
    const likesText = stats.querySelector('span').textContent;
    return parseInt(likesText.match(/\d+/)?.[0] || '0');
}

function getContentViews(item) {
    const meta = item.querySelector('.content-meta').textContent;
    const viewsMatch = meta.match(/(\d+(?:\.\d+)?K?)\s*浏览/);
    return parseFloat(viewsMatch?.[1] || '0');
}

function getContentComments(item) {
    const stats = item.querySelector('.content-stats');
    const commentSpans = stats.querySelectorAll('span');
    if (commentSpans.length >= 2) {
        return parseInt(commentSpans[1].textContent.match(/\d+/)?.[0] || '0');
    }
    return 0;
}

function animateContentItems() {
    const items = document.querySelectorAll('.content-item:not([style*="display: none"])');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function showSearchSuggestions(query) {
    // 实现搜索建议
    console.log('搜索建议:', query);
}

function hideSearchSuggestions() {
    // 隐藏搜索建议
}

function updateSearchHistory(query) {
    // 更新搜索历史
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (!history.includes(query)) {
        history.unshift(query);
        localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
    }
}

function uploadAvatar(file) {
    // 模拟头像上传
    const reader = new FileReader();
    reader.onload = (e) => {
        const avatars = document.querySelectorAll('.profile-avatar, .user-avatar');
        avatars.forEach(avatar => {
            avatar.src = e.target.result;
        });
        showNotification('头像更新成功');
    };
    reader.readAsDataURL(file);
}

function openFolder(folderName) {
    console.log('打开收藏夹:', folderName);
    // 这里可以跳转到收藏夹详情页面
}

function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.9);
        color: #000;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3秒后自动消失
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 