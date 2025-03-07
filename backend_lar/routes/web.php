<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConfigController;
Route::get('/', function () {
    return view('welcome');
});
