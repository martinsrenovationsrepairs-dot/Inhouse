<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create {email} {--name=Martins}', function () {
    $password=$this->secret('Palavra-passe segura (mínimo 12 caracteres)');
    if(strlen($password)<12){$this->error('Mínimo de 12 caracteres.');return 1;}
    User::updateOrCreate(['email'=>$this->argument('email')],['name'=>$this->option('name'),'password'=>Hash::make($password),'email_verified_at'=>now()]);
    $this->info('Administrador criado com sucesso.');
})->purpose('Criar o administrador do backoffice');
