// Bandera - Main JavaScript File
// Comprehensive social media functionality with Ethiopian cultural focus

// Global Variables
let currentFilter = 'all';
let likedPosts = new Set();
let savedPosts = new Set();
let currentStoryIndex = 0;
let stories = [];

// Cultural Content Data
const culturalContent = [
    {
        id: 1,
        username: 'ethiopian_chef',
        avatar: 'https://kimi-web-img.moonshot.cn/img/www.aspicyperspective.com/2168ff4c61b40edfb9a32b5cf1862bddf3c76809.jpg',
        image: 'https://kimi-web-img.moonshot.cn/img/www.aspicyperspective.com/2168ff4c61b40edfb9a32b5cf1862bddf3c76809.jpg',
        caption: 'Traditional Doro Wat with fresh injera! The secret is in the berbere spice blend passed down from my grandmother. 🇪🇹 #EthiopianFood #DoroWat',
        category: 'food',
        likes: 234,
        comments: 42,
        timeAgo: '2 hours ago',
        location: 'Addis Ababa'
    },
    {
        id: 2,
        username: 'habesha_style',
        avatar: 'https://kimi-web-img.moonshot.cn/img/ethiopiantraditionaldress.com/8d13b3bbba824075c84ac361e5917c4db12fd681.jpg',
        image: 'https://kimi-web-img.moonshot.cn/img/ethiopiantraditionaldress.com/2b629da67436a1f7fdf7f1bdf369341be47ae3e1.jpg',
        caption: 'Modern interpretation of traditional Habesha Kemis. The intricate embroidery tells stories of our heritage. ✨ #HabeshaFashion #EthiopianStyle',
        category: 'fashion',
        likes: 189,
        comments: 28,
        timeAgo: '4 hours ago',
        location: 'Lalibela'
    },
    {
        id: 3,
        username: 'coffee_master',
        avatar: 'https://kimi-web-img.moonshot.cn/img/www.citymarket.coop/010fe882efe880603d422ec48c1624dd649bb1c2.jpg',
        image: 'https://kimi-web-img.moonshot.cn/img/blog.compassion.com/8f5b11825fe2e1fa7bbeb168341216858cbd7c0c.jpg',
        caption: 'Morning coffee ceremony with friends. The aroma of freshly roasted beans fills the air. This is what community feels like. ☕ #EthiopianCoffee #CoffeeCeremony',
        category: 'coffee',
        likes: 312,
        comments: 56,
        timeAgo: '6 hours ago',
        location: 'Gondar'
    },
    {
        id: 4,
        username: 'ethiopia_explorer',
        avatar: 'https://kimi-web-img.moonshot.cn/img/cdn1.matadornetwork.com/34e8fb0fca6ec772e1b667feb1076a35b0f4dfcd.jpg',
        image: 'https://kimi-web-img.moonshot.cn/img/cdn1.matadornetwork.com/a681df2c6bf028c385389351ef8eed82baabb58b.jpg',
        caption: 'Breathtaking views from the Simien Mountains. Ethiopia truly is the roof of Africa. 🏔️ #EthiopianLandscapes #SimienMountains',
        category: 'landscapes',
        likes: 445,
        comments: 67,
        timeAgo: '8 hours ago',
        location: 'Simien Mountains'
    },
    {
        id: 5,
        username: 'cultural_heritage',
        avatar: 'https://kimi-web-img.moonshot.cn/img/www.aljazeera.com/9dbdff6ab7cf9d3f15268f9c08dfcdba34b2dc53.jpeg',
        image: 'https://kimi-web-img.moonshot.cn/img/img.freepik.com/f089d174956250d059489058017ce431f2c9a3c1.jpg',
        caption: 'Timkat celebration in Gondar. The colors, the music, the spiritual energy - this is Ethiopia at its most vibrant! 🎉 #Timkat #EthiopianCelebration',
        category: 'events',
        likes: 523,
        comments: 84,
        timeAgo: '12 hours ago',
        location: 'Gondar'
    },
    {
        id: 6,
        username: 'traditional_music',
        avatar: 'https://kimi-web-img.moonshot.cn/img/onlybyland.com/0c394101052d2314248cddf4faf327758595884c.jpg',
        image: 'https://kimi-web-img.moonshot.cn/img/i.pinimg.com/2a4a8009b47e7a067dc7e34b07edc7f4dc513066.jpg',
        caption: 'Mesmerizing sounds of the krar and masenqo. Traditional Ethiopian music connects us to our ancestors. 🎵 #EthiopianMusic #TraditionalInstruments',
        category: 'music',
        likes: 278,
        comments: 39,
        timeAgo: '1 day ago',
        location: 'Addis Ababa'
    }
];

