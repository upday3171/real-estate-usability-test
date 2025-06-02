/**
 * 通用工具函數庫
 * 提供跨頁面共用的功能
 */

const CommonUtils = {
    /**
     * 顯示提示訊息
     * @param {string} message - 訊息內容
     * @param {string} type - 訊息類型 (info, success, warning, error)
     * @param {number} duration - 顯示時間（毫秒）
     */
    showToast: function(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;
        
        const colors = {
            info: '#2563eb',
            success: '#059669',
            warning: '#f59e0b',
            error: '#dc2626'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    /**
     * 顯示確認對話框
     * @param {string} message - 確認訊息
     * @param {function} onConfirm - 確認回調函數
     * @param {function} onCancel - 取消回調函數
     */
    confirm: function(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h5>確認操作</h5>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary cancel-btn">取消</button>
                    <button class="btn btn-primary confirm-btn">確認</button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);

        // 事件監聽
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            this.closeModal(modal);
            if (onCancel) onCancel();
        });

        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            this.closeModal(modal);
            if (onConfirm) onConfirm();
        });

        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal(modal);
            if (onCancel) onCancel();
        });
    },

    /**
     * 關閉模態框
     * @param {HTMLElement} modal - 模態框元素
     */
    closeModal: function(modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    },

    /**
     * 頁面導航
     * @param {string} url - 目標URL
     * @param {boolean} replace - 是否替換當前歷史記錄
     */
    navigateTo: function(url, replace = false) {
        if (replace) {
            window.location.replace(url);
        } else {
            window.location.href = url;
        }
    },

    /**
     * 格式化日期
     * @param {Date|string} date - 日期對象或字符串
     * @param {string} format - 格式化模式
     */
    formatDate: function(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes);
    },

    /**
     * 格式化貨幣
     * @param {number} amount - 金額
     * @param {string} currency - 貨幣符號
     */
    formatCurrency: function(amount, currency = 'NT$') {
        return `${currency}${amount.toLocaleString()}`;
    },

    /**
     * 本地存儲工具
     */
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },

        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },

        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },

        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        }
    },

    /**
     * 防抖函數
     * @param {function} func - 要防抖的函數
     * @param {number} wait - 等待時間
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 節流函數
     * @param {function} func - 要節流的函數
     * @param {number} limit - 限制時間
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 驗證工具
     */
    validate: {
        email: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        phone: function(phone) {
            const regex = /^09\d{2}-?\d{3}-?\d{3}$/;
            return regex.test(phone.replace(/-/g, ''));
        },

        required: function(value) {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        }
    }
};

// 添加全局CSS樣式
if (!document.querySelector('#common-styles')) {
    const style = document.createElement('style');
    style.id = 'common-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            position: relative;
            animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
            padding: 20px 20px 10px;
            border-bottom: 1px solid #eee;
        }
        .modal-header h5 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        .modal-body {
            padding: 20px;
        }
        .modal-body p {
            margin: 0;
            line-height: 1.5;
        }
        .modal-footer {
            padding: 10px 20px 20px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        .modal-footer .btn {
            padding: 8px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .modal-footer .btn-secondary {
            background: #f8f9fa;
            color: #666;
        }
        .modal-footer .btn-primary {
            background: #2563eb;
            color: white;
        }
        .modal-footer .btn:hover {
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(style);
}
