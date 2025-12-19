// Bandera - API Integration Module
// Connects frontend with backend authentication and data management

class BanderaAPI {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }

    async init() {
        try {
            await this.checkAuthStatus();
            this.updateUI();
        } catch (error) {
            console.log('User not authenticated');
        }
    }

    // Authentication Methods
    async checkAuthStatus() {
        try {
            const response = await this.makeRequest('/me', 'GET');
            this.user = response;
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            this.user = null;
            this.isAuthenticated = false;
            return false;
        }
    }

    async register(userData) {
        try {
            const response = await this.makeRequest('/register', 'POST', userData);
            this.user = response.user;
            this.isAuthenticated = true;
            this.updateUI();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async login(credentials) {
        try {
            const response = await this.makeRequest('/login', 'POST', credentials);
            this.user = response.user;
            this.isAuthenticated = true;
            this.updateUI();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await this.makeRequest('/logout', 'POST');
            this.user = null;
            this.isAuthenticated = false;
            this.updateUI();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // User Methods
    async getUserProfile(username) {
        return this.makeRequest(`/users/${username}`, 'GET');
    }

    async updateUserProfile(userData) {
        return this.makeRequest('/me', 'PUT', userData);
    }

    // Posts Methods
    async getPosts(category = 'all', limit = 20, offset = 0) {
        const params = new URLSearchParams({
            category,
            limit,
            offset
        });
        return this.makeRequest(`/posts?${params}`, 'GET');
    }

    async createPost(postData) {
        const formData = new FormData();
        
        if (postData.image) {
            formData.append('image', postData.image);
        }
        if (postData.caption) {
            formData.append('caption', postData.caption);
        }
        if (postData.category) {
            formData.append('category', postData.category);
        }
        if (postData.location) {
            formData.append('location', postData.location);
        }

        return this.makeRequest('/posts', 'POST', formData, true);
    }

    async likePost(postId) {
        return this.makeRequest(`/posts/${postId}/like`, 'POST');
    }

    async unlikePost(postId) {
        return this.makeRequest(`/posts/${postId}/like`, 'DELETE');
    }

    // Comments Methods
    async getComments(postId) {
        return this.makeRequest(`/posts/${postId}/comments`, 'GET');
    }

    async createComment(postId, content) {
        return this.makeRequest(`/posts/${postId}/comments`, 'POST', { content });
    }

    // Achievements Methods
    async getAchievements() {
        return this.makeRequest('/achievements', 'GET');
    }

    async getUserAchievements(userId) {
        return this.makeRequest(`/users/${userId}/achievements`, 'GET');
    }

    // Utility Methods
    async makeRequest(endpoint, method = 'GET', data = null, isFormData = false) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method,
            credentials: 'include'
        };

        if (data && !isFormData) {
            options.headers = {
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify(data);
        } else if (data && isFormData) {
            options.body = data;
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Request failed');
        }

        return result;
    }

    updateUI() {
        // Update navigation based on authentication status
        const authButtons = document.querySelectorAll('.auth-button');
        const userMenu = document.querySelector('.user-menu');
        const loginButton = document.getElementById('loginButton');
        const registerButton = document.getElementById('registerButton');
        const logoutButton = document.getElementById('logoutButton');
        const usernameDisplay = document.getElementById('usernameDisplay');

        if (this.isAuthenticated && this.user) {
            // Show user menu, hide auth buttons
            if (loginButton) loginButton.style.display = 'none';
            if (registerButton) registerButton.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'block';
            if (usernameDisplay) {
                usernameDisplay.textContent = this.user.username;
                usernameDisplay.style.display = 'block';
            }

            // Update profile info if on profile page
            this.updateProfileInfo();
        } else {
            // Show auth buttons, hide user menu
            if (loginButton) loginButton.style.display = 'block';
            if (registerButton) registerButton.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (usernameDisplay) usernameDisplay.style.display = 'none';
        }
    }

    updateProfileInfo() {
        if (!this.user) return;

        // Update profile page with current user data
        const profileName = document.querySelector('.profile-name');
        const profileBio = document.querySelector('.profile-bio');
        const profileLocation = document.querySelector('.profile-location');

        if (profileName) profileName.textContent = this.user.fullName || this.user.username;
        if (profileBio) profileBio.textContent = this.user.bio || '';
        if (profileLocation) profileLocation.textContent = this.user.location || '';
    }
}

// Authentication UI Components
class AuthUI {
    constructor(api) {
        this.api = api;
        this.init();
    }

    init() {
        this.createAuthModals();
        this.bindEvents();
    }

    createAuthModals() {
        // Login Modal
        const loginModal = document.createElement('div');
        loginModal.id = 'loginModal';
        loginModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        loginModal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-gray-900">Welcome Back</h3>
                    <button onclick="authUI.hideLoginModal()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <form id="loginForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username or Email</label>
                        <input type="text" id="loginUsername" required 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="loginPassword" required 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Sign In
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <p class="text-gray-600">Don't have an account?</p>
                    <button onclick="authUI.showRegisterModal()" class="text-green-600 font-semibold hover:text-green-700">
                        Create Account
                    </button>
                </div>
            </div>
        `;

        // Register Modal
        const registerModal = document.createElement('div');
        registerModal.id = 'registerModal';
        registerModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        registerModal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-gray-900">Join Bandera</h3>
                    <button onclick="authUI.hideRegisterModal()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <form id="registerForm" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input type="text" id="registerUsername" required 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input type="text" id="registerFullName" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="registerEmail" required 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="registerPassword" required minlength="6"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input type="text" id="registerLocation" placeholder="Addis Ababa, Ethiopia"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea id="registerBio" rows="3" placeholder="Tell us about your connection to Ethiopian culture..."
                                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"></textarea>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Create Account
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <p class="text-gray-600">Already have an account?</p>
                    <button onclick="authUI.showLoginModal()" class="text-green-600 font-semibold hover:text-green-700">
                        Sign In
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(loginModal);
        document.body.appendChild(registerModal);
    }

    bindEvents() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }

        // Register form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }

        // Logout button
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.api.logout();
            });
        }
    }

    async handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await this.api.login({ username, password });
            this.hideLoginModal();
            this.showSuccessMessage('Welcome back! 🎉');
        } catch (error) {
            this.showErrorMessage(error.message || 'Login failed. Please try again.');
        }
    }

    async handleRegister() {
        const userData = {
            username: document.getElementById('registerUsername').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            fullName: document.getElementById('registerFullName').value,
            location: document.getElementById('registerLocation').value,
            bio: document.getElementById('registerBio').value
        };

        try {
            const response = await this.api.register(userData);
            this.hideRegisterModal();
            this.showSuccessMessage('Account created successfully! 🎊');
        } catch (error) {
            this.showErrorMessage(error.message || 'Registration failed. Please try again.');
        }
    }

    showLoginModal() {
        this.hideRegisterModal();
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            anime({
                targets: modal.querySelector('.bg-white'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }

    hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showRegisterModal() {
        this.hideLoginModal();
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.remove('hidden');
            anime({
                targets: modal.querySelector('.bg-white'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }

    hideRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        anime({
            targets: messageDiv,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });

        setTimeout(() => {
            anime({
                targets: messageDiv,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => messageDiv.remove()
            });
        }, 3000);
    }
}

// Initialize API and Auth UI
let banderaAPI;
let authUI;

document.addEventListener('DOMContentLoaded', function() {
    banderaAPI = new BanderaAPI();
    authUI = new AuthUI(banderaAPI);
    
    // Add auth buttons to navigation if they don't exist
    addAuthButtonsToNavigation();
});

function addAuthButtonsToNavigation() {
    const nav = document.querySelector('nav .flex.items-center.space-x-4');
    if (nav && !document.getElementById('authButtons')) {
        const authButtonsDiv = document.createElement('div');
        authButtonsDiv.id = 'authButtons';
        authButtonsDiv.className = 'flex items-center space-x-4';
        authButtonsDiv.innerHTML = `
            <button id="loginButton" onclick="authUI.showLoginModal()" 
                    class="bg-transparent text-white px-4 py-2 rounded-full border border-white hover:bg-white hover:text-green-700 transition-colors">
                Login
            </button>
            <button id="registerButton" onclick="authUI.showRegisterModal()" 
                    class="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors">
                Sign Up
            </button>
            <div id="usernameDisplay" class="hidden text-white font-semibold"></div>
            <button id="logoutButton" onclick="banderaAPI.logout()" 
                    class="hidden bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors">
                Logout
            </button>
        `;
        nav.appendChild(authButtonsDiv);
    }
}

// Export for global access
window.banderaAPI = banderaAPI;
window.authUI = authUI;