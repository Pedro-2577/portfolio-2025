<div>
    <!-- Filters -->
    <div class="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div>
                <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buscar Proyectos
                </label>
                <input type="text" 
                       id="search" 
                       wire:model.live="search" 
                       placeholder="Buscar por título o descripción..."
                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <!-- Technology Filter -->
            <div>
                <label for="technology" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filtrar por Tecnología
                </label>
                <select id="technology" 
                        wire:model.live="selectedTechnology" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
                    <option value="">Todas las tecnologías</option>
                    @foreach($technologies as $technology)
                        <option value="{{ $technology }}">{{ $technology }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Featured Filter -->
            <div class="flex items-end">
                <label class="flex items-center">
                    <input type="checkbox" 
                           wire:model.live="showFeaturedOnly" 
                           class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Solo destacados
                    </span>
                </label>
            </div>
        </div>

        <!-- Clear Filters -->
        @if($search || $selectedTechnology || $showFeaturedOnly)
            <div class="mt-4 flex justify-end">
                <button wire:click="clearFilters" 
                        class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Limpiar Filtros
                </button>
            </div>
        @endif
    </div>

    <!-- Results Count -->
    <div class="mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {{ $projects->count() }} proyecto(s)
            @if($search)
                para "{{ $search }}"
            @endif
            @if($selectedTechnology)
                con tecnología "{{ $selectedTechnology }}"
            @endif
            @if($showFeaturedOnly)
                (solo destacados)
            @endif
        </p>
    </div>

    <!-- Projects Grid -->
    @if($projects->count() > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($projects as $project)
                <x-project-card :project="$project" />
            @endforeach
        </div>
    @else
        <div class="text-center py-12">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 01-2.291-.828M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron proyectos
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
                Intenta ajustar los filtros para ver más resultados.
            </p>
            <button wire:click="clearFilters" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                Limpiar Filtros
            </button>
        </div>
    @endif
</div>
