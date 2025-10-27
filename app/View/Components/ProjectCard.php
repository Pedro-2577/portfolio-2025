<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class ProjectCard extends Component
{
    public $project;

    /**
     * Create a new component instance.
     */
    public function __construct($project)
    {
        $this->project = $project;
    }

    /**
     * Get the view / contents that represents the component.
     */
    public function render(): View
    {
        return view('components.project-card');
    }
}
