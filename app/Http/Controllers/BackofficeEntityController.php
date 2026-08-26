<?php

namespace App\Http\Controllers;

use App\Services\Backoffice\BackofficeRepository;
use Illuminate\Http\Request;

class BackofficeEntityController extends Controller
{
    public function index(Request $request, string $entity, BackofficeRepository $repository)
    {
        return ['items'=>$repository->list($entity, (array)$request->input('filters', []), $request->string('search')->toString(), $request->integer('limit', 100), $request->integer('offset'))];
    }
    public function show(string $entity, int $id, BackofficeRepository $repository) { return $repository->details($entity, $id); }
    public function store(Request $request, string $entity, BackofficeRepository $repository) { return response()->json($repository->create($entity, $request->all()), 201); }
    public function update(Request $request, string $entity, int $id, BackofficeRepository $repository) { return $repository->update($entity, $id, $request->all()); }
    public function destroy(string $entity, int $id, BackofficeRepository $repository) { $repository->delete($entity, $id); return response()->noContent(); }
}