// Story Data
const storyData = {
    coffee: {
        username: 'coffee_master',
        avatar: 'https://kimi-web-img.moonshot.cn/img/www.citymarket.coop/010fe882efe880603d422ec48c1624dd649bb1c2.jpg',
        items: [
            'https://kimi-web-img.moonshot.cn/img/blog.compassion.com/8f5b11825fe2e1fa7bbeb168341216858cbd7c0c.jpg',
            'https://kimi-web-img.moonshot.cn/img/static.wixstatic.com/000e034d6f2bcf8e739cda198c72337cc5711a1b.png',
            'https://kimi-web-img.moonshot.cn/img/sagebrushcoffee.com/4d487db687fdbabbf54a1798b526bbdb6e8a8859.jpg'
        ]
    },
    food: {
        username: 'ethiopian_chef',
        avatar: 'https://kimi-web-img.moonshot.cn/img/www.aspicyperspective.com/2168ff4c61b40edfb9a32b5cf1862bddf3c76809.jpg',
        items: [
            'https://kimi-web-img.moonshot.cn/img/www.aspicyperspective.com/2168ff4c61b40edfb9a32b5cf1862bddf3c76809.jpg',
            'https://kimi-web-img.moonshot.cn/img/ethnomed.org/resource/the-traditional-foods-of-the-central-ethiopian-highlands/',
            'https://kimi-web-img.moonshot.cn/img/kebenagreen.co.uk/discover-the-top-10-traditional-ethiopian-dishes/'
        ]
    },
    fashion: {
        username: 'habesha_style',
        avatar: 'https://kimi-web-img.moonshot.cn/img/ethiopiantraditionaldress.com/8d13b3bbba824075c84ac361e5917c4db12fd681.jpg',
        items: [
            'https://kimi-web-img.moonshot.cn/img/ethiopiantraditionaldress.com/8d13b3bbba824075c84ac361e5917c4db12fd681.jpg',
            'https://kimi-web-img.moonshot.cn/img/ethiopiantraditionaldress.com/2b629da67436a1f7fdf7f1bdf369341be47ae3e1.jpg',
            'https://kimi-web-img.moonshot.cn/img/www.ethiopian.store/26ba4f011011cf6ab2f1c27998a0ef3a387234ab.jpg'
        ]
    },
    music: {
        username: 'traditional_music',
        avatar: 'https://kimi-web-img.moonshot.cn/img/onlybyland.com/0c394101052d2314248cddf4faf327758595884c.jpg',
        items: [
            'https://kimi-web-img.moonshot.cn/img/onlybyland.com/0c394101052d2314248cddf4faf327758595884c.jpg',
            'https://kimi-web-img.moonshot.cn/img/i.pinimg.com/2a4a8009b47e7a067dc7e34b07edc7f4dc513066.jpg',
            'https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/07248000989d201976f315cb1f7317944513b9f9.JPG'
        ]
    },
    celebration: {
        username: 'cultural_heritage',
        avatar: 'https://kimi-web-img.moonshot.cn/img/www.aljazeera.com/9dbdff6ab7cf9d3f15268f9c08dfcdba34b2dc53.jpeg',
        items: [
            'https://kimi-web-img.moonshot.cn/img/www.aljazeera.com/9dbdff6ab7cf9d3f15268f9c08dfcdba34b2dc53.jpeg',
            'https://kimi-web-img.moonshot.cn/img/img.freepik.com/f089d174956250d059489058017ce431f2c9a3c1.jpg',
            'https://kimi-web-img.moonshot.cn/img/i0.wp.com/3fd7300788592dd80e9799141811b97b4c1d86c6.jpg'
        ]
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const currentPage = getCurrentPage();
    
    // Common initialization
    initializeScrollAnimations();
    initializeNavigation();
    
    // Page-specific initialization
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'profile':
            initializeProfilePage();
            break;
        case 'explore':
            initializeExplorePage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('profile.html')) return 'profile';
    if (path.includes('explore.html')) return 'explore';
    return 'index';
}

