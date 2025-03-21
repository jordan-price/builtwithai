<?php

namespace App\Models;

use App\Models\Category;
use App\Models\Engineer;
use App\Models\Tag;
use App\Models\View;
use App\Models\Star;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Project extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'category_id',
        'website_url',
        'github_url',
        'demo_url',
        'thumbnail',
        'status',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function engineers(): BelongsToMany
    {
        return $this->belongsToMany(Engineer::class, 'project_engineer')
            ->withPivot('role', 'is_primary')
            ->withTimestamps();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    // Media relationship is now handled by InteractsWithMedia trait

    public function views(): MorphMany
    {
        return $this->morphMany(View::class, 'viewable');
    }

    public function stars(): HasMany
    {
        return $this->hasMany(Star::class);
    }
    
    // User relationship is now handled through engineers

    /**
     * Register media collections for this model
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('thumbnail')
            ->singleFile();
            
        $this->addMediaCollection('screenshots');
    }
    
    /**
     * Register media conversions for this model
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->performOnCollections('thumbnail');
    }
    
    /**
     * Get thumbnail URL attribute
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('thumbnail');
    }

    public function getPrimaryEngineersAttribute(): mixed
    {
        return $this->engineers()->wherePivot('is_primary', true)->get();
    }

    public function getStarCountAttribute(): int
    {
        return $this->stars()->count();
    }
}
