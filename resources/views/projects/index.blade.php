<x-app-layout>
    <x-slot name="title">Proyectos</x-slot>
    
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    <span x-show="language === 'es'">Mis Proyectos</span>
                    <span x-show="language === 'en'">My Projects</span>
                </h1>
                <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    <span x-show="language === 'es'">Una colección de proyectos que demuestran mi experiencia con el TALL Stack y otras tecnologías modernas</span>
                    <span x-show="language === 'en'">A collection of projects that demonstrate my experience with the TALL Stack and other modern technologies</span>
                </p>
            </div>
        </div>
    </div>

    <!-- Projects List -->
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            @foreach($projects as $project)
                <x-project-card :project="$project" />
            @endforeach
        </div>
    </div>
</x-app-layout>
