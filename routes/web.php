<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;

Route::get('/', function () {
    // Static featured projects for welcome page
    $featuredProjects = [
        [
            'id' => 1,
            'title' => 'E-commerce Platform',
            'slug' => 'ecommerce-platform',
            'description' => 'A full-stack e-commerce platform built with Laravel and Vue.js.',
            'short_description' => 'Full-stack e-commerce platform with Laravel and Vue.js',
            'image_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
            'github_url' => 'https://github.com/pedro/ecommerce-platform',
            'live_url' => 'https://ecommerce-demo.com',
            'featured' => true,
            'technologies' => ['Laravel', 'Vue.js', 'MySQL', 'Tailwind CSS', 'Stripe API'],
            'order' => 1,
        ],
        [
            'id' => 2,
            'title' => 'Task Management App',
            'slug' => 'task-management-app',
            'description' => 'A collaborative task management application built with the TALL stack.',
            'short_description' => 'Collaborative task management with TALL stack',
            'image_url' => 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
            'github_url' => 'https://github.com/pedro/task-management',
            'live_url' => 'https://tasks-demo.com',
            'featured' => true,
            'technologies' => ['Laravel', 'Livewire', 'Alpine.js', 'Tailwind CSS', 'SQLite'],
            'order' => 2,
        ],
        [
            'id' => 3,
            'title' => 'Weather Dashboard',
            'slug' => 'weather-dashboard',
            'description' => 'A responsive weather dashboard with interactive charts.',
            'short_description' => 'Responsive weather dashboard with interactive charts',
            'image_url' => 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
            'github_url' => 'https://github.com/pedro/weather-dashboard',
            'live_url' => 'https://weather-demo.com',
            'featured' => true,
            'technologies' => ['JavaScript', 'Chart.js', 'CSS3', 'Weather API'],
            'order' => 3,
        ],
    ];
    
    return view('welcome', compact('featuredProjects'));
})->name('home');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');

Route::get('/about', function () {
    return view('about');
})->name('about');

Route::get('/contact', function () {
    return view('contact');
})->name('contact');
