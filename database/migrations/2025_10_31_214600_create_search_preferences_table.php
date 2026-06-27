<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('search_preferences', function (Blueprint $table) {
            $table->uuid('search_preference_id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('operation_type', 10); // rent/sale
            $table->string('property_type', 20)->nullable(); // house/apartment/etc
            $table->uuid('city_id')->nullable();
            $table->uuid('neighborhood_id')->nullable();
            $table->decimal('min_price', 14, 2)->nullable();
            $table->decimal('max_price', 14, 2)->nullable();
            $table->string('currency', 3)->default('ARS');
            $table->smallInteger('min_rooms')->nullable();
            $table->smallInteger('min_bedrooms')->nullable();
            $table->smallInteger('min_bathrooms')->nullable();
            $table->decimal('min_total_m2', 8, 2)->nullable();
            $table->boolean('requires_pets_allowed')->default(false);
            $table->boolean('requires_children_allowed')->default(false);
            $table->boolean('needs_patio')->default(false);
            $table->boolean('needs_garage')->default(false);
            $table->date('desired_available_from')->nullable();
            $table->boolean('has_income_proof')->default(false);
            $table->boolean('has_guarantor')->default(false);
            $table->text('notes')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->foreign('city_id')->references('city_id')->on('cities')->nullOnDelete();
            $table->foreign('neighborhood_id')->references('neighborhood_id')->on('neighborhoods')->nullOnDelete();
            $table->index(['user_id', 'operation_type']);
            $table->index(['city_id', 'neighborhood_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_preferences');
    }
};