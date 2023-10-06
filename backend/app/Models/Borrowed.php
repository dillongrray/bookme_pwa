<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrowed extends Model
{
    use HasFactory;

    protected $primaryKey = 'borrowed_id';
}