// Home Page Initialization
function initializeHomePage() {
    initializeTypedText();
    initializeCulturalFilters();
    initializeStories();
    initializeFeed();
    initializeUploadModal();
}

// Typed Text Animation
function initializeTypedText() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Welcome to Bandera',
                'Connect Through Culture',
                'Celebrate Ethiopia',
                'Share Your Story'
            ],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Cultural Filters
function initializeCulturalFilters() {
    const filterButtons = document.querySelectorAll('.cultural-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.dataset.filter;
            
            // Filter feed content
            filterFeedContent(currentFilter);
            
            // Animate button
            anime({
                targets: this,
                scale: [1, 1.05, 1],
                duration: 300,
                easing: 'easeInOutQuad'
            });
        });
    });
}

function filterFeedContent(filter) {
    const feedContainer = document.getElementById('feed-container');
    const filteredContent = filter === 'all' 
        ? culturalContent 
        : culturalContent.filter(post => post.category === filter);
    
    // Fade out current content
    anime({
        targets: feedContainer.children,
        opacity: 0,
        translateY: 20,
        duration: 300,
        easing: 'easeInOutQuad',
        complete: function() {
            // Clear and repopulate feed
            feedContainer.innerHTML = '';
            renderFeedItems(filteredContent);
            
            // Fade in new content
            anime({
                targets: feedContainer.children,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                delay: anime.stagger(100),
                easing: 'easeOutQuad'
            });
        }
    });
}

// Stories Functionality
function initializeStories() {
    const storyItems = document.querySelectorAll('.story-item');
    
    storyItems.forEach(item => {
        item.addEventListener('click', function() {
            const storyType = this.dataset.story;
            if (storyData[storyType]) {
                openStoryViewer(storyData[storyType]);
            }
        });
    });
}

