@props(['project'])

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full min-h-[400px]">
    @if($project['image_url'])
        <div class="aspect-w-16 aspect-h-9">
            <img src="{{ $project['image_url'] }}" 
                 alt="{{ $project['title'] }}" 
                 class="w-full h-48 object-cover">
        </div>
    @endif
    
    <div class="p-6 flex flex-col h-full">
        <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ $project['title'] }}
                </h3>
                @if($project['featured'])
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <span x-show="language === 'es'">Destacado</span>
                        <span x-show="language === 'en'">Featured</span>
                    </span>
                @endif
            </div>
            
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                {{ $project['short_description'] }}
            </p>
            
            @if($project['technologies'] && count($project['technologies']) > 0)
                <div class="flex flex-wrap gap-2 mb-4">
                    @foreach($project['technologies'] as $technology)
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {{ $technology }}
                        </span>
                    @endforeach
                </div>
            @endif
        </div>
        
        <div class="flex space-x-4 mt-4">
            <a href="{{ route('projects.show', $project['slug']) }}" 
               class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                <span x-show="language === 'es'">Ver Detalles</span>
                <span x-show="language === 'en'">View Details</span>
            </a>
            
            @if($project['github_url'])
                <a href="{{ $project['github_url'] }}" 
                   target="_blank"
                   class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                    GitHub
                </a>
            @endif
            
            @if($project['live_url'])
                <a href="{{ $project['live_url'] }}" 
                   target="_blank"
                   class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span x-show="language === 'es'">Ver Demo</span>
                    <span x-show="language === 'en'">View Demo</span>
                </a>
            @endif
        </div>
    </div>
</div>
