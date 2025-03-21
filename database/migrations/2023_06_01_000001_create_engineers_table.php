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
        Schema::create('engineers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('role');
            $table->string('company')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('avatar')->nullable();
            $table->string('github_username')->nullable();
            $table->string('twitter_username')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('personal_website')->nullable();
            $table->string('public_email')->nullable();
            $table->json('contact_preferences')->nullable();
            $table->json('skills')->nullable();
            $table->json('experience')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_open_to_work')->default(false);
            $table->integer('views_count')->default(0);
            $table->timestamps();

            $table->index('github_username');
            $table->index('is_featured');
            $table->index('is_open_to_work');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engineers');
    }
};
