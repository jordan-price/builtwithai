<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    protected $appends = ['media_links'];
    
    /**
     * Get media URLs for the user
     *
     * @return array
     */
    public function getMediaLinksAttribute(): array
    {
        return [
            'avatar' => $this->getFirstMediaUrl('avatar'),
        ];
    }
    
    /**
     * Register media collections for this model
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile();
    }
    
    /**
     * Get the engineer profile associated with the user.
     */
    public function engineer(): HasOne
    {
        return $this->hasOne(Engineer::class);
    }

    /**
     * Get the stars given by the user.
     */
    public function stars(): HasMany
    {
        return $this->hasMany(Star::class);
    }
    
    /**
     * Get the projects created by the user.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
    
    /**
     * Get messages sent by the user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
    
    /**
     * Get messages received by the user.
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }
    
    /**
     * Get unread messages for the user.
     */
    public function unreadMessages(): HasMany
    {
        return $this->receivedMessages()->where('is_read', false);
    }

    /**
     * Check if user has starred a specific project.
     */
    public function hasStarred(Project $project): bool
    {
        return $this->stars()->where('project_id', $project->id)->exists();
    }
    
    /**
     * Check if user can contact another user based on their preferences.
     */
    public function canContact(User $recipient): bool
    {
        if ($recipient->engineer) {
            $preferences = $recipient->engineer->contact_preferences;
            return $preferences && isset($preferences['messaging']) && $preferences['messaging']['enabled'];
        }
        return false;
    }
}
