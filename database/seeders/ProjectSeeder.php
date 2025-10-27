<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
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
            [
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
            [
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
            [
                'title' => 'Blog CMS',
                'slug' => 'blog-cms',
                'description' => 'A content management system for blogs built with Laravel. Features include markdown support, image uploads, SEO optimization, comment system, and a WYSIWYG editor. The admin panel provides comprehensive content management capabilities.',
                'short_description' => 'Laravel-based blog CMS with markdown support',
                'image_url' => 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/pedro/blog-cms',
                'live_url' => 'https://blog-demo.com',
                'featured' => false,
                'technologies' => ['Laravel', 'MySQL', 'Bootstrap', 'TinyMCE'],
                'order' => 4,
            ],
            [
                'title' => 'API Documentation Tool',
                'slug' => 'api-documentation-tool',
                'description' => 'An interactive API documentation tool that automatically generates documentation from OpenAPI specifications. Features include interactive testing, code examples, and real-time API validation.',
                'short_description' => 'Interactive API documentation with testing capabilities',
                'image_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/pedro/api-docs-tool',
                'live_url' => 'https://api-docs-demo.com',
                'featured' => true,
                'technologies' => ['React', 'Node.js', 'OpenAPI', 'Swagger UI'],
                'order' => 5,
            ],
            [
                'title' => 'Portfolio Website',
                'slug' => 'portfolio-website',
                'description' => 'A modern, responsive portfolio website showcasing projects and skills. Built with the TALL stack, it features smooth animations, dark mode toggle, contact form with validation, and a clean, professional design.',
                'short_description' => 'Modern portfolio website with TALL stack',
                'image_url' => 'https://images.unsplash.com/photo-1467232004584-a241de8b6a3b?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/pedro/portfolio-2025',
                'live_url' => 'https://pedro-portfolio.com',
                'featured' => true,
                'technologies' => ['Laravel', 'Livewire', 'Alpine.js', 'Tailwind CSS'],
                'order' => 6,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
