<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('short_description')->nullable();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('website_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('thumbnail')->nullable();
            $table->integer('stars_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->timestamps();
            
            $table->index('is_featured');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
