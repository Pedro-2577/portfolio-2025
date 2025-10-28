<?php if (isset($component)) { $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54 = $attributes; } ?>
<?php $component = App\View\Components\AppLayout::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('app-layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(App\View\Components\AppLayout::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
     <?php $__env->slot('title', null, []); ?> Inicio <?php $__env->endSlot(); ?>
    
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6">
                    <span x-show="language === 'es'">Hola, soy</span>
                    <span x-show="language === 'en'">Hi, I'm</span>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pedro Méndez Carabán</span>
                </h1>
                <p class="text-xl md:text-2xl mb-8 text-gray-200">
                    <span x-show="language === 'es'">Desarrollador Full-Stack con <strong>5 años de experiencia</strong></span>
                    <span x-show="language === 'en'">Full-Stack Developer with <strong>5 years of experience</strong></span>
                </p>
                <p class="text-lg mb-12 text-gray-300 max-w-3xl mx-auto">
                    <span x-show="language === 'es'">Especializado en Vue.js, Node.js y PHP/MySQL, con sólidos conocimientos en UX. Destaco por mi capacidad de adaptarme rápidamente a nuevas tecnologías y entregar soluciones completas de principio a fin.</span>
                    <span x-show="language === 'en'">Specialized in Vue.js, Node.js and PHP/MySQL, with strong knowledge of UX. I stand out for my ability to quickly adapt to new technologies and deliver end-to-end solutions.</span>
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="<?php echo e(route('projects.index')); ?>" 
                       class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150 ease-in-out">
                        <span x-show="language === 'es'">Ver Proyectos</span>
                        <span x-show="language === 'en'">View Projects</span>
                    </a>
                    <a href="<?php echo e(route('contact')); ?>" 
                       class="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150 ease-in-out">
                        <span x-show="language === 'es'">Contactar</span>
                        <span x-show="language === 'en'">Contact</span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Technologies Section -->
    <section class="py-16 bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    <span x-show="language === 'es'">Habilidades Técnicas</span>
                    <span x-show="language === 'en'">Technical Skills</span>
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                    <span x-show="language === 'es'">Especialización en Frontend, Backend y herramientas de desarrollo</span>
                    <span x-show="language === 'en'">Specialization in Frontend, Backend and development tools</span>
                </p>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div class="text-center">
                    <div class="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                        <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Vue.js</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Frontend Framework</p>
                </div>
                
                <div class="text-center">
                    <div class="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                        <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Node.js</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Backend Runtime</p>
                </div>
                
                <div class="text-center">
                    <div class="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <svg class="h-8 w-8 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">PHP</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Backend Language</p>
                </div>
                
                <div class="text-center">
                    <div class="mx-auto h-16 w-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                        <svg class="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">MySQL</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Database</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    <span x-show="language === 'es'">Proyectos Destacados</span>
                    <span x-show="language === 'en'">Featured Projects</span>
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                    <span x-show="language === 'es'">Algunos de mis trabajos más recientes y destacados</span>
                    <span x-show="language === 'en'">Some of my most recent and outstanding work</span>
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                <?php $__currentLoopData = $featuredProjects; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $project): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php if (isset($component)) { $__componentOriginalb009b6bea983337cad65fcfb8a10d717 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalb009b6bea983337cad65fcfb8a10d717 = $attributes; } ?>
<?php $component = App\View\Components\ProjectCard::resolve(['project' => $project] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('project-card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(App\View\Components\ProjectCard::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalb009b6bea983337cad65fcfb8a10d717)): ?>
<?php $attributes = $__attributesOriginalb009b6bea983337cad65fcfb8a10d717; ?>
<?php unset($__attributesOriginalb009b6bea983337cad65fcfb8a10d717); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalb009b6bea983337cad65fcfb8a10d717)): ?>
<?php $component = $__componentOriginalb009b6bea983337cad65fcfb8a10d717; ?>
<?php unset($__componentOriginalb009b6bea983337cad65fcfb8a10d717); ?>
<?php endif; ?>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
            
            <div class="text-center mt-12">
                <a href="<?php echo e(route('projects.index')); ?>" 
                   class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    <span x-show="language === 'es'">Ver Todos los Proyectos</span>
                    <span x-show="language === 'en'">View All Projects</span>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-indigo-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-white mb-4">
                <span x-show="language === 'es'">¿Tienes un proyecto en mente?</span>
                <span x-show="language === 'en'">Do you have a project in mind?</span>
            </h2>
            <p class="text-xl text-indigo-100 mb-8">
                <span x-show="language === 'es'">Estoy disponible para colaborar en proyectos interesantes y desafiantes</span>
                <span x-show="language === 'en'">I'm available to collaborate on interesting and challenging projects</span>
            </p>
            <a href="<?php echo e(route('contact')); ?>" 
               class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150 ease-in-out">
                <span x-show="language === 'es'">Hablemos</span>
                <span x-show="language === 'en'">Let's Talk</span>
            </a>
        </div>
    </section>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $attributes = $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $component = $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php /**PATH C:\Users\pedro\OneDrive\Documents\GitHub\portfolio-2025\portfolio-2025\resources\views/welcome.blade.php ENDPATH**/ ?>