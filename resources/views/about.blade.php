<x-app-layout>
    <x-slot name="title">Acerca de</x-slot>
    
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    <span x-show="language === 'es'">Acerca de Mí</span>
                    <span x-show="language === 'en'">About Me</span>
                </h1>
                <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    <span x-show="language === 'es'">Desarrollador Full-Stack con 5 años de experiencia creando aplicaciones web escalables</span>
                    <span x-show="language === 'en'">Full-Stack Developer with 5 years of experience creating scalable web applications</span>
                </p>
            </div>
        </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- About Text -->
            <div class="prose prose-lg dark:prose-invert max-w-none">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    <span x-show="language === 'es'">Mi Historia</span>
                    <span x-show="language === 'en'">My Story</span>
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                    <span x-show="language === 'es'">Soy <strong>Pedro Méndez Carabán</strong>, desarrollador Full-Stack con 5 años de experiencia creando aplicaciones web escalables. Especializado en Vue.js, Node.js y PHP/MySQL, con sólidos conocimientos en UX. Destaco por mi capacidad de adaptarme rápidamente a nuevas tecnologías y entregar soluciones completas de principio a fin.</span>
                    <span x-show="language === 'en'">I am <strong>Pedro Méndez Carabán</strong>, a Full-Stack developer with 5 years of experience creating scalable web applications. Specialized in Vue.js, Node.js and PHP/MySQL, with solid knowledge of UX. I stand out for my ability to quickly adapt to new technologies and deliver end-to-end solutions.</span>
                </p>
                
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                    <span x-show="language === 'es'">Como desarrollador freelance desde 2020, he trabajado con PYMEs y proyectos independientes, implementando soluciones en Vue.js, Node.js y PHP/MySQL, integrando diseño UX y despliegue. Mi experiencia abarca trabajo autónomo e independiente, así como colaborativo con clientes de distintos sectores.</span>
                    <span x-show="language === 'en'">As a freelance developer since 2020, I have worked with SMEs and independent projects, implementing solutions in Vue.js, Node.js and PHP/MySQL, integrating UX design and deployment. My experience includes autonomous and independent work, as well as collaborative work with clients from different sectors.</span>
                </p>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    <span x-show="language === 'es'">Formación Académica</span>
                    <span x-show="language === 'en'">Academic Background</span>
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                    <span x-show="language === 'es'"><strong>Técnico Superior en Diseño y Programación Web</strong><br>
                    Escuela Da Vinci - Buenos Aires, Argentina (2019 - 2023)<br>
                    Formación en desarrollo web front-end y back-end con enfoque en HTML5, CSS3, JavaScript, Vue.js, 
                    Node.js, PHP/MySQL, UX/UI, diseño responsive y experiencia de usuario.</span>
                    <span x-show="language === 'en'"><strong>Higher Technician in Web Design and Programming</strong><br>
                    Da Vinci School - Buenos Aires, Argentina (2019 - 2023)<br>
                    Training in front-end and back-end web development with focus on HTML5, CSS3, JavaScript, Vue.js, 
                    Node.js, PHP/MySQL, UX/UI, responsive design and user experience.</span>
                </p>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    <span x-show="language === 'es'">Mi Filosofía</span>
                    <span x-show="language === 'en'">My Philosophy</span>
                </h3>
                <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li x-show="language === 'es'"><strong>Comunicación Efectiva:</strong> Trabajo directamente con clientes y equipos para entender sus necesidades</li>
                    <li x-show="language === 'en'"><strong>Effective Communication:</strong> I work directly with clients and teams to understand their needs</li>
                    <li x-show="language === 'es'"><strong>Proactividad:</strong> Capacidad de aprendizaje autónomo y autodirigido</li>
                    <li x-show="language === 'en'"><strong>Proactivity:</strong> Autonomous and self-directed learning ability</li>
                    <li x-show="language === 'es'"><strong>Adaptabilidad:</strong> Me adapto rápidamente a nuevas tecnologías y entornos</li>
                    <li x-show="language === 'en'"><strong>Adaptability:</strong> I quickly adapt to new technologies and environments</li>
                    <li x-show="language === 'es'"><strong>Experiencia del Usuario:</strong> Priorizo la usabilidad y la accesibilidad en cada proyecto</li>
                    <li x-show="language === 'en'"><strong>User Experience:</strong> I prioritize usability and accessibility in every project</li>
                    <li x-show="language === 'es'"><strong>Aprendizaje Continuo:</strong> Me mantengo actualizado con las últimas tecnologías y tendencias</li>
                    <li x-show="language === 'en'"><strong>Continuous Learning:</strong> I stay updated with the latest technologies and trends</li>
                </ul>
            </div>

            <!-- Skills & Technologies -->
            <div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        <span x-show="language === 'es'">Habilidades Técnicas</span>
                        <span x-show="language === 'en'">Technical Skills</span>
                    </h3>
                    
                    <div class="space-y-6">
                        <div>
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frontend</h4>
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Vue.js</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">React</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Quasar</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">JavaScript</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">HTML5</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">CSS3</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">Bootstrap</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">WordPress</span>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Backend</h4>
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Node.js</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">PHP</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">MySQL</span>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Herramientas</h4>
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Git & GitHub</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">AJAX</span>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UX/UI</h4>
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Diseño Responsive</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">UX</span>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Habilidades Complementarias</h4>
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">Photoshop</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Illustrator</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Premiere</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Marketing Digital</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        <span x-show="language === 'es'">Objetivos de Aprendizaje</span>
                        <span x-show="language === 'en'">Learning Goals</span>
                    </h3>
                    
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <svg class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    <span x-show="language === 'es'">Profundizar en Laravel</span>
                                    <span x-show="language === 'en'">Deepen Laravel Knowledge</span>
                                </p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    <span x-show="language === 'es'">Ampliar competencias en back-end</span>
                                    <span x-show="language === 'en'">Expand back-end competencies</span>
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    <span x-show="language === 'es'">Incorporar Python</span>
                                    <span x-show="language === 'en'">Learn Python</span>
                                </p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    <span x-show="language === 'es'">Para automatización y análisis de datos</span>
                                    <span x-show="language === 'en'">For automation and data analysis</span>
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                    <svg class="h-4 w-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    <span x-show="language === 'es'">Mejorar dominio de SASS</span>
                                    <span x-show="language === 'en'">Improve SASS Skills</span>
                                </p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    <span x-show="language === 'es'">Prácticas modernas de maquetado</span>
                                    <span x-show="language === 'en'">Modern layout practices</span>
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                    <svg class="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    <span x-show="language === 'es'">Perfeccionar inglés técnico</span>
                                    <span x-show="language === 'en'">Perfect Technical English</span>
                                </p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    <span x-show="language === 'es'">Hasta un nivel avanzado</span>
                                    <span x-show="language === 'en'">To an advanced level</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
