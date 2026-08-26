<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_catalog', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('hourly_rate', 10, 2)->default(0);
            $table->decimal('default_hours', 8, 2)->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('purchase_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_catalog_id')->constrained('service_catalog')->cascadeOnDelete();
            $table->string('name');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_list_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('supplier')->nullable();
            $table->string('url')->nullable();
            $table->decimal('quantity', 10, 2)->default(1);
            $table->string('unit')->default('un.');
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('job_id')->nullable()->constrained('service_jobs')->nullOnDelete();
            $table->foreignId('purchase_list_id')->nullable()->constrained()->nullOnDelete();
            $table->string('supplier')->nullable();
            $table->string('status')->default('draft');
            $table->date('ordered_at')->nullable();
            $table->date('expected_at')->nullable();
            $table->date('received_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('quantity', 10, 2)->default(1);
            $table->string('unit')->default('un.');
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->string('supplier')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('job_id')->nullable()->constrained('service_jobs')->nullOnDelete();
            $table->foreignId('service_catalog_id')->nullable()->constrained('service_catalog')->nullOnDelete();
            $table->string('title');
            $table->string('status')->default('draft');
            $table->decimal('labor_hours', 8, 2)->default(0);
            $table->decimal('hourly_rate', 10, 2)->default(0);
            $table->decimal('materials_total', 12, 2)->default(0);
            $table->decimal('margin_percent', 6, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->date('valid_until')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('backoffice_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('source')->default('mcp');
            $table->string('action');
            $table->string('entity');
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('changes')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        foreach (['backoffice_audit_logs', 'quotes', 'order_items', 'orders', 'purchase_list_items', 'purchase_lists', 'service_catalog'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
