<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\Backoffice\BackofficeRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackofficeEntityCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_backoffice_crud_routes_require_authentication(): void
    {
        $this->getJson('/api/admin/entities/clients')->assertUnauthorized();
        $this->postJson('/api/admin/entities/clients', ['name'=>'Sem sessão'])->assertUnauthorized();
    }

    public function test_authenticated_user_can_complete_client_crud(): void
    {
        $this->actingAs(User::factory()->create());
        $created = $this->postJson('/api/admin/entities/clients', ['name'=>'Cliente API','email'=>'cliente@example.test','tags'=>['recorrente']])
            ->assertCreated()->assertJsonPath('name','Cliente API')->json();

        $this->getJson('/api/admin/entities/clients/'.$created['id'])->assertOk()->assertJsonPath('tags.0','recorrente');
        $this->patchJson('/api/admin/entities/clients/'.$created['id'], ['location'=>'Setúbal'])->assertOk()->assertJsonPath('location','Setúbal');
        $this->getJson('/api/admin/entities/clients?search=Cliente')->assertOk()->assertJsonCount(1,'items');
        $this->deleteJson('/api/admin/entities/clients/'.$created['id'])->assertNoContent();
        $this->assertDatabaseMissing('clients',['id'=>$created['id']]);
    }

    public function test_order_can_be_created_transactionally_from_purchase_list(): void
    {
        $repository = app(BackofficeRepository::class);
        $catalog = $repository->create('service_catalog',['code'=>'TEST-CAT','name'=>'Serviço teste']);
        $list = $repository->create('purchase_lists',['service_catalog_id'=>$catalog['id'],'name'=>'Lista base']);
        $repository->create('purchase_list_items',['purchase_list_id'=>$list['id'],'name'=>'Tinta','quantity'=>2,'unit'=>'balde','unit_price'=>25]);

        $order = $repository->createOrderFromPurchaseList(['reference'=>'TEST-ENC','purchase_list_id'=>$list['id']],'test');

        $this->assertSame('TEST-ENC',$order['reference']);
        $this->assertCount(1,$order['items']);
        $this->assertSame('Tinta',$order['items'][0]['name']);
    }
}
