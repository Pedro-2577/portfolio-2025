# Portfolio 2025 - TALL Stack

Un portfolio web dinámico y responsivo desarrollado con el TALL Stack (Tailwind CSS, Alpine.js, Livewire, Laravel) como proyecto técnico principal para entrevistas laborales.

## 🚀 Características Principales

- **TALL Stack Completo**: Implementación integral de Tailwind CSS, Alpine.js, Livewire y Laravel
- **Diseño Responsivo**: Interfaz adaptativa que funciona perfectamente en todos los dispositivos
- **Modo Oscuro**: Toggle de tema oscuro/claro con persistencia en localStorage
- **Formulario de Contacto Reactivo**: Validación en tiempo real con Livewire
- **Filtrado de Proyectos**: Búsqueda y filtrado dinámico de proyectos por tecnología
- **Componentes Reutilizables**: Blade Components para mantener código DRY
- **Route Model Binding**: Navegación elegante con slugs de proyectos
- **Base de Datos SQLite**: Configuración simple para desarrollo y despliegue

## 🛠️ Tecnologías Utilizadas

### Backend
- **Laravel 11**: Framework PHP moderno y elegante
- **Livewire 3**: Full-stack framework para interactividad sin JavaScript complejo
- **SQLite**: Base de datos ligera y portable
- **Mail**: Sistema de envío de emails para formulario de contacto

### Frontend
- **Tailwind CSS**: Framework CSS utility-first para diseño rápido
- **Alpine.js**: Framework JavaScript ligero para interactividad
- **Vite**: Build tool moderno y rápido
- **Blade Components**: Sistema de componentes reutilizables de Laravel

### Herramientas de Desarrollo
- **Composer**: Gestor de dependencias PHP
- **NPM**: Gestor de paquetes Node.js
- **Git**: Control de versiones

## 📁 Estructura del Proyecto

```
portfolio-2025/
├── app/
│   ├── Http/
│   │   └── Middleware/          # Middleware personalizado
│   ├── Livewire/
│   │   ├── ContactForm.php      # Componente Livewire para contacto
│   │   └── ProjectsList.php     # Componente Livewire para listado de proyectos
│   ├── Mail/
│   │   └── ContactMail.php      # Mailable para emails de contacto
│   ├── Models/
│   │   └── Project.php          # Modelo de proyectos con scopes
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── LivewireServiceProvider.php
├── database/
│   ├── migrations/              # Migraciones de base de datos
│   ├── seeders/                 # Seeders con datos de ejemplo
│   └── database.sqlite          # Base de datos SQLite
├── resources/
│   ├── views/
│   │   ├── components/          # Blade Components reutilizables
│   │   ├── livewire/            # Vistas de componentes Livewire
│   │   ├── layouts/             # Layouts principales
│   │   └── projects/            # Vistas de proyectos
│   ├── css/
│   │   └── app.css              # Estilos principales con Tailwind
│   └── js/
│       ├── app.js               # JavaScript principal con Alpine.js
│       └── bootstrap.js         # Configuración de Axios
├── routes/
│   └── web.php                  # Rutas web con Route Model Binding
└── public/
    └── index.php                # Punto de entrada de la aplicación
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- PHP 8.1 o superior
- Composer
- Node.js y NPM
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/pedro/portfolio-2025.git
   cd portfolio-2025
   ```

2. **Instalar dependencias PHP**
   ```bash
   composer install
   ```

3. **Instalar dependencias Node.js**
   ```bash
   npm install
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configurar base de datos**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Compilar assets**
   ```bash
   npm run build
   # o para desarrollo:
   npm run dev
   ```

7. **Iniciar servidor de desarrollo**
   ```bash
   php artisan serve
   ```

La aplicación estará disponible en `http://localhost:8000`

## 🏗️ Arquitectura y Decisiones de Diseño

### ¿Por qué TALL Stack?

**Laravel** proporciona una base sólida y elegante para el backend con:
- Eloquent ORM para manejo de base de datos
- Sistema de rutas robusto con Route Model Binding
- Middleware para autenticación y autorización
- Sistema de mail integrado

**Livewire** elimina la complejidad de APIs REST:
- Componentes reactivos sin JavaScript complejo
- Validación en tiempo real del lado del servidor
- Estado compartido entre componentes
- Actualizaciones automáticas de la interfaz

**Alpine.js** maneja interacciones simples del frontend:
- Toggle de menú móvil
- Modo oscuro
- Modales y dropdowns
- Interacciones ligeras sin peso de frameworks pesados

**Tailwind CSS** acelera el desarrollo de interfaces:
- Utility-first approach para diseño rápido
- Sistema de diseño consistente
- Responsive design out-of-the-box
- Modo oscuro integrado

### Separación de Responsabilidades

- **Livewire**: Estado complejo, validación, comunicación con backend
- **Alpine.js**: Interacciones simples de UI, toggles, modales
- **Blade Components**: Elementos reutilizables (cards, navigation, footer)
- **Route Model Binding**: Navegación elegante con slugs

### Patrones de Diseño Implementados

1. **Repository Pattern**: Modelos con scopes para consultas complejas
2. **Component Pattern**: Blade Components para elementos reutilizables
3. **Observer Pattern**: Livewire para reactividad
4. **Strategy Pattern**: Diferentes estrategias de filtrado en ProjectsList

