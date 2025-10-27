<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = [
            [
                'id' => 1,
                'title' => 'E-commerce Platform',
                'slug' => 'ecommerce-platform',
                'description' => 'A full-stack e-commerce platform built with Laravel and Vue.js. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard.',
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
                'description' => 'A collaborative task management application built with the TALL stack. Features include real-time updates, team collaboration, file attachments, deadline tracking, and progress visualization.',
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
                'description' => 'A responsive weather dashboard that displays current weather conditions and forecasts. Built with modern web technologies, it features location-based weather data, interactive charts, and a clean, mobile-first design.',
                'short_description' => 'Responsive weather dashboard with interactive charts',
                'image_url' => 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/pedro/weather-dashboard',
                'live_url' => 'https://weather-demo.com',
                'featured' => false,
                'technologies' => ['JavaScript', 'Chart.js', 'CSS3', 'Weather API'],
                'order' => 3,
            ],
        ];

        return view('projects.index', compact('projects'));
    }

    public function show($slug)
    {
        $projects = [
            'ecommerce-platform' => [
                'id' => 1,
                'title' => 'E-commerce Platform',
                'slug' => 'ecommerce-platform',
                'description' => 'A full-stack e-commerce platform built with Laravel and Vue.js. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard. The platform supports multiple payment methods and includes real-time inventory management.',
                'short_description' => 'Full-stack e-commerce platform with Laravel and Vue.js',
                'image_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/pedro/ecommerce-platform',
                'live_url' => 'https://ecommerce-demo.com',
                'featured' => true,
                'technologies' => ['Laravel', 'Vue.js', 'MySQL', 'Tailwind CSS', 'Stripe API'],
                'order' => 1,
            ],
            'task-management-app' => [
                'id' => 2,
                'title' => 'Task Management App',
                'slug' => 'task-management-app',
                'description' => 'A collaborative task management application built with the TALL stack. Features include real-time updates, team collaboration, file attachments, deadline tracking, and progress visualization. The app uses Livewire for reactive components and Alpine.js for UI interactions.',
                'short_description' => 'Collaborative task management with TALL stack',
                'image_url' => 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/pedro/task-management',
                'live_url' => 'https://tasks-demo.com',
                'featured' => true,
                'technologies' => ['Laravel', 'Livewire', 'Alpine.js', 'Tailwind CSS', 'SQLite'],
                'order' => 2,
            ],
            'weather-dashboard' => [
                'id' => 3,
                'title' => 'Weather Dashboard',
                'slug' => 'weather-dashboard',
                'description' => 'A responsive weather dashboard that displays current weather conditions and forecasts. Built with modern web technologies, it features location-based weather data, interactive charts, and a clean, mobile-first design.',
                'short_description' => 'Responsive weather dashboard with interactive charts',
                'image_url' => 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/pedro/weather-dashboard',
                'live_url' => 'https://weather-demo.com',
                'featured' => false,
                'technologies' => ['JavaScript', 'Chart.js', 'CSS3', 'Weather API'],
                'order' => 3,
            ],
        ];

        $project = $projects[$slug] ?? abort(404);

        return view('projects.show', compact('project'));
    }
}

