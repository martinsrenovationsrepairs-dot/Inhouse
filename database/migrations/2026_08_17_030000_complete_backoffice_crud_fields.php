<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('location')->nullable()->after('phone');
            $table->json('tags')->nullable()->after('preferred_language');
        });

        Schema::table('service_jobs', function (Blueprint $table) {
            $table->decimal('budget', 12, 2)->nullable()->after('progress');
        });

        Schema::table('material_items', function (Blueprint $table) {
            $table->string('url')->nullable()->after('supplier');
        });

        Schema::table('customer_messages', function (Blueprint $table) {
            $table->string('priority')->default('normal')->after('status');
        });

        Schema::create('service_job_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('service_jobs')->cascadeOnDelete();
            $table->string('title');
            $table->string('status')->default('pending');
            $table->unsignedInteger('position')->default(0);
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('backoffice_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->string('group')->default('general');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backoffice_settings');
        Schema::dropIfExists('service_job_tasks');
        Schema::table('customer_messages', fn (Blueprint $table) => $table->dropColumn('priority'));
        Schema::table('material_items', fn (Blueprint $table) => $table->dropColumn('url'));
        Schema::table('service_jobs', fn (Blueprint $table) => $table->dropColumn('budget'));
        Schema::table('clients', fn (Blueprint $table) => $table->dropColumn(['location', 'tags']));
    }
};
