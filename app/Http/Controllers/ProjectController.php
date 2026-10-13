<?php

namespace App\Http\Controllers;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = collect(config('projects.items'))
            ->sortBy('order')
            ->values()
            ->all();

        return view('projects.index', compact('projects'));
    }

    public function show($slug)
    {
        $project = collect(config('projects.items'))->firstWhere('slug', $slug);

        if (!$project) {
            abort(404);
        }

        return view('projects.show', compact('project'));
    }
}
