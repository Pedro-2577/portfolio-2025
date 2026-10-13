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
                'title' => 'Vendoalgo',
                'slug' => 'vendoalgo',
                'description' => 'Professional work on a publishing platform for notes and articles, with moderated comments, categories, and basic SEO features.',
                'short_description' => 'Professional web platform for publishing notes and articles',
                'image_url' => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
                'github_url' => null,
                'live_url' => 'https://vendoalgo.com',
                'featured' => true,
                'technologies' => ['Web Development', 'Content Platforms', 'SEO', 'Moderated Comments'],
                'order' => 1,
            ],
            [
                'title' => 'Portfolio 2025',
                'slug' => 'portfolio-2025',
                'description' => 'Responsive personal portfolio built with Laravel, Livewire, Alpine.js, and Tailwind CSS.',
                'short_description' => 'Personal portfolio built with the TALL stack',
                'image_url' => 'https://images.unsplash.com/photo-1467232004584-a241de8b6a3b?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/Pedro-2577/portfolio-2025',
                'live_url' => null,
                'featured' => true,
                'technologies' => ['Laravel', 'Livewire', 'Alpine.js', 'Tailwind CSS'],
                'order' => 2,
            ],
            [
                'title' => 'Aplicaciones Híbridas',
                'slug' => 'aplicaciones-hibridas',
                'description' => 'Academic JavaScript project exploring hybrid application development and API integration.',
                'short_description' => 'Hybrid application development with JavaScript',
                'image_url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
                'github_url' => 'https://github.com/Pedro-2577/aplicaciones-hibridas-20231C-DWT4AV',
                'live_url' => null,
                'featured' => true,
                'technologies' => ['JavaScript', 'APIs', 'Hybrid Applications'],
                'order' => 3,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
