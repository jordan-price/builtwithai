<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Engineer;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the projects.
     */
    public function index(Request $request)
    {
        $query = Project::query()->with(['category', 'tags', 'engineers'])
            ->where('status', 'published');
            
        // Apply category filter (handle array or single value)
        if ($request->filled('category')) {
            if (is_array($request->category)) {
                $query->whereIn('category_id', $request->category);
            } else {
                $query->where('category_id', $request->category);
            }
        }
        
        // Apply tags filter (renamed from tag to tags)
        if ($request->filled('tags')) {
            $tagIds = is_array($request->tags) ? $request->tags : [$request->tags];
            $query->whereHas('tags', function($q) use ($tagIds) {
                $q->whereIn('tags.slug', $tagIds);
            });
        }
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Apply sorting based on our frontend values
        $sort = $request->input('sort', 'latest');
        
        switch ($sort) {
            case 'latest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'popular':
                $query->orderBy('stars_count', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }
        
        $projects = $query->paginate(12)->withQueryString();
        
        // Pass consistent filter names with defaults
        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'categories' => Category::all(),
            'tags' => Tag::all(),
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'tags' => $request->input('tags', []),
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        // Increment view count
        $project->increment('views_count');
        
        $project->load([
            'category', 
            'tags', 
            'engineers.user',
            'media', // Load all media collections
        ]);
        
        // Add thumbnail URL for convenience in the frontend
        if ($project->hasMedia('thumbnail')) {
            $project->thumbnail_url = $project->getFirstMediaUrl('thumbnail');
        }
        
        // Get related projects based on tags
        $relatedProjects = Project::whereHas('tags', function($query) use ($project) {
            $query->whereIn('tags.id', $project->tags->pluck('id'));
        })
        ->where('id', '!=', $project->id)
        ->where('status', 'published')
        ->with(['category', 'tags'])
        ->limit(3)
        ->get();
        
        // Check if the current user has starred this project
        if (Auth::check()) {
            $project->is_starred = $project->stars()->where('user_id', Auth::id())->exists();
        } else {
            $project->is_starred = false;
        }
        
        return Inertia::render('Projects/Show', [
            'project' => $project,
            'related_projects' => $relatedProjects,
        ]);
    }
    
    /**
     * Toggle the star/unstar status for a project.
     */
    public function toggleStar(Project $project)
    {
        $user = Auth::user();
        
        // Check if user already starred this project
        $starExists = $project->stars()->where('user_id', $user->id)->exists();
        
        if ($starExists) {
            // Remove star
            $project->stars()->where('user_id', $user->id)->delete();
            $project->decrement('stars_count');
            $starred = false;
        } else {
            // Add star
            $project->stars()->create(['user_id' => $user->id]);
            $project->increment('stars_count');
            $starred = true;
        }
        
        // For Inertia requests, we need to return an Inertia response
        // Get a fresh version of the project to ensure we have the latest stars_count
        // and reload all the necessary relations
        $project = $project->fresh()->load([
            'category', 
            'tags', 
            'engineers.user',
            'media',
        ]);
        
        // Add thumbnail URL for convenience in the frontend (same as in show method)
        if ($project->hasMedia('thumbnail')) {
            $project->thumbnail_url = $project->getFirstMediaUrl('thumbnail');
        }
        
        $project->is_starred = $starred;
        
        if (request()->header('X-Inertia')) {
            return Inertia::render('Projects/Show', [
                'project' => $project,
                'related_projects' => Project::whereHas('tags', function($query) use ($project) {
                    $query->whereIn('tags.id', $project->tags->pluck('id'));
                })
                ->where('id', '!=', $project->id)
                ->where('status', 'published')
                ->with(['category', 'tags'])
                ->limit(3)
                ->get(),
            ]);
        }
        
        // For API requests that aren't from Inertia
        return response()->json([
            'starred' => $starred,
            'stars_count' => $project->fresh()->stars_count,
        ]);
    }
    
    /**
     * Show the form for creating a new project.
     */
    public function create()
    {
        // Log that we've hit this route for debugging
        info('ProjectController@create called');
        
        return Inertia::render('Projects/Create', [
            'categories' => Category::all(),
            'tags' => Tag::all(),
            'engineers' => \App\Models\Engineer::with('user')->get(),
        ]);
    }
    
    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'required|string|max:255',
            'description' => 'required|string',
            'website_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array',
            'engineers' => 'nullable|array',
            'thumbnail' => 'nullable|image|max:2048',
        ]);
        
        // Create project
        $validated['status'] = 'published';
        $validated['slug'] = str($validated['name'])->slug();
        
        $project = Project::create($validated);
        
        // Attach tags
        if (!empty($validated['tags'])) {
            $project->tags()->attach($validated['tags']);
        }
        
        // Get selected engineers from the request or initialize an empty array
        $selectedEngineers = $request->input('engineers', []);
        
        // Attach current user as an engineer to this project if they have an engineer profile
        // and they're not already in the selected engineers list
        $user = Auth::user();
        $isPrimarySet = false;
        
        if ($user->engineer && !in_array($user->engineer->id, $selectedEngineers)) {
            $project->engineers()->attach($user->engineer->id, [
                'role' => 'Developer',  // Default role
                'is_primary' => true     // Mark as primary engineer
            ]);
            $isPrimarySet = true;
        }
        
        // Attach all other selected engineers
        if (!empty($selectedEngineers)) {
            foreach ($selectedEngineers as $engineerId) {
                // Skip if this is the current user's engineer profile (already attached above)
                if ($user->engineer && $user->engineer->id == $engineerId) {
                    continue;
                }
                
                // For the first engineer, set as primary if no primary is set yet
                $isPrimary = !$isPrimarySet && !$project->engineers()->wherePivot('is_primary', true)->exists();
                if ($isPrimary) {
                    $isPrimarySet = true;
                }
                
                $project->engineers()->attach($engineerId, [
                    'role' => 'Contributor',  // Default role for other engineers
                    'is_primary' => $isPrimary
                ]);
            }
        }
        
        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $project->addMediaFromRequest('thumbnail')->toMediaCollection('thumbnail');
        }
        
        return redirect()->route('projects.show', $project->slug);
    }
    
    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project)
    {
        // Authorization check
        $this->authorize('update', $project);
        
        // Load project relationships including engineers
        $project->load(['category', 'tags', 'engineers.user']);
        
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'categories' => Category::all(),
            'tags' => Tag::all(),
            'engineers' => Engineer::with('user')->get(),
        ]);
    }
    
    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project)
    {
        // Authorization check
        $this->authorize('update', $project);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'required|string|max:255',
            'description' => 'required|string',
            'website_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array',
            'engineers' => 'nullable|array',
            'thumbnail' => 'nullable|image|max:2048',
        ]);
        
        // Update project
        if ($validated['name'] !== $project->name) {
            $validated['slug'] = str($validated['name'])->slug();
        }
        
        $project->update($validated);
        
        // Sync tags
        if (isset($validated['tags'])) {
            $project->tags()->sync($validated['tags']);
        }
        
        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Remove old thumbnail
            $project->clearMediaCollection('thumbnail');
            // Add new thumbnail
            $project->addMediaFromRequest('thumbnail')->toMediaCollection('thumbnail');
        }
        
        return redirect()->route('projects.show', $project->slug)->with('success', 'Project updated successfully');
    }
    
    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project)
    {
        // Authorization check
        $this->authorize('delete', $project);
        
        // Delete the project
        $project->delete();
        
        return redirect()->route('projects.user')->with('success', 'Project deleted successfully');
    }
    
    /**
     * Display a listing of the current user's projects.
     */
    public function userProjects(Request $request)
    {
        // Verify authentication
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        $user = Auth::user();
        
        // Check if the user has an engineer profile - only do this query once
        $hasEngineerProfile = false;
        $engineerId = null;
        
        if ($user) {
            // Find the engineer profile for this user
            $engineer = Engineer::where('user_id', $user->id)->first();
            $engineerId = $engineer?->id;
            $hasEngineerProfile = !is_null($engineerId);
        }
        
        // Default empty result
        $projects = collect();
        
        if ($hasEngineerProfile && $engineerId) {
            // Apply sorting (with a safe default)
            $sortField = $request->input('sort', 'created_at');
            $sortDirection = $request->input('direction', 'desc');
            
            $allowedSortFields = ['name', 'created_at'];
            if (!in_array($sortField, $allowedSortFields)) {
                $sortField = 'created_at';
            }
            
            // Get projects where the user is an engineer
            // Optimize by selecting only necessary fields and limiting eager loading
            $query = Project::select('projects.*')
                ->join('project_engineer', 'projects.id', '=', 'project_engineer.project_id')
                ->where('project_engineer.engineer_id', $engineerId)
                ->with([
                    'category:id,name', 
                    'tags:id,name',
                    // Only load thumbnail media, not all media
                    'media' => function ($query) {
                        $query->where('collection_name', 'thumbnail');
                    }
                ])
                ->orderBy($sortField, $sortDirection);
            
            // Paginate with a smaller page size for quicker initial load
            $projects = $query->paginate(6)->withQueryString();
            
            // Add thumbnail URLs directly to avoid N+1 queries in the view
            foreach ($projects as $project) {
                $project->thumbnail_url = $project->getFirstMediaUrl('thumbnail');
            }
        } else {
            // Empty paginator for consistent frontend interface
            $projects = new \Illuminate\Pagination\LengthAwarePaginator(
                [], 0, 6, 1, ['path' => $request->url(), 'query' => $request->query()]
            );
        }
            
        return Inertia::render('Projects/MyProjects', [
            'projects' => $projects,
            'filters' => $request->only(['sort', 'direction']),
            'hasEngineerProfile' => $hasEngineerProfile,
        ]);
    }
}
