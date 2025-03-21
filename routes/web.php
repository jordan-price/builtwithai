<?php

use App\Http\Controllers\EngineerController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [ProjectController::class, 'index'])->name('home');

// Force-register the projects/create route
Route::get('/projects/create', [ProjectController::class, 'create'])->middleware(['auth', 'verified'])->name('projects.create');

// Project routes
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');

// Engineer routes
Route::get('/engineers', [EngineerController::class, 'index'])->name('engineers.index');
Route::get('/engineers/{engineer}', [EngineerController::class, 'show'])->name('engineers.show');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        // Get user info
        $user = \Illuminate\Support\Facades\Auth::user();
        
        // Get recommended projects - latest 3 projects that match user's interests
        $recommendedProjects = \App\Models\Project::with(['category', 'tags'])
            ->where('status', 'published')
            ->latest()
            ->take(3)
            ->get();
            
        // Get trending projects - most viewed in the last week
        $trendingProjects = \App\Models\Project::with(['category', 'tags'])
            ->where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->take(3)
            ->get();
            
        // Get latest engineers that joined the platform
        $latestEngineers = \App\Models\Engineer::with('user')
            ->latest()
            ->take(5)
            ->get();
        
        return Inertia::render('dashboard', [
            'recommendedProjects' => $recommendedProjects,
            'trendingProjects' => $trendingProjects,
            'latestEngineers' => $latestEngineers,
            'userStats' => [
                'projectsCount' => $user->engineer ? $user->engineer->projects()->count() : 0,
                'projectViews' => $user->engineer ? $user->engineer->projects()->sum('views_count') : 0
            ]
        ]);
    })->name('dashboard');

    // Authenticated project routes
    Route::post('/projects/{project}/star', [ProjectController::class, 'toggleStar'])->name('projects.toggle-star');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // My Projects (user's own projects)
    Route::get('/my-projects', [ProjectController::class, 'userProjects'])->name('projects.user');

    // Members routes (only for authenticated users)
    Route::get('/members', [UserController::class, 'index'])->name('members.index');
    Route::get('/members/{user}', [UserController::class, 'show'])->name('members.show');

    // Authenticated engineer routes
    Route::post('/engineers/{engineer}/contact', [EngineerController::class, 'contact'])->name('engineers.contact');
    
    // Engineer profile management
    Route::get('/my-engineer-profile/create', [EngineerController::class, 'create'])->name('engineers.profile.create');
    Route::post('/my-engineer-profile', [EngineerController::class, 'store'])->name('engineers.profile.store');
    Route::get('/my-engineer-profile', [EngineerController::class, 'editProfile'])->name('engineers.profile.edit');
    Route::patch('/my-engineer-profile', [EngineerController::class, 'updateProfile'])->name('engineers.profile.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
