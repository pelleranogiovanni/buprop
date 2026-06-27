<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Laravel trae: id, name, email, email_verified_at, password, remember_token, timestamps
            $table->string('phone', 30)->nullable()->after('email');
            $table->uuid('city_id')->nullable()->after('phone');
            $table->date('birth_date')->nullable()->after('city_id');
            $table->string('occupation', 120)->nullable()->after('birth_date');
            $table->string('avatar_url', 300)->nullable()->after('occupation');
            $table->text('bio')->nullable()->after('avatar_url');
            
            // Business fields
            $table->string('business_name', 150)->nullable()->after('bio');
            $table->string('tax_id', 50)->nullable()->after('business_name');
            $table->string('license_number', 100)->nullable()->after('tax_id');
            $table->string('verification_document_url', 300)->nullable()->after('license_number');
            $table->string('verification_status', 20)->default('pending')->after('verification_document_url');
            
            $table->boolean('is_active')->default(true)->after('verification_status');

            $table->foreign('city_id')->references('city_id')->on('cities')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['city_id']);
            $table->dropColumn([
                'phone', 'city_id', 'birth_date', 'occupation', 'avatar_url', 'bio',
                'business_name', 'tax_id', 'license_number', 'verification_document_url', 'verification_status',
                'is_active'
            ]);
        });
    }
};
