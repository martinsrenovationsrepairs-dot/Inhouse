<?php

namespace App\Http\Controllers;

use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        if (! Auth::attempt($credentials)) return response()->json(['message' => 'Credenciais inválidas.'], 422);
        $request->session()->regenerate();
        return ['user' => $request->user()->only('id', 'name', 'email')];
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->noContent();
    }

    public function me(Request $request)
    {
        return ['user' => $request->user()->only('id', 'name', 'email')];
    }

    public function dashboard()
    {
        $clients = DB::table('clients')
            ->select('clients.*')
            ->selectSub(function ($query) {
                $query->from('service_jobs')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('service_jobs.client_id', 'clients.id');
            }, 'jobs_count')
            ->selectSub(function ($query) {
                $query->from('service_jobs')
                    ->selectRaw('COALESCE(SUM(budget), 0)')
                    ->whereColumn('service_jobs.client_id', 'clients.id');
            }, 'total_value')
            ->latest('clients.created_at')
            ->limit(200)
            ->get();

        $catalog = DB::table('service_catalog')->orderBy('name')->get()->map(function ($service) {
            $service->purchase_lists = DB::table('purchase_lists')->where('service_catalog_id', $service->id)->orderBy('id')->get()->map(function ($list) {
                $list->items = DB::table('purchase_list_items')->where('purchase_list_id', $list->id)->orderBy('id')->get();
                return $list;
            });
            return $service;
        });

        return [
            'counts' => [
                'new_requests' => QuoteRequest::whereDate('created_at', '>=', now()->subDays(7))->count(),
                'active_jobs' => DB::table('service_jobs')->whereNotIn('status', ['completed', 'cancelled'])->count(),
                'week_appointments' => DB::table('appointments')->whereBetween('starts_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'materials_needed' => DB::table('material_items')->where('status', 'needed')->count(),
            ],
            'appointments' => DB::table('appointments')->leftJoin('clients', 'clients.id', '=', 'appointments.client_id')->leftJoin('service_jobs', 'service_jobs.id', '=', 'appointments.job_id')->orderBy('starts_at')->limit(200)->get(['appointments.*','clients.name as client_name','service_jobs.reference as job_reference']),
            'clients' => $clients,
            'messages' => DB::table('customer_messages')->leftJoin('clients', 'clients.id', '=', 'customer_messages.client_id')->orderByDesc('customer_messages.created_at')->limit(200)->get(['customer_messages.*','clients.name as client_name']),
            'quote_requests' => QuoteRequest::latest()->limit(200)->get(),
            'quotes' => DB::table('quotes')->leftJoin('clients','clients.id','=','quotes.client_id')->leftJoin('service_catalog','service_catalog.id','=','quotes.service_catalog_id')->orderByDesc('quotes.created_at')->limit(200)->get(['quotes.*','clients.name as client_name','service_catalog.name as service_name']),
            'jobs' => DB::table('service_jobs')->leftJoin('clients','clients.id','=','service_jobs.client_id')->orderByDesc('service_jobs.created_at')->limit(200)->get(['service_jobs.*','clients.name as client_name']),
            'job_tasks' => DB::table('service_job_tasks')->orderBy('position')->get(),
            'materials' => DB::table('material_items')->join('service_jobs', 'service_jobs.id', '=', 'material_items.job_id')->orderByDesc('material_items.created_at')->limit(200)->get(['material_items.*', 'service_jobs.reference as job_reference']),
            'service_catalog' => $catalog,
            'orders' => DB::table('orders')->leftJoin('service_jobs','service_jobs.id','=','orders.job_id')->leftJoin('purchase_lists','purchase_lists.id','=','orders.purchase_list_id')->leftJoin('service_catalog','service_catalog.id','=','purchase_lists.service_catalog_id')->orderByDesc('orders.created_at')->limit(200)->get(['orders.*','service_jobs.reference as job_reference','service_catalog.id as service_catalog_id']),
            'order_items' => DB::table('order_items')->orderBy('id')->get(),
            'settings' => DB::table('backoffice_settings')->orderBy('group')->orderBy('key')->get(),
            'activity' => DB::table('backoffice_audit_logs')->orderByDesc('created_at')->limit(50)->get(),
        ];
    }
}
