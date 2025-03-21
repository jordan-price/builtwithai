<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Category;
use App\Models\Engineer;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First ensure we have categories
        $this->seedCategories();
        
        // Create tags
        $this->seedTags();
        
        // Create engineers
        $this->seedEngineers();
        
        // Now create projects
        $this->seedProjects();
    }
    
    private function seedCategories(): void
    {
        $categories = [
            ['name' => 'AI Tools', 'slug' => 'ai-tools', 'description' => 'Tools powered by artificial intelligence'],
            ['name' => 'Web Applications', 'slug' => 'web-applications', 'description' => 'Full-stack web applications'],
            ['name' => 'Mobile Apps', 'slug' => 'mobile-apps', 'description' => 'Applications for iOS and Android'],
            ['name' => 'Developer Tools', 'slug' => 'developer-tools', 'description' => 'Tools to help developers be more productive'],
            ['name' => 'Games', 'slug' => 'games', 'description' => 'Entertainment software and games'],
        ];
        
        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
    
    private function seedTags(): void
    {
        $tags = [
            ['name' => 'Laravel', 'slug' => 'laravel'],
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'Vue', 'slug' => 'vue'],
            ['name' => 'PHP', 'slug' => 'php'],
            ['name' => 'TypeScript', 'slug' => 'typescript'],
            ['name' => 'JavaScript', 'slug' => 'javascript'],
            ['name' => 'Python', 'slug' => 'python'],
            ['name' => 'Machine Learning', 'slug' => 'machine-learning'],
            ['name' => 'AI', 'slug' => 'ai'],
            ['name' => 'Tailwind', 'slug' => 'tailwind'],
            ['name' => 'Inertia', 'slug' => 'inertia'],
            ['name' => 'Open Source', 'slug' => 'open-source'],
        ];
        
        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['slug' => $tag['slug']],
                $tag
            );
        }
    }
    
    private function seedEngineers(): void
    {
        $engineerData = [
            [
                'name' => 'Jordan Price',
                'email' => 'jordan@example.com',
                'role' => 'Full-stack Developer',
                'bio' => 'Full-stack developer with a passion for AI and modern web development',
                'github_username' => 'jordanprice',
                'twitter_username' => 'jordanprice',
                'personal_website' => 'https://jordanprice.dev',
                'location' => 'San Francisco, CA',
                'is_featured' => true,
            ],
            [
                'name' => 'Alex Morgan',
                'email' => 'alex@example.com',
                'role' => 'Frontend Developer',
                'bio' => 'Frontend specialist working with React and TypeScript',
                'github_username' => 'alexmorgan',
                'twitter_username' => 'alexmorgan',
                'personal_website' => 'https://alexmorgan.dev',
                'location' => 'New York, NY',
                'is_featured' => false,
            ],
            [
                'name' => 'Sam Johnson',
                'email' => 'sam@example.com',
                'role' => 'Backend Developer',
                'bio' => 'Backend developer focused on Laravel performance optimization',
                'github_username' => 'samjohnson',
                'twitter_username' => 'samjohnson',
                'personal_website' => 'https://samjohnson.dev',
                'location' => 'Austin, TX',
                'is_featured' => true,
            ],
        ];
        
        foreach ($engineerData as $data) {
            // First create the user
            $user = \App\Models\User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => bcrypt('password'),
                ]
            );
            
            // Then create the associated engineer profile
            $skills = $this->getSkillsForEngineer($data['name']);
            $experience = $this->getExperienceForEngineer($data['name']);
            
            Engineer::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'name' => $data['name'],
                    'role' => $data['role'],
                    'bio' => $data['bio'],
                    'github_username' => $data['github_username'],
                    'twitter_username' => $data['twitter_username'],
                    'personal_website' => $data['personal_website'],
                    'location' => $data['location'],
                    'is_featured' => $data['is_featured'],
                    'is_open_to_work' => (bool) rand(0, 1),
                    'contact_preferences' => ['email', 'twitter'],
                    'skills' => $skills,
                    'experience' => $experience,
                ]
            );
        }
    }
    
    private function seedProjects(): void
    {
        $categories = Category::all();
        $tags = Tag::all();
        $engineers = Engineer::all();
        
        $projects = [
            [
                'name' => 'Cascade AI',
                'description' => "An advanced AI coding assistant that utilizes PHP 8.4 features and modern frameworks to assist developers in writing efficient, clean code. Cascade leverages large language models fine-tuned specifically for PHP, Laravel, React, and TypeScript development. The tool integrates directly with your IDE and offers real-time suggestions, code refactoring, performance optimization tips, and automated test generation.

Key features include:
- Context-aware code completions leveraging repository-wide knowledge
- Automated generation of Pest tests for Laravel applications
- Framework-specific optimizations for Laravel and Inertia.js
- TypeScript/React component suggestions with Tailwind implementation hints
- Performance bottleneck detection and optimization
- Security vulnerability scanning and remediation suggestions",
                'short_description' => 'AI-powered PHP & Laravel coding assistant',
                'category_id' => $categories->where('slug', 'ai-tools')->first()?->id,
                'website_url' => 'https://cascade.ai',
                'github_url' => 'https://github.com/cascade-ai/assistant',
                'demo_url' => 'https://demo.cascade.ai',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'name' => 'Laravel Lens',
                'description' => "Laravel Lens is an AI-enhanced monitoring and debugging tool specifically designed for Laravel applications. It provides deep insights into application performance, database queries, and potential bottlenecks using machine learning algorithms to detect anomalies and suggest optimizations before they impact production.

Lens continuously monitors your application, detecting N+1 query issues, memory leaks, and performance degradation through predictive analysis. The tool features:
- Real-time performance metrics visualization
- AI-powered query optimization suggestions
- Automatic bottleneck detection and remediation strategies
- Integration with popular Laravel packages
- Custom performance threshold notifications
- Historical performance comparison with ML trend analysis
- PHP 8.4 compatibility with full support for latest Laravel features",
                'short_description' => 'AI-powered Laravel performance analyzer',
                'category_id' => $categories->where('slug', 'developer-tools')->first()?->id,
                'website_url' => 'https://laravellens.dev',
                'github_url' => 'https://github.com/laravel-lens/core',
                'demo_url' => 'https://demo.laravellens.dev',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'name' => 'ContentForge',
                'description' => "ContentForge is an AI content management system built with Laravel, Inertia, React, and Tailwind. It revolutionizes content creation and management with advanced AI tools that assist writers, marketers, and content teams.

The platform features:
- AI-generated content suggestions based on your industry and target audience
- Smart content optimization for SEO, readability, and engagement
- Automated content repurposing across multiple formats (blog, social, email)
- Personalized content recommendations for website visitors
- A/B testing with AI-powered analysis
- Multilingual content translation with context preservation
- Content performance analytics with actionable insights
- Integration with popular marketing platforms

Built with modern PHP 8.4 features, Laravel's newest capabilities, and optimized React components.",
                'short_description' => 'AI-powered content management system',
                'category_id' => $categories->where('slug', 'web-applications')->first()?->id,
                'website_url' => 'https://contentforge.io',
                'github_url' => 'https://github.com/contentforge/cms',
                'demo_url' => 'https://demo.contentforge.io',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'name' => 'DevInfer',
                'description' => "DevInfer is a revolutionary AI tool that analyzes your development process, codebase, and team interactions to provide actionable insights for improving development velocity and code quality. Using sophisticated machine learning algorithms, it identifies patterns in your development workflow and suggests optimizations.

Key capabilities include:
- Automated code review with intelligent prioritization of issues
- Development workflow analysis and bottleneck identification
- Team collaboration pattern recognition and enhancement suggestions
- Technical debt quantification and remediation planning
- Sprint planning assistance with AI-driven task estimation
- Integration with GitHub, GitLab, and Bitbucket
- Custom report generation for engineering managers

Built with Laravel and Vue.js, DevInfer leverages PHP 8.4's new type system and performance improvements.",
                'short_description' => 'AI-powered development process optimizer',
                'category_id' => $categories->where('slug', 'developer-tools')->first()?->id,
                'website_url' => 'https://devinfer.tech',
                'github_url' => 'https://github.com/devinfer/engine',
                'demo_url' => 'https://demo.devinfer.tech',
                'status' => 'published',
                'is_featured' => false,
            ],
            [
                'name' => 'TestPilot',
                'description' => "TestPilot is an AI-powered testing assistant for Laravel applications that revolutionizes how developers approach testing. Built specifically for PHP 8.4 and the latest Pest testing framework, TestPilot analyzes your codebase and automatically generates comprehensive test suites with minimal developer input.

The platform offers:
- Automated Pest test generation for Laravel controllers, models, and services
- AI-driven edge case detection and test coverage recommendations
- Real-time test execution and analysis
- Visual test coverage reporting with improvement suggestions
- Integration with CI/CD pipelines
- Test performance optimization
- Suggestion of test refactoring to improve maintainability

TestPilot dramatically reduces the time spent writing tests while improving overall application quality and stability.",
                'short_description' => 'AI test generator for Laravel applications',
                'category_id' => $categories->where('slug', 'developer-tools')->first()?->id,
                'website_url' => 'https://testpilot.dev',
                'github_url' => 'https://github.com/testpilot/laravel',
                'demo_url' => 'https://demo.testpilot.dev',
                'status' => 'published',
                'is_featured' => false,
            ],
            [
                'name' => 'InertiaVue',
                'description' => "InertiaVue is an AI-powered UI component generator that bridges Laravel, Inertia.js and Vue.js. This innovative tool allows developers to describe interfaces in natural language and instantly generates fully-functional, accessible, and responsive components using Tailwind CSS.

Features include:
- Natural language to UI component generation
- Automatic implementation of accessibility best practices
- Dark/light mode support with Tailwind integration
- Component variants generation based on use cases
- Prop documentation and type generation
- Visual regression testing suggestions
- Seamless integration with Laravel and Inertia.js projects

Powered by advanced natural language understanding models and optimized for PHP 8.4, InertiaVue drastically accelerates frontend development while maintaining high-quality standards.",
                'short_description' => 'AI UI generator for Laravel and Inertia',
                'category_id' => $categories->where('slug', 'ai-tools')->first()?->id,
                'website_url' => 'https://inertiavue.app',
                'github_url' => 'https://github.com/inertiavue/generator',
                'demo_url' => 'https://demo.inertiavue.app',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'name' => 'SchemaGenius',
                'description' => "SchemaGenius is an AI-powered database design and optimization tool for Laravel applications. It analyzes your application requirements, data flow, and existing models to suggest optimal database schemas, migrations, and indexing strategies.

The application features:
- Natural language to migration generation
- Automated indexing recommendations based on query patterns
- Schema visualization with relationship mapping
- Database performance forecasting
- Foreign key consistency validation
- Eloquent model generation with relations and attributes
- Schema evolution recommendations as your application grows

Built with PHP 8.4's powerful features and latest Laravel best practices, SchemaGenius helps developers create efficient, scalable database designs without deep database expertise.",
                'short_description' => 'AI database designer for Laravel',
                'category_id' => $categories->where('slug', 'developer-tools')->first()?->id,
                'website_url' => 'https://schemagenius.io',
                'github_url' => 'https://github.com/schemagenius/core',
                'demo_url' => 'https://demo.schemagenius.io',
                'status' => 'published',
                'is_featured' => false,
            ],
            [
                'name' => 'DocuMint',
                'description' => "DocuMint is an AI-powered documentation generator for Laravel applications that automatically creates comprehensive, accurate, and up-to-date documentation directly from your codebase. It analyzes your PHP code, Blade templates, React components, and database schema to produce developer-friendly documentation.

Key features include:
- API documentation generation with examples and test cases
- Frontend component cataloging with props and methods
- Database schema documentation with relationship visualizations
- Command-line tool documentation with examples
- Automated updating when code changes
- Custom documentation templates
- Searchable documentation portal generation

Built with PHP 8.4 and Laravel, DocuMint ensures your project documentation stays synchronized with your codebase without manual effort.",
                'short_description' => 'AI documentation generator for Laravel',
                'category_id' => $categories->where('slug', 'developer-tools')->first()?->id,
                'website_url' => 'https://documint.dev',
                'github_url' => 'https://github.com/documint/laravel',
                'demo_url' => 'https://demo.documint.dev',
                'status' => 'published',
                'is_featured' => false,
            ],
            [
                'name' => 'AIrtisan',
                'description' => "AIrtisan is a revolutionary Laravel package that extends Artisan commands with AI capabilities. It provides Laravel developers with intelligent console commands that can generate complex code structures, refactor existing code, and solve common development challenges through natural language instructions.

The package includes:
- Natural language to Artisan command translation
- AI-powered code generation for controllers, models, and services
- Intelligent database migration creation and modification
- Automated CRUD endpoint generation with validation
- Test suite scaffolding with realistic test data
- Code refactoring suggestions and implementation
- Documentation generation for custom application features

Optimized for PHP 8.4 and the latest Laravel version, AIrtisan dramatically increases developer productivity while maintaining code quality and adherence to Laravel best practices.",
                'short_description' => 'AI-enhanced Artisan commands for Laravel',
                'category_id' => $categories->where('slug', 'developer-tools')->first()?->id,
                'website_url' => 'https://airtisan.dev',
                'github_url' => 'https://github.com/airtisan/laravel',
                'demo_url' => 'https://demo.airtisan.dev',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'name' => 'TailwindGenius',
                'description' => "TailwindGenius is an AI-powered design assistant for Tailwind CSS that helps developers create beautiful, responsive UI components without deep CSS expertise. The tool analyzes design requirements and generates optimized Tailwind code for Laravel and React applications.

Features include:
- Natural language to Tailwind component conversion
- Responsive design generation across all breakpoints
- Accessibility compliance verification and enhancement
- Dark mode support with automatic color palette adjustment
- Animation and transition recommendations
- Integration with Laravel Blade and React components
- Custom theme extraction from design files

TailwindGenius bridges the gap between design and development, enabling developers to implement pixel-perfect designs efficiently using Tailwind's utility-first approach.",
                'short_description' => 'AI Tailwind CSS assistant for modern apps',
                'category_id' => $categories->where('slug', 'ai-tools')->first()?->id,
                'website_url' => 'https://tailwindgenius.app',
                'github_url' => 'https://github.com/tailwindgenius/core',
                'demo_url' => 'https://demo.tailwindgenius.app',
                'status' => 'published',
                'is_featured' => true,
            ],
        ];
        
        foreach ($projects as $projectData) {
            $slug = Str::slug($projectData['name']);
            
            $project = Project::firstOrCreate(
                ['slug' => $slug],
                [
                    ...$projectData,
                    'slug' => $slug,
                ]
            );
            
            // Assign random tags to each project
            $projectTags = $tags->random(rand(2, 5));
            $project->tags()->sync($projectTags->pluck('id')->toArray());
            
            // Assign engineers to the project with random roles
            $projectEngineers = $engineers->random(rand(1, 3));
            $roles = ['Developer', 'Designer', 'Project Manager', 'QA Engineer'];
            
            $engineerPivot = [];
            foreach ($projectEngineers as $engineer) {
                $engineerPivot[$engineer->id] = [
                    'role' => $roles[array_rand($roles)],
                    'is_primary' => $engineer->id === $projectEngineers->first()->id,
                ];
            }
            
            $project->engineers()->sync($engineerPivot);
        }
    }
    
    /**
     * Get skills for a specific engineer based on their name
     */
    private function getSkillsForEngineer(string $name): array
    {
        $skillSets = [
            'Jordan Price' => [
                'PHP', 'Laravel', 'React', 'TypeScript', 'Inertia.js', 'Tailwind CSS', 'MySQL', 'Redis',
                'API Development', 'AI Integration', 'Docker', 'AWS', 'TDD', 'Pest'
            ],
            'Alex Morgan' => [
                'React', 'TypeScript', 'JavaScript', 'Vue.js', 'Inertia.js', 'Tailwind CSS', 'HTML5', 'CSS3',
                'Responsive Design', 'UI/UX', 'Jest', 'React Testing Library', 'NextJS', 'GraphQL'
            ],
            'Sam Johnson' => [
                'PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'Redis', 'API Design', 'Performance Optimization',
                'Caching Strategies', 'Docker', 'CI/CD', 'Event Sourcing', 'DDD', 'Pest', 'Queue Management'
            ],
        ];
        
        return $skillSets[$name] ?? array_merge(
            $this->getRandomTechSkills(),
            $this->getRandomSoftSkills()
        );
    }
    
    /**
     * Get experience entries for a specific engineer based on their name
     */
    private function getExperienceForEngineer(string $name): array
    {
        $experienceSets = [
            'Jordan Price' => [
                [
                    'title' => 'Lead Developer',
                    'company' => 'AI Solutions Inc.',
                    'start_date' => '2022-01',
                    'current' => true,
                    'description' => 'Leading a team of developers building AI-powered web applications using Laravel, React, and TypeScript.'
                ],
                [
                    'title' => 'Full-stack Developer',
                    'company' => 'Web Innovations',
                    'start_date' => '2019-03',
                    'end_date' => '2021-12',
                    'current' => false,
                    'description' => 'Developed and maintained modern web applications using Laravel and Vue.js. Implemented CI/CD pipelines and containerized development environments.'
                ],
                [
                    'title' => 'Software Engineer',
                    'company' => 'TechStart',
                    'start_date' => '2017-06',
                    'end_date' => '2019-02',
                    'current' => false,
                    'description' => 'Built RESTful APIs and interactive web applications. Collaborated with cross-functional teams to deliver high-quality software products.'
                ]
            ],
            'Alex Morgan' => [
                [
                    'title' => 'Frontend Developer',
                    'company' => 'UX Partners',
                    'start_date' => '2021-04',
                    'current' => true,
                    'description' => 'Creating responsive, accessible web interfaces using React and TypeScript with a focus on performance and user experience.'
                ],
                [
                    'title' => 'UI Developer',
                    'company' => 'Digital Craft',
                    'start_date' => '2018-11',
                    'end_date' => '2021-03',
                    'current' => false,
                    'description' => 'Designed and implemented user interfaces for various client projects using modern JavaScript frameworks and CSS preprocessors.'
                ]
            ],
            'Sam Johnson' => [
                [
                    'title' => 'Backend Developer',
                    'company' => 'ServerPro',
                    'start_date' => '2020-09',
                    'current' => true,
                    'description' => 'Developing high-performance backend systems using Laravel and optimizing database queries for large-scale applications.'
                ],
                [
                    'title' => 'PHP Developer',
                    'company' => 'WebSolutions',
                    'start_date' => '2017-01',
                    'end_date' => '2020-08',
                    'current' => false,
                    'description' => 'Built and maintained web applications using PHP frameworks. Implemented caching strategies and optimized application performance.'
                ],
                [
                    'title' => 'Junior Developer',
                    'company' => 'CodeCraft',
                    'start_date' => '2015-04',
                    'end_date' => '2016-12',
                    'current' => false,
                    'description' => 'Assisted in the development of web applications and learned various programming languages and frameworks.'
                ]
            ],
        ];
        
        return $experienceSets[$name] ?? $this->getRandomExperience();
    }
    
    /**
     * Generate random tech skills
     */
    private function getRandomTechSkills(int $count = 6): array
    {
        $allSkills = [
            'PHP', 'Laravel', 'Symfony', 'CodeIgniter', 'Pest', 'PHPUnit',
            'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Svelte',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
            'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
            'Git', 'CI/CD', 'TDD', 'BDD', 'Agile',
            'RESTful APIs', 'GraphQL', 'WebSockets',
            'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'Bootstrap',
            'Node.js', 'Express.js', 'Python', 'Django', 'Flask',
            'WordPress', 'Shopify', 'Magento', 'WooCommerce',
            'Mobile Development', 'iOS', 'Android', 'React Native', 'Flutter',
            'Web Security', 'Performance Optimization', 'Accessibility',
            'Machine Learning', 'AI', 'Data Analysis', 'Big Data',
        ];
        
        shuffle($allSkills);
        return array_slice($allSkills, 0, $count);
    }
    
    /**
     * Generate random soft skills
     */
    private function getRandomSoftSkills(int $count = 4): array
    {
        $allSkills = [
            'Problem Solving', 'Communication', 'Teamwork', 'Leadership',
            'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
            'Project Management', 'Mentoring', 'Customer Focus', 'Attention to Detail',
            'Conflict Resolution', 'Presentation Skills', 'Technical Writing',
            'Research', 'Strategic Planning', 'Decision Making', 'Analytical Thinking',
            'Remote Collaboration', 'Self-Motivation', 'Continuous Learning',
        ];
        
        shuffle($allSkills);
        return array_slice($allSkills, 0, $count);
    }
    
    /**
     * Generate random work experience
     */
    private function getRandomExperience(int $count = 3): array
    {
        $titles = [
            'Software Developer', 'Web Developer', 'Full-stack Engineer',
            'Frontend Developer', 'Backend Developer', 'DevOps Engineer',
            'Software Engineer', 'PHP Developer', 'JavaScript Developer',
            'Technical Lead', 'Solution Architect', 'Mobile Developer',
            'WordPress Developer', 'UI Developer', 'Database Administrator',
        ];
        
        $companies = [
            'TechSolutions', 'WebInnovate', 'CodeCraft', 'DigitalEdge',
            'ByteWorks', 'CloudNine', 'DevSphere', 'NextGen Technologies',
            'InfinityCode', 'PulseWeb', 'ServerPro', 'AppMakers',
            'DataFlow', 'UXPartners', 'Webify',
        ];
        
        $descriptions = [
            'Developed and maintained web applications using PHP frameworks and JavaScript libraries.',
            'Built responsive and accessible user interfaces with modern frontend technologies.',
            'Designed and implemented RESTful APIs and database schemas for web and mobile applications.',
            'Collaborated with cross-functional teams to deliver high-quality software solutions.',
            'Optimized application performance and implemented caching strategies for high-traffic websites.',
            'Created and maintained CI/CD pipelines and containerized development environments.',
            'Implemented automated testing frameworks and best practices for quality assurance.',
            'Worked closely with clients to understand requirements and deliver customized solutions.',
            'Refactored legacy code and improved system architecture for better maintainability.',
            'Integrated third-party services and APIs into web applications.',
            'Mentored junior developers and conducted code reviews to maintain code quality.',
            'Designed and implemented database schemas and optimized database queries.',
            'Developed and maintained e-commerce platforms with payment gateway integrations.',
            'Created custom content management systems tailored to client requirements.',
            'Implemented security best practices and conducted security audits.',
        ];
        
        $experience = [];
        $currentYear = intval(date('Y'));
        $currentMonth = intval(date('m'));
        
        for ($i = 0; $i < $count; $i++) {
            shuffle($titles);
            shuffle($companies);
            shuffle($descriptions);
            
            $startYear = $currentYear - rand(1, 10);
            $startMonth = rand(1, 12);
            $duration = rand(6, 48); // 6 months to 4 years
            
            $isCurrent = ($i === 0) ? true : false; // Make the first one the current job
            
            $endYear = $isCurrent ? null : $startYear + floor($duration / 12);
            $endMonth = $isCurrent ? null : ((($startMonth + $duration % 12) % 12) ?: 12);
            
            // If end date would be in the future but it's not current, adjust it
            if (!$isCurrent && ($endYear > $currentYear || ($endYear == $currentYear && $endMonth > $currentMonth))) {
                $endYear = $currentYear;
                $endMonth = $currentMonth;
            }
            
            $experience[] = [
                'title' => $titles[0],
                'company' => $companies[0],
                'start_date' => sprintf('%04d-%02d', $startYear, $startMonth),
                'end_date' => $isCurrent ? null : sprintf('%04d-%02d', $endYear, $endMonth),
                'current' => $isCurrent,
                'description' => $descriptions[0],
            ];
            
            // Set up for the next, older job
            $currentYear = $startYear;
            $currentMonth = $startMonth - 1;
            if ($currentMonth < 1) {
                $currentMonth = 12;
                $currentYear--;
            }
        }
        
        return $experience;
    }
}
