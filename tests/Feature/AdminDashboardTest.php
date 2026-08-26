<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_dashboard_returns_clients_created_in_database(): void
    {
        $user = User::factory()->create();
        $clientId = DB::table('clients')->insertGetId([
            'name' => 'Joao Esteves',
            'preferred_language' => 'pt',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->actingAs($user)
            ->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('clients.0.id', $clientId)
            ->assertJsonPath('clients.0.name', 'Joao Esteves')
            ->assertJsonPath('clients.0.jobs_count', 0);
    }
}
