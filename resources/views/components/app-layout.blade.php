<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" x-data="{ darkMode: localStorage.getItem('darkMode') === 'true', mobileMenuOpen: false, language: localStorage.getItem('language') || 'es' }" 
      :class="{ 'dark': darkMode }" 
      x-init="darkMode = localStorage.getItem('darkMode') === 'true'; language = localStorage.getItem('language') || 'es'">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $title ?? 'Portfolio 2025' }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <!-- Livewire Styles -->
    @livewireStyles
</head>
<body class="font-sans antialiased bg-gray-50 dark:bg-gray-900">
    <div class="min-h-screen">
        <!-- Navigation -->
        <x-navigation />
        
        <!-- Page Content -->
        <main>
            {{ $slot }}
        </main>
        
        <!-- Footer -->
        <x-footer />
    </div>
    
    <!-- Livewire Scripts -->
    @livewireScripts
</body>
</html>