## 📱 Funcionalidades Implementadas

### Página Principal
- Hero section con presentación personal
- Sección de tecnologías dominadas
- Proyectos destacados
- Call-to-action para contacto

### Listado de Proyectos
- **Filtrado por tecnología**: Dropdown con tecnologías únicas
- **Búsqueda en tiempo real**: Por título y descripción
- **Filtro de destacados**: Toggle para mostrar solo proyectos destacados
- **Contador de resultados**: Muestra cantidad de proyectos encontrados
- **Limpieza de filtros**: Botón para resetear todos los filtros

### Detalle de Proyecto
- **Route Model Binding**: URLs amigables con slugs
- **Información completa**: Descripción, tecnologías, enlaces
- **Enlaces externos**: GitHub y demo en vivo
- **Navegación**: Volver al listado de proyectos

### Formulario de Contacto
- **Validación en tiempo real**: Con Livewire
- **Estados de carga**: Spinner durante envío
- **Feedback visual**: Mensajes de éxito/error
- **Envío de email**: Notificación al administrador
- **Reset del formulario**: Después del envío exitoso

### Modo Oscuro
- **Toggle persistente**: Guardado en localStorage
- **Transiciones suaves**: Entre temas
- **Consistencia**: En todos los componentes

## 🎨 Diseño y UX

### Principios de Diseño
- **Mobile First**: Diseño responsivo desde móviles
- **Accesibilidad**: Contraste adecuado, navegación por teclado
- **Performance**: Carga rápida, imágenes optimizadas
- **Consistencia**: Sistema de colores y tipografía unificado

### Componentes Reutilizables
- **x-navigation**: Barra de navegación con menú móvil
- **x-project-card**: Tarjeta de proyecto reutilizable
- **x-footer**: Pie de página con información de contacto
- **x-nav-link**: Enlaces de navegación con estados activos

## 🧪 Testing y Calidad

### Validaciones Implementadas
- **Frontend**: Validación en tiempo real con Livewire
- **Backend**: Validación de servidor en modelos y requests
- **Email**: Validación de formato y contenido

### Código Limpio
- **PSR Standards**: Código PHP siguiendo estándares PSR
- **Naming Conventions**: Nombres descriptivos y consistentes
- **Comments**: Documentación clara en funciones complejas
- **DRY Principle**: Componentes reutilizables, sin duplicación

## 🚀 Despliegue

### Opciones de Despliegue
- **Railway**: Plataforma recomendada para PHP/Laravel
- **Heroku**: Con buildpack de PHP
- **DigitalOcean**: Droplet con LAMP stack
- **VPS**: Configuración manual con Apache/Nginx

### Variables de Entorno de Producción
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
MAIL_MAILER=smtp
MAIL_HOST=tu-servidor-smtp
MAIL_PORT=587
MAIL_USERNAME=tu-email
MAIL_PASSWORD=tu-password
MAIL_ENCRYPTION=tls
```

## 📊 Métricas y Performance

### Optimizaciones Implementadas
- **Lazy Loading**: Carga diferida de imágenes
- **Minificación**: CSS y JS comprimidos en producción
- **Caching**: Cache de vistas y configuraciones
- **CDN**: Assets servidos desde CDN (opcional)

### Lighthouse Scores (Objetivo)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Servidor de desarrollo
php artisan serve

# Compilar assets en modo desarrollo
npm run dev

# Compilar assets en modo producción
npm run build

# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Base de Datos
```bash
# Ejecutar migraciones
php artisan migrate

# Poblar base de datos
php artisan db:seed

# Reset completo de base de datos
php artisan migrate:fresh --seed
```

### Livewire
```bash
# Crear nuevo componente Livewire
php artisan make:livewire NombreComponente

# Limpiar cache de Livewire
php artisan livewire:discover
```

## 🤝 Contribuciones

Este proyecto está diseñado como un portfolio personal, pero las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Pedro** - [@pedro](https://twitter.com/pedro) - pedro@example.com

Enlace del Proyecto: [https://github.com/pedro/portfolio-2025](https://github.com/pedro/portfolio-2025)

---

## 🎯 Puntos Clave para Entrevistas

### Arquitectura
- **¿Por qué Livewire sobre SPA?** Livewire elimina la complejidad de APIs REST, mantiene el estado en el servidor, y proporciona una experiencia de desarrollo más simple para aplicaciones tradicionales.

- **¿Cómo coexisten Livewire y Alpine?** Livewire maneja la reactividad del servidor, Alpine.js maneja interacciones simples del cliente. No hay conflicto porque Livewire no interfiere con el DOM que Alpine controla.

### Decisiones de Diseño
- **Blade Components**: Promueven reutilización de código, consistencia visual, y mantenibilidad.
- **Tailwind CSS**: Acelera el desarrollo, proporciona consistencia, y es altamente personalizable.

### Prácticas de Código
- **Seeders**: Poblar la base de datos con datos de ejemplo para demostración
- **Service Providers**: Configuración centralizada de servicios
- **Route Model Binding**: URLs amigables y código más limpio
- **Scopes en Modelos**: Consultas reutilizables y mantenibles

Este portfolio demuestra dominio completo del TALL Stack y las mejores prácticas de desarrollo web moderno.
