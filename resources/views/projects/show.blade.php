<x-app-layout>
    <x-slot name="title">{{ $project['title'] }}</x-slot>
    
    <!-- Project Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {{ $project['title'] }}
                </h1>
                <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    {{ $project['short_description'] }}
                </p>
            </div>
        </div>
    </div>

    <!-- Project Content -->
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Main Content -->
            <div class="lg:col-span-2">
                @if($project['image_url'])
                    <div class="mb-8">
                        <img src="{{ $project['image_url'] }}" 
                             alt="{{ $project['title'] }}" 
                             class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg">
                    </div>
                @endif

                <div class="prose prose-lg dark:prose-invert max-w-none">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        <span x-show="language === 'es'">Descripción del Proyecto</span>
                        <span x-show="language === 'en'">Project Description</span>
                    </h2>
                    <div class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {{ $project['description'] }}
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <span x-show="language === 'es'">Detalles del Proyecto</span>
                        <span x-show="language === 'en'">Project Details</span>
                    </h3>

                    <!-- Technologies -->
                    @if($project['technologies'] && count($project['technologies']) > 0)
                        <div class="mb-6">
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                <span x-show="language === 'es'">Tecnologías Utilizadas</span>
                                <span x-show="language === 'en'">Technologies Used</span>
                            </h4>
                            <div class="flex flex-wrap gap-2">
                                @foreach($project['technologies'] as $technology)
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                        {{ $technology }}
                                    </span>
                                @endforeach
                            </div>
                        </div>
                    @endif

                    <!-- Links -->
                    <div class="space-y-4">
                        @if($project['github_url'])
                            <a href="{{ $project['github_url'] }}" 
                               target="_blank"
                               class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                                </svg>
                                <span x-show="language === 'es'">Ver en GitHub</span>
                                <span x-show="language === 'en'">View on GitHub</span>
                            </a>
                        @endif

                        @if($project['live_url'])
                            <a href="{{ $project['live_url'] }}" 
                               target="_blank"
                               class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span x-show="language === 'es'">Ver Demo</span>
                                <span x-show="language === 'en'">View Demo</span>
                            </a>
                        @endif
                    </div>

                    <!-- Back to Projects -->
                    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <a href="{{ route('projects.index') }}" 
                           class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-150 ease-in-out">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span x-show="language === 'es'">Volver a Proyectos</span>
                            <span x-show="language === 'en'">Back to Projects</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
