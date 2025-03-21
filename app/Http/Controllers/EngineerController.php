<?php

namespace App\Http\Controllers;

use App\Models\Engineer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EngineerController extends Controller
{
    /**
     * Display a listing of engineers.
     */
    public function index(Request $request)
    {
        $query = Engineer::query()
            ->with(['user'])
            ->withCount('projects');
        
        // Apply filters
        if ($request->filled('open_to_work')) {
            $query->where('is_open_to_work', true);
        }
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%");
            });
        }
        
        // Apply sorting
        $sortField = $request->input('sort', 'name');
        $sortDirection = $request->input('direction', 'asc');
        
        $allowedSortFields = ['name', 'views_count', 'projects_count'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }
        
        $engineers = $query->paginate(12)->withQueryString();
        
        return Inertia::render('Engineers/Index', [
            'engineers' => $engineers,
            'filters' => $request->only(['open_to_work', 'search', 'sort', 'direction']),
        ]);
    }

    /**
     * Display the specified engineer.
     */
    public function show(Engineer $engineer)
    {
        // Increment view count
        $engineer->increment('views_count');
        
        $engineer->load([
            'user',
            'projects' => fn($query) => $query->where('status', 'published')
                         ->with(['category', 'tags']),
        ]);
        
        return Inertia::render('Engineers/Show', [
            'engineer' => $engineer,
            'canContact' => Auth::check() ? $engineer->user->is_contactable : false,
        ]);
    }
    
    /**
     * Send a message to an engineer.
     */
    public function contact(Request $request, Engineer $engineer)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);
        
        if (!$engineer->user->is_contactable) {
            return back()->with('error', 'This engineer is not accepting messages at this time.');
        }
        
        // Create a new message
        $message = new \App\Models\Message([
            'recipient_id' => $engineer->user->id,
            'sender_id' => Auth::id(),
            'subject' => $request->subject,
            'content' => $request->message,
        ]);
        
        $message->save();
        
        return back()->with('success', 'Your message has been sent.');
    }
    
    /**
     * Show the form for creating a new engineer profile
     */
    public function create()
    {
        // Check if user already has an engineer profile
        $user = Auth::user();
        
        if ($user->engineer) {
            return Redirect::route('engineers.profile.edit')
                ->with('info', 'You already have an engineer profile.');
        }
        
        // Get user data to pre-fill the form
        // Use the same approach as in the view to get media_links consistently
        $userWithMedia = DB::table('users')
            ->leftJoin('media', function ($join) use ($user) {
                $join->on('media.model_id', '=', 'users.id')
                    ->where('media.model_type', '=', 'App\\Models\\User')
                    ->where('media.collection_name', '=', 'avatar');
            })
            ->where('users.id', $user->id)
            ->select('users.*', DB::raw("CONCAT('/storage/', media.id, '/', media.file_name) as avatar_url"))
            ->first();
        
        $userData = [
            'name' => $user->name,
            'media_links' => [
                'avatar' => $userWithMedia->avatar_url ?? null
            ]
        ];
        
        return Inertia::render('Engineers/Create', [
            'user' => $userData
        ]);
    }
    
    /**
     * Store a newly created engineer profile
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'github_username' => 'nullable|string|max:255',
            'twitter_username' => 'nullable|string|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'personal_website' => 'nullable|url|max:255',
            'public_email' => 'nullable|email|max:255',
            'contact_preferences' => 'nullable|array',
            'is_open_to_work' => 'boolean',
            'avatar' => 'nullable|image|max:2048',
        ]);
        
        // The Engineer model still has name as a required field, so we need to include it
        // Keep name in both models for backward compatibility until a migration removes the constraint
        
        try {
            // Create the Engineer record with all needed fields
            $engineer = new Engineer();
            $engineer->user_id = $user->id;
            $engineer->name = $validated['name']; // Required due to NOT NULL constraint
            $engineer->role = $validated['role'] ?? null;
            $engineer->company = $validated['company'] ?? null;
            $engineer->bio = $validated['bio'] ?? null;
            $engineer->location = $validated['location'] ?? null;
            $engineer->github_username = $validated['github_username'] ?? null;
            $engineer->twitter_username = $validated['twitter_username'] ?? null;
            $engineer->linkedin_url = $validated['linkedin_url'] ?? null;
            $engineer->personal_website = $validated['personal_website'] ?? null;
            $engineer->public_email = $validated['public_email'] ?? null;
            $engineer->contact_preferences = $validated['contact_preferences'] ?? [];
            $engineer->is_open_to_work = $validated['is_open_to_work'] ?? false;
            $engineer->save();
            
            // Update the user name to keep it in sync
            DB::table('users')
                ->where('id', $user->id)
                ->update(['name' => $validated['name']]);
            
            // Handle avatar upload if present
            if ($request->hasFile('avatar')) {
                // We need to handle the media library operations differently
                // Get a fresh user instance with the correct interfaces
                $userModel = \App\Models\User::findOrFail($user->id);
                $request->file('avatar')->storeAs(
                    'public/avatars', 
                    'user_'.$user->id.'.'.$request->file('avatar')->extension()
                );
            }
            
            logger()->info('Engineer profile created successfully for user ID: ' . $user->id);
        } catch (\Exception $e) {
            logger()->error('Failed to create engineer profile: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Failed to create engineer profile: ' . $e->getMessage()])->withInput();
        }
        
        return Redirect::route('engineers.profile.edit')
            ->with('success', 'Engineer profile created successfully.');
    }
    
    /**
     * Show the form for editing the authenticated user's engineer profile
     */
    public function editProfile()
    {
        $user = Auth::user();
        
        // Check if user has an engineer profile
        if (!$user->engineer) {
            return Redirect::route('engineers.profile.create')
                ->with('info', 'Please create your engineer profile first.');
        }
        
        $engineer = $user->engineer->load('user');
        
        return Inertia::render('Engineers/Edit', [
            'engineer' => $engineer,
        ]);
    }
    
    /**
     * Update the authenticated user's engineer profile
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $engineer = $user->engineer;
        
        if (!$engineer) {
            return Redirect::route('engineers.profile.create')
                ->with('info', 'Please create your engineer profile first.');
        }
        
        // Log very explicitly all of the request data
        logger()->debug('Request Method: ' . $request->method());
        logger()->debug('Request Content-Type: ' . $request->header('Content-Type'));
        logger()->debug('Request has file uploads: ' . ($request->hasFile('avatar') ? 'Yes' : 'No'));
        logger()->debug('Raw POST data: ', $request->post());
        logger()->debug('Raw Input data: ', $request->input());
        logger()->debug('All request data: ', $request->all());
        
        // Check specifically for the name field
        logger()->debug('Name field exists: ' . ($request->has('name') ? 'Yes' : 'No'));
        logger()->debug('Name field value: ' . $request->input('name', 'NOT FOUND'));
        
        try {
            // Pre-validation processing to ensure name field exists
            $data = $request->all();
            
            // Special handling for contact_preferences field
            if (isset($data['contact_preferences']) && !is_array($data['contact_preferences'])) {
                // If it's a string that looks like an array with index keys like 'contact_preferences[0]'
                $contactPrefs = [];
                foreach ($data as $key => $value) {
                    if (preg_match('/^contact_preferences\[(\d+)\]$/', $key, $matches)) {
                        $index = $matches[1];
                        $contactPrefs[$index] = $value;
                        // Remove the individual entries
                        unset($data[$key]);
                    }
                }
                
                if (!empty($contactPrefs)) {
                    logger()->debug('Reconstructed contact_preferences array:', $contactPrefs);
                    $data['contact_preferences'] = array_values($contactPrefs); // Reindex array
                }
            }
            
            // Check for JSON encoded values that might need to be decoded
            foreach ($data as $key => $value) {
                if (is_string($value) && $this->isJson($value)) {
                    logger()->debug("Detected JSON string in field: {$key}");
                    $data[$key] = json_decode($value, true);
                }
            }
            
            // Validate with the potentially fixed data
            $validated = Validator::make($data, [
                'name' => 'required|string|max:255',
                'role' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
                'bio' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'github_username' => 'nullable|string|max:255',
                'twitter_username' => 'nullable|string|max:255',
                'linkedin_url' => 'nullable|url|max:255',
                'personal_website' => 'nullable|url|max:255',
                'public_email' => 'nullable|email|max:255',
                'contact_preferences' => 'nullable|array',
                'is_open_to_work' => 'nullable|boolean',
                'avatar' => 'nullable|image|max:2048',
            ]);
            
            // If validation fails, log the errors
            if ($validated->fails()) {
                logger()->error('Validation failed with errors: ', $validated->errors()->toArray());
                return back()->withErrors($validated)->withInput();
            }
            
            // Get the validated data
            $validated = $validated->validated();
            
            logger()->debug('Validated data:', $validated);
            
            // Log the validated data before update
            logger()->debug('Validated data for update: ', $validated);
            
            // Extract name for the User model
            $userName = $validated['name'] ?? null;
            unset($validated['name']); // Remove name from engineer data
            
            // Update engineer profile (without the name field)
            $engineer->update($validated);
            
            // Update user's name if provided
            if ($userName) {
                $user = $engineer->user;
                $user->name = $userName;
                $user->save();
            }
            
            // Handle avatar upload if present - now handled by the User model
            if ($request->hasFile('avatar')) {
                // Get the user associated with this engineer
                $user = $engineer->user;
                
                // Remove old avatar if exists
                $user->clearMediaCollection('avatar');
                
                // Add new avatar
                $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
            }
            
            return back()->with('success', 'Engineer profile updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            logger()->error('Validation exception: ' . $e->getMessage());
            logger()->error('Validation errors:', $e->errors());
            throw $e; // Re-throw to let Laravel handle the validation error response
        } catch (\Exception $e) {
            logger()->error('Error updating profile: ' . $e->getMessage());
            logger()->error('Exception trace: ' . $e->getTraceAsString());
            return back()->withErrors(['general' => 'An error occurred while updating your profile.'])->withInput();
        }
    }
    
    /**
     * Helper function to check if a string is valid JSON
     *
     * @param string $string
     * @return bool
     */
    private function isJson(string $string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
}
