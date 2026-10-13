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
        $projects = config('projects.items');

        foreach ($projects as $project) {
            unset($project['id'], $project['private']);
            Project::create($project);
        }
    }
}
