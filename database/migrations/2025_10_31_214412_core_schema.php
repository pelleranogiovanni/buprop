<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // === Countries ===
        if (!Schema::hasTable('countries')) {
            Schema::create('countries', function (Blueprint $table) {
                $table->uuid('country_id')->primary();
                $table->string('name', 100)->unique();
                $table->timestampsTz();
                $table->softDeletesTz();
            });
        }

        // === Provinces ===
        if (!Schema::hasTable('provinces')) {
            Schema::create('provinces', function (Blueprint $table) {
                $table->uuid('province_id')->primary();
                $table->uuid('country_id');
                $table->string('name', 100);
                $table->string('code', 10)->nullable();
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('country_id')->references('country_id')->on('countries')->restrictOnDelete();
                $table->index(['country_id','name']);
            });
        }

        // === Cities ===
        if (!Schema::hasTable('cities')) {
            Schema::create('cities', function (Blueprint $table) {
                $table->uuid('city_id')->primary();
                $table->uuid('province_id');
                $table->string('name', 120);
                $table->decimal('latitude', 9, 6)->nullable();
                $table->decimal('longitude', 9, 6)->nullable();
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('province_id')->references('province_id')->on('provinces')->restrictOnDelete();
                $table->index(['province_id','name']);
            });
        }

        // === Neighborhoods ===
        if (!Schema::hasTable('neighborhoods')) {
            Schema::create('neighborhoods', function (Blueprint $table) {
                $table->uuid('neighborhood_id')->primary();
                $table->uuid('city_id');
                $table->string('name', 120);
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('city_id')->references('city_id')->on('cities')->restrictOnDelete();
                $table->index(['city_id','name']);
            });
        }

        // === Properties ===
        if (!Schema::hasTable('properties')) {
            Schema::create('properties', function (Blueprint $table) {
                $table->uuid('property_id')->primary();
                $table->foreignId('owner_id')->constrained('users')->restrictOnDelete();
                $table->string('property_type', 20);
                $table->string('address', 140);
                $table->uuid('city_id');
                $table->uuid('neighborhood_id')->nullable();
                $table->smallInteger('bedrooms');
                $table->smallInteger('bathrooms');
                $table->smallInteger('rooms');
                $table->decimal('covered_m2', 8, 2);
                $table->decimal('total_m2', 8, 2);
                $table->decimal('latitude', 9, 6)->nullable();
                $table->decimal('longitude', 9, 6)->nullable();
                $table->string('formatted_address', 200)->nullable();
                $table->integer('location_precision')->nullable();
                if (method_exists($table, 'jsonb')) {
                    $table->jsonb('amenities')->nullable();
                } else {
                    $table->json('amenities')->nullable();
                }
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('city_id')->references('city_id')->on('cities')->restrictOnDelete();
                $table->foreign('neighborhood_id')->references('neighborhood_id')->on('neighborhoods')->nullOnDelete();
                $table->index(['city_id','neighborhood_id']);
                $table->index(['owner_id','property_type']);
            });
        }

        // === PropertyImages ===
        if (!Schema::hasTable('property_images')) {
            Schema::create('property_images', function (Blueprint $table) {
                $table->uuid('image_id')->primary();
                $table->uuid('property_id');
                $table->string('url', 300);
                $table->smallInteger('sort_order');
                $table->boolean('is_cover');
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('property_id')->references('property_id')->on('properties')->cascadeOnDelete();
                $table->index(['property_id','is_cover','sort_order']);
            });
        }

        // === Listings ===
        if (!Schema::hasTable('listings')) {
            Schema::create('listings', function (Blueprint $table) {
                $table->uuid('listing_id')->primary();
                $table->uuid('property_id');
                $table->foreignId('publisher_id')->constrained('users')->restrictOnDelete();
                $table->string('operation_type', 10);
                $table->decimal('price', 14, 2);
                $table->string('currency', 3);
                $table->string('availability_status', 20);
                $table->string('moderation_status', 20);
                $table->text('requirements');
                $table->date('available_from')->nullable();
                $table->boolean('allow_messages');
                $table->timestampsTz();
                $table->timestampTz('published_at')->nullable();
                $table->timestampTz('rejected_at')->nullable();
                $table->softDeletesTz();

                $table->foreign('property_id')->references('property_id')->on('properties')->restrictOnDelete();
                $table->index(['property_id','availability_status']);
                $table->index(['moderation_status','published_at']);
            });
        }

        // === MonitoringLogs ===
        if (!Schema::hasTable('monitoring_logs')) {
            Schema::create('monitoring_logs', function (Blueprint $table) {
                $table->uuid('moderation_id')->primary();
                $table->uuid('listing_id');
                $table->foreignId('admin_id')->constrained('users')->restrictOnDelete();
                $table->string('action', 10);     // approved / rejected
                $table->text('reason')->nullable(); // validar en dominio si action=rejected
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('listing_id')->references('listing_id')->on('listings')->cascadeOnDelete();
                $table->index(['listing_id','action','created_at']);
            });
        }

        // === ContactRequests ===
        if (!Schema::hasTable('contact_requests')) {
            Schema::create('contact_requests', function (Blueprint $table) {
                $table->uuid('contact_id')->primary();
                $table->uuid('listing_id');
                $table->foreignId('requester_id')->constrained('users')->restrictOnDelete();
                $table->text('message');
                $table->string('status', 10); // sent/read/closed
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('listing_id')->references('listing_id')->on('listings')->cascadeOnDelete();
                $table->index(['listing_id','status','created_at']);
            });
        }

        // === VisitRequests ===
        if (!Schema::hasTable('visit_requests')) {
            Schema::create('visit_requests', function (Blueprint $table) {
                $table->uuid('visit_id')->primary();
                $table->uuid('listing_id');
                $table->foreignId('requester_id')->constrained('users')->restrictOnDelete();
                $table->date('preferred_date');
                $table->string('preferred_time_slot', 30);
                $table->string('status', 20); // requested/scheduled/done/cancelled
                $table->timestampsTz();
                $table->softDeletesTz();

                $table->foreign('listing_id')->references('listing_id')->on('listings')->cascadeOnDelete();
                $table->index(['listing_id','status','preferred_date']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_requests');
        Schema::dropIfExists('contact_requests');
        Schema::dropIfExists('monitoring_logs');
        Schema::dropIfExists('listings');
        Schema::dropIfExists('property_images');
        Schema::dropIfExists('properties');
        Schema::dropIfExists('neighborhoods');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('provinces');
        Schema::dropIfExists('countries');
    }
};
