<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of community members.
     */
    public function index(Request $request)
    {
        // Initialize query with relationship counts and engineer relationship
        // Using nullsafe operator from PHP 8.0 for relationships that might not exist
        $query = User::query()
            ->withCount(['stars', 'sentMessages', 'receivedMessages'])
            ->with('engineer'); // Include engineer relationship to check if user is an engineer
            
        // Apply search filter if provided
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Apply sorting with safe defaults
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        
        $allowedSortFields = ['name', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc'); // Safe default if invalid sort field
        }
        
        // Paginate results with proper structure for frontend
        $members = $query->paginate(12)->withQueryString();
        
        // Transform member data to include is_engineer flag
        $members = $members->through(function ($user) {
            $user->is_engineer = $user->engineer !== null;
            return $user;
        });

        return Inertia::render('Members/Index', [
            'members' => $members,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Display the specified user's profile.
     */
    public function show(User $user)
    {
        // Load user with relevant relationships
        $user->loadCount(['stars']);
        
        // Get user's starred projects if applicable, with safe handling
        $starredProjects = collect();
        try {
            $starredProjects = $user->stars?->isNotEmpty() 
                ? $user->stars()->with(['project.category', 'project.tags'])
                    ->latest()
                    ->take(3)
                    ->get()
                    ->pluck('project')
                    ->filter() // Remove any null values
                : collect();
        } catch (\Exception $e) {
            // Gracefully handle any errors with relationships
            report($e); // Log the error but continue execution
        }
        
        // Get engineer profile if exists, using PHP 8's nullsafe operator
        $engineerProfile = $user->engineer;
        
        return Inertia::render('Members/Show', [
            'member' => $user,
            'starredProjects' => $starredProjects,
            'engineerProfile' => $engineerProfile,
        ]);
    }
}
