<x-app-layout>
    <x-slot name="title">Contacto</x-slot>
    
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    <span x-show="language === 'es'">Contacto</span>
                    <span x-show="language === 'en'">Contact</span>
                </h1>
                <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    <span x-show="language === 'es'">¿Tienes un proyecto en mente? Me encantaría escuchar sobre tu idea y cómo puedo ayudarte a hacerla realidad.</span>
                    <span x-show="language === 'en'">Do you have a project in mind? I'd love to hear about your idea and how I can help you make it a reality.</span>
                </p>
            </div>
        </div>
    </div>

    <!-- Contact Content -->
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Contact Form -->
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    <span x-show="language === 'es'">Envíame un Mensaje</span>
                    <span x-show="language === 'en'">Send me a Message</span>
                </h2>
                <p class="text-gray-600 dark:text-gray-300 mb-8">
                    <span x-show="language === 'es'">Completa el formulario y me pondré en contacto contigo lo antes posible. Normalmente respondo en menos de 24 horas.</span>
                    <span x-show="language === 'en'">Fill out the form and I'll get back to you as soon as possible. I usually respond within 24 hours.</span>
                </p>
                
                @livewire('contact-form')
            </div>

            <!-- Contact Information -->
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    <span x-show="language === 'es'">Información de Contacto</span>
                    <span x-show="language === 'en'">Contact Information</span>
                </h2>
                
                <div class="space-y-8">
                    <!-- Email -->
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                <svg class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                            <p class="text-gray-600 dark:text-gray-300">pedromendezcaraban@gmail.com</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                <span x-show="language === 'es'">Respuesta en menos de 24 horas</span>
                                <span x-show="language === 'en'">Response within 24 hours</span>
                            </p>
                        </div>
                    </div>

                    <!-- Phone -->
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                <svg class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                                <span x-show="language === 'es'">Teléfono</span>
                                <span x-show="language === 'en'">Phone</span>
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">+54 9 11-5847-1048</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                <span x-show="language === 'es'">Lunes a Viernes, 9:00 - 18:00</span>
                                <span x-show="language === 'en'">Monday to Friday, 9:00 - 18:00</span>
                            </p>
                        </div>
                    </div>

                    <!-- Location -->
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                <svg class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                                <span x-show="language === 'es'">Ubicación</span>
                                <span x-show="language === 'en'">Location</span>
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">Buenos Aires, Argentina</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                <span x-show="language === 'es'">Disponible para trabajo remoto</span>
                                <span x-show="language === 'en'">Available for remote work</span>
                            </p>
                        </div>
                    </div>

                    <!-- Social Links -->
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                <svg class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                                <span x-show="language === 'es'">Redes Sociales</span>
                                <span x-show="language === 'en'">Social Media</span>
                            </h3>
                            <div class="flex space-x-4 mt-2">
                                <a href="https://github.com/Pedro-2577" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" target="_blank" rel="noopener noreferrer">
                                    <span class="sr-only">GitHub</span>
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/in/pedro-mendez-caraban/" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" target="_blank" rel="noopener noreferrer">
                                    <span class="sr-only">LinkedIn</span>
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://wa.me/5491158471048" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" target="_blank" rel="noopener noreferrer">
                                    <span class="sr-only">WhatsApp</span>
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FAQ Section -->
                <div class="mt-12">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <span x-show="language === 'es'">Preguntas Frecuentes</span>
                        <span x-show="language === 'en'">Frequently Asked Questions</span>
                    </h3>
                    
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                                <span x-show="language === 'es'">¿Cuánto tiempo toma desarrollar un proyecto?</span>
                                <span x-show="language === 'en'">How long does it take to develop a project?</span>
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                <span x-show="language === 'es'">Depende de la complejidad del proyecto. Un sitio web simple puede tomar 1-2 semanas, mientras que una aplicación compleja puede requerir 2-6 meses.</span>
                                <span x-show="language === 'en'">It depends on the complexity of the project. A simple website can take 1-2 weeks, while a complex application may require 2-6 months.</span>
                            </p>
                        </div>
                        
                        <div>
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                                <span x-show="language === 'es'">¿Trabajas con equipos remotos?</span>
                                <span x-show="language === 'en'">Do you work with remote teams?</span>
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                <span x-show="language === 'es'">Sí, tengo experiencia trabajando con equipos distribuidos y estoy acostumbrado a usar herramientas de colaboración como Slack, Zoom y Git.</span>
                                <span x-show="language === 'en'">Yes, I have experience working with distributed teams and I'm used to using collaboration tools like Slack, Zoom and Git.</span>
                            </p>
                        </div>
                        
                        <div>
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                                <span x-show="language === 'es'">¿Ofreces mantenimiento después del lanzamiento?</span>
                                <span x-show="language === 'en'">Do you offer maintenance after launch?</span>
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                <span x-show="language === 'es'">Sí, ofrezco planes de mantenimiento y soporte para asegurar que tu aplicación funcione correctamente y se mantenga actualizada.</span>
                                <span x-show="language === 'en'">Yes, I offer maintenance and support plans to ensure your application works correctly and stays updated.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
