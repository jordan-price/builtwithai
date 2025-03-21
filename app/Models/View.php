<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class View extends Model
{
    use HasFactory;
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'viewable_type',
        'viewable_id',
        'user_id',
        'ip_address',
        'user_agent',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];
    
    /**
     * Get the viewable entity.
     */
    public function viewable(): MorphTo
    {
        return $this->morphTo();
    }
    
    /**
     * Get the user who viewed this entity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