function openStoryViewer(story) {
    // Create story modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="relative w-full h-full max-w-md mx-auto bg-black">
            <div class="absolute top-4 left-4 right-4 z-10">
                <div class="flex items-center space-x-3 mb-4">
                    <img src="${story.avatar}" alt="${story.username}" class="w-8 h-8 rounded-full object-cover">
                    <span class="text-white font-semibold">${story.username}</span>
                </div>
                <div class="flex space-x-1">
                    ${story.items.map((_, index) => `
                        <div class="flex-1 h-1 bg-gray-600 rounded-full">
                            <div class="h-full bg-white rounded-full transition-all duration-300" style="width: ${index === 0 ? '100%' : '0%'}"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="story-content w-full h-full flex items-center justify-center">
                <img src="${story.items[0]}" alt="Story" class="max-w-full max-h-full object-contain">
            </div>
            
            <button class="absolute top-4 right-4 text-white p-2" onclick="closeStoryViewer()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            
            <button class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full" onclick="previousStory()"></button>
            <button class="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full" onclick="nextStory()"></button>
        </div>
    `;
    
    document.body.appendChild(modal);
    stories = story.items;
    currentStoryIndex = 0;
    
    // Auto-advance stories
    startStoryAutoAdvance();
}

function closeStoryViewer() {
    const modal = document.querySelector('.fixed.inset-0.bg-black');
    if (modal) {
        modal.remove();
    }
}

function nextStory() {
    currentStoryIndex = (currentStoryIndex + 1) % stories.length;
    updateStoryContent();
}

function previousStory() {
    currentStoryIndex = currentStoryIndex === 0 ? stories.length - 1 : currentStoryIndex - 1;
    updateStoryContent();
}

function updateStoryContent() {
    const content = document.querySelector('.story-content img');
    if (content) {
        content.src = stories[currentStoryIndex];
    }
    
    // Update progress bars
    const progressBars = document.querySelectorAll('.flex-1.h-1.bg-gray-600 > div');
    progressBars.forEach((bar, index) => {
        bar.style.width = index <= currentStoryIndex ? '100%' : '0%';
    });
}

function startStoryAutoAdvance() {
    setTimeout(() => {
        if (currentStoryIndex < stories.length - 1) {
            nextStory();
            startStoryAutoAdvance();
        } else {
            setTimeout(closeStoryViewer, 3000);
        }
    }, 5000);
}

// Feed Functionality
function initializeFeed() {
    renderFeedItems(culturalContent);
    setupInfiniteScroll();
}

function renderFeedItems(content) {
    const feedContainer = document.getElementById('feed-container');
    
    content.forEach((post, index) => {
        const feedItem = createFeedItem(post, index);
        feedContainer.appendChild(feedItem);
    });
}

function createFeedItem(post, index) {
    const feedItem = document.createElement('div');
    feedItem.className = 'bg-white rounded-2xl shadow-lg overflow-hidden fade-in';
    feedItem.style.transitionDelay = `${index * 0.1}s`;
    
    feedItem.innerHTML = `
        <div class="p-4">
            <div class="flex items-center space-x-3 mb-4">
                <img src="${post.avatar}" alt="${post.username}" class="w-10 h-10 rounded-full object-cover">
                <div class="flex-1">
                    <div class="font-semibold">${post.username}</div>
                    <div class="text-sm text-gray-500">${post.location} • ${post.timeAgo}</div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                </button>
            </div>
            
            <img src="${post.image}" alt="Post" class="w-full h-64 object-cover rounded-xl mb-4">
            
            <p class="text-gray-800 mb-4">${post.caption}</p>
            
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <button class="like-btn flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors" onclick="toggleLike(${post.id}, this)">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                        <span class="like-count">${post.likes}</span>
                    </button>
                    
                    <button class="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors" onclick="showComments(${post.id})">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>${post.comments}</span>
                    </button>
                    
                    <button class="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                    </button>
                </div>
                
                <button class="save-btn text-gray-500 hover:text-yellow-500 transition-colors" onclick="toggleSave(${post.id}, this)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    return feedItem;
}

// Like Functionality
function toggleLike(postId, button) {
    const likeCount = button.querySelector('.like-count');
    const heartIcon = button.querySelector('svg');
    
    if (likedPosts.has(postId)) {
        // Unlike
        likedPosts.delete(postId);
        button.classList.remove('liked');
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
        heartIcon.setAttribute('fill', 'none');
    } else {
        // Like
        likedPosts.add(postId);
        button.classList.add('liked');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
        heartIcon.setAttribute('fill', 'currentColor');
        
        // Heart animation
        anime({
            targets: heartIcon,
            scale: [1, 1.3, 1],
            duration: 600,
            easing: 'easeInOutQuad'
        });
    }
}

// Save Functionality
function toggleSave(postId, button) {
    if (savedPosts.has(postId)) {
        savedPosts.delete(postId);
        button.classList.remove('text-yellow-500');
        button.classList.add('text-gray-500');
    } else {
        savedPosts.add(postId);
        button.classList.remove('text-gray-500');
        button.classList.add('text-yellow-500');
    }
}

// Comments Functionality
function showComments(postId) {
    alert('Comments feature coming soon! 🚀');
}

// Upload Modal
function initializeUploadModal() {
    window.showUploadModal = function() {
        const modal = document.getElementById('uploadModal');
        modal.classList.remove('hidden');
        
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    };
    
    window.hideUploadModal = function() {
        const modal = document.getElementById('uploadModal');
        modal.classList.add('hidden');
    };
}

// Profile Page Initialization
function initializeProfilePage() {
    initializeProfileTabs();
    initializeAchievements();
}

function initializeProfileTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab content
            tabContents.forEach(content => {
                if (content.id === `${targetTab}-tab`) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
            
            // Animate tab change
            anime({
                targets: document.getElementById(`${targetTab}-tab`),
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutQuad'
            });
        });
    });
}

function initializeAchievements() {
    const achievementBadges = document.querySelectorAll('.achievement-badge');
    
    achievementBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            anime({
                targets: this,
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                duration: 800,
                easing: 'easeInOutQuad'
            });
        });
    });
}

// Explore Page Initialization
function initializeExplorePage() {
    initializeExploreTypedText();
    initializeCategoryCards();
    initializeEducationCarousel();
    initializeSearch();
}

function initializeExploreTypedText() {
    if (document.getElementById('explore-typed')) {
        new Typed('#explore-typed', {
            strings: [
                'Discover Culture',
                'Explore Traditions',
                'Find Community',
                'Share Heritage'
            ],
            typeSpeed: 100,
            backSpeed: 60,
            backDelay: 2000,
            loop: true
        });
    }
}

function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Animate card selection
            anime({
                targets: this,
                scale: [1, 1.05, 1],
                duration: 400,
                easing: 'easeInOutQuad'
            });
            
            // Navigate to filtered feed or show category content
            setTimeout(() => {
                if (category === 'food') {
                    alert('Discovering Ethiopian cuisine! 🍽️');
                } else if (category === 'fashion') {
                    alert('Exploring Habesha fashion! 👗');
                } else if (category === 'music') {
                    alert('Enjoying traditional music! 🎵');
                } else {
                    alert(`Exploring ${category} content! 🚀`);
                }
            }, 200);
        });
    });
}

function initializeEducationCarousel() {
    if (document.getElementById('education-carousel')) {
        new Splide('#education-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '1rem',
            autoplay: true,
            interval: 5000,
            breakpoints: {
                768: {
                    perPage: 1
                },
                1024: {
                    perPage: 2
                }
            }
        }).mount();
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('exploreSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            // Simulate search functionality
            if (query.length > 2) {
                console.log(`Searching for: ${query}`);
                // Here you would implement actual search logic
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    alert(`Searching for "${query}" in Ethiopian cultural content! 🔍`);
                }
            }
        });
    }
}

// Common Utility Functions
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

function initializeNavigation() {
    // Mobile navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            anime({
                targets: this,
                scale: [1, 0.95, 1],
                duration: 200,
                easing: 'easeInOutQuad'
            });
        });
    });
}

function setupInfiniteScroll() {
    let loading = false;
    
    window.addEventListener('scroll', function() {
        if (loading) return;
        
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            loading = true;
            const loadingIndicator = document.getElementById('loading');
            loadingIndicator.classList.remove('hidden');
            
            // Simulate loading more content
            setTimeout(() => {
                loadingIndicator.classList.add('hidden');
                loading = false;
                
                // Add more content (in real app, this would be an API call)
                console.log('Loading more cultural content...');
            }, 1500);
        }
    });
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Bandera App Error:', e.error);
});

// Performance Monitoring
window.addEventListener('load', function() {
    console.log('Bandera app loaded successfully! 🇪🇹');
});

// Export functions for global access
window.toggleLike = toggleLike;
window.toggleSave = toggleSave;
window.showComments = showComments;
window.showUploadModal = showUploadModal;
window.hideUploadModal = hideUploadModal;
window.closeStoryViewer = closeStoryViewer;
window.nextStory = nextStory;
window.previousStory = previousStory;