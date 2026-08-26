<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('phone', 40);
            $table->string('email', 160);
            $table->string('location', 180);
            $table->string('service', 40)->index();
            $table->text('description');
            $table->string('preferred_language', 2);
            $table->string('contact_method', 20);
            $table->date('preferred_date')->nullable();
            $table->json('attachments')->nullable();
            $table->timestamp('consent_at');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};
