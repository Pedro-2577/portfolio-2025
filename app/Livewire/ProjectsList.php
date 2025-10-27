<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Project;

class ProjectsList extends Component
{
    public $search = '';
    public $selectedTechnology = '';
    public $showFeaturedOnly = false;
    
    public $technologies = [];

    public function mount()
    {
        // Get all unique technologies from projects
        $this->technologies = Project::all()
            ->pluck('technologies')
            ->flatten()
            ->unique()
            ->filter()
            ->sort()
            ->values()
            ->toArray();
    }

    public function updatedSearch()
    {
        // Real-time search - no need to do anything special
        // Livewire will automatically re-render when $search changes
    }

    public function updatedSelectedTechnology()
    {
        // Real-time filter - no need to do anything special
        // Livewire will automatically re-render when $selectedTechnology changes
    }

    public function updatedShowFeaturedOnly()
    {
        // Real-time filter - no need to do anything special
        // Livewire will automatically re-render when $showFeaturedOnly changes
    }

    public function clearFilters()
    {
        $this->search = '';
        $this->selectedTechnology = '';
        $this->showFeaturedOnly = false;
    }

    public function getProjectsProperty()
    {
        $query = Project::query();

        // Apply search filter
        if ($this->search) {
            $query->search($this->search);
        }

        // Apply technology filter
        if ($this->selectedTechnology) {
            $query->byTechnology($this->selectedTechnology);
        }

        // Apply featured filter
        if ($this->showFeaturedOnly) {
            $query->featured();
        }

        return $query->ordered()->get();
    }

    public function render()
    {
        return view('livewire.projects-list', [
            'projects' => $this->projects,
        ]);
    }
}
