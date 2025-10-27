<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Registrar componentes Blade
        Blade::component('app-layout', \App\View\Components\AppLayout::class);
        Blade::component('navigation', \App\View\Components\Navigation::class);
        Blade::component('nav-link', \App\View\Components\NavLink::class);
        Blade::component('mobile-nav-link', \App\View\Components\MobileNavLink::class);
        Blade::component('footer', \App\View\Components\Footer::class);
        Blade::component('project-card', \App\View\Components\ProjectCard::class);
    }
}
