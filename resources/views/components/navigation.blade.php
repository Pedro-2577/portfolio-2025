<nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo -->
                <div class="shrink-0 flex items-center">
                    <a href="{{ route('home') }}" class="text-xl font-bold text-gray-900 dark:text-white">
                        Pedro Méndez Carabán
                    </a>
                </div>

                <!-- Navigation Links -->
                <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                    <x-nav-link :href="route('home')" :active="request()->routeIs('home')">
                        <span x-show="language === 'es'">Inicio</span>
                        <span x-show="language === 'en'">Home</span>
                    </x-nav-link>
                    <x-nav-link :href="route('projects.index')" :active="request()->routeIs('projects.*')">
                        <span x-show="language === 'es'">Proyectos</span>
                        <span x-show="language === 'en'">Projects</span>
                    </x-nav-link>
                    <x-nav-link :href="route('about')" :active="request()->routeIs('about')">
                        <span x-show="language === 'es'">Acerca de</span>
                        <span x-show="language === 'en'">About</span>
                    </x-nav-link>
                    <x-nav-link :href="route('contact')" :active="request()->routeIs('contact')">
                        <span x-show="language === 'es'">Contacto</span>
                        <span x-show="language === 'en'">Contact</span>
                    </x-nav-link>
                </div>
            </div>

            <!-- Right side -->
            <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <!-- Language toggle -->
                <button @click="language = language === 'es' ? 'en' : 'es'; localStorage.setItem('language', language)" 
                        class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        :title="language === 'es' ? 'Switch to English' : 'Cambiar a Español'">
                    <span x-show="language === 'es'" class="text-sm font-medium">EN</span>
                    <span x-show="language === 'en'" class="text-sm font-medium">ES</span>
                </button>
                
                <!-- Dark mode toggle -->
                <button @click="darkMode = !darkMode; localStorage.setItem('darkMode', darkMode)" 
                        class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        :title="language === 'es' ? 'Cambiar tema' : 'Toggle theme'">
                    <svg x-show="!darkMode" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <svg x-show="darkMode" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </button>
            </div>

            <!-- Mobile menu button -->
            <div class="-mr-2 flex items-center sm:hidden">
                <button @click="mobileMenuOpen = !mobileMenuOpen" 
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    <div x-show="mobileMenuOpen" 
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 scale-95"
         x-transition:enter-end="opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-75"
         x-transition:leave-start="opacity-100 scale-100"
         x-transition:leave-end="opacity-0 scale-95"
         class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
            <x-mobile-nav-link :href="route('home')" :active="request()->routeIs('home')">
                <span x-show="language === 'es'">Inicio</span>
                <span x-show="language === 'en'">Home</span>
            </x-mobile-nav-link>
            <x-mobile-nav-link :href="route('projects.index')" :active="request()->routeIs('projects.*')">
                <span x-show="language === 'es'">Proyectos</span>
                <span x-show="language === 'en'">Projects</span>
            </x-mobile-nav-link>
            <x-mobile-nav-link :href="route('about')" :active="request()->routeIs('about')">
                <span x-show="language === 'es'">Acerca de</span>
                <span x-show="language === 'en'">About</span>
            </x-mobile-nav-link>
            <x-mobile-nav-link :href="route('contact')" :active="request()->routeIs('contact')">
                <span x-show="language === 'es'">Contacto</span>
                <span x-show="language === 'en'">Contact</span>
            </x-mobile-nav-link>
        </div>
    </div>
</nav>
