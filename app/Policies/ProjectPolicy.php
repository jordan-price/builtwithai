<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        // Check if the user has an engineer profile
        if (!$user->engineer) {
            return false;
        }
        
        // Eager load the engineers with their users if not already loaded
        if (!$project->relationLoaded('engineers.user')) {
            $project->load('engineers.user');
        }
        
        // Check if the user's engineer profile is associated with this project
        foreach ($project->engineers as $engineer) {
            if ($engineer->user_id === $user->id) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        // Check if the user has an engineer profile
        if (!$user->engineer) {
            return false;
        }
        
        // Eager load the engineers with their users if not already loaded
        if (!$project->relationLoaded('engineers.user')) {
            $project->load('engineers.user');
        }
        
        // Check if the user's engineer profile is associated with this project
        foreach ($project->engineers as $engineer) {
            if ($engineer->user_id === $user->id) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        // Check if the user has an engineer profile
        if (!$user->engineer) {
            return false;
        }
        
        // Eager load the engineers with their users if not already loaded
        if (!$project->relationLoaded('engineers.user')) {
            $project->load('engineers.user');
        }
        
        // Check if the user's engineer profile is associated with this project
        foreach ($project->engineers as $engineer) {
            if ($engineer->user_id === $user->id) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        // Check if the user has an engineer profile
        if (!$user->engineer) {
            return false;
        }
        
        // Eager load the engineers with their users if not already loaded
        if (!$project->relationLoaded('engineers.user')) {
            $project->load('engineers.user');
        }
        
        // Check if the user's engineer profile is associated with this project
        foreach ($project->engineers as $engineer) {
            if ($engineer->user_id === $user->id) {
                return true;
            }
        }
        
        return false;
    }
}
