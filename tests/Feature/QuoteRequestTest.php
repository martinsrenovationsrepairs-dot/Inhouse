<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_valid_quote_request_is_stored(): void
    {
        $response = $this->postJson('/api/quote-requests', [
            'name' => 'Test Customer',
            'phone' => '934 000 000',
            'email' => 'customer@example.com',
            'location' => 'Setúbal',
            'service' => 'painting',
            'description' => 'Painting two rooms and preparing the walls.',
            'preferred_language' => 'en',
            'contact_method' => 'whatsapp',
            'consent' => true,
        ]);

        $response->assertCreated()->assertJsonStructure(['message', 'reference']);
        $this->assertDatabaseHas('quote_requests', ['email' => 'customer@example.com']);
    }

    public function test_consent_and_valid_fields_are_required(): void
    {
        $this->postJson('/api/quote-requests', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'phone', 'email', 'consent']);
    }
}
