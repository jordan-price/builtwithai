<?php

namespace App\Models;

use App\Models\Project;
use App\Models\Media as AppMedia; // Aliased to avoid conflict with Spatie Media
use App\Models\View;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class Engineer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'role',
        'company',
        'bio',
        'location',
        'github_username',
        'twitter_username',
        'linkedin_url',
        'personal_website',
        'public_email',
        'contact_preferences',
        'skills',
        'experience',
        'is_open_to_work',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_open_to_work' => 'boolean',
        'contact_preferences' => 'array',
        'skills' => 'array',
        'experience' => 'array',
    ];
    
    /**
     * Get the associated user's name
     * 
     * @return string|null
     */
    public function getNameAttribute(): ?string
    {
        return $this->user?->name;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_engineer')
            ->withPivot('role', 'is_primary')
            ->withTimestamps();
    }

    public function appMedia(): MorphMany
    {
        return $this->morphMany(AppMedia::class, 'model');
    }

    public function views(): MorphMany
    {
        return $this->morphMany(View::class, 'viewable');
    }

    public function getPrimaryProjectsAttribute(): mixed
    {
        return $this->projects()->wherePivot('is_primary', true)->get();
    }
    
    public function allowsContactType(string $type): bool
    {
        if (!$this->contact_preferences || !isset($this->contact_preferences['contact_types'])) {
            return false;
        }
        
        return isset($this->contact_preferences['contact_types'][$type]) && 
               $this->contact_preferences['contact_types'][$type] === true;
    }
    
    public function getAvailableContactMethodsAttribute(): array
    {
        $methods = [];
        
        if ($this->contact_preferences) {
            if (isset($this->contact_preferences['messaging']['enabled']) && 
                $this->contact_preferences['messaging']['enabled']) {
                $methods[] = 'messaging';
            }
            
            if (isset($this->contact_preferences['email']['public_display']) && 
                $this->contact_preferences['email']['public_display']) {
                $methods[] = 'email';
            }
            
            if (isset($this->contact_preferences['scheduling']['enabled']) && 
                $this->contact_preferences['scheduling']['enabled']) {
                $methods[] = 'scheduling';
            }
        }
        
        return $methods;
    }
}
