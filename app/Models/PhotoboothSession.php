<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoboothSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mode',
        'status'
    ];
    public function photos(){
        return $this->hasMany(PhotoboothPhoto::class, 'photobooth_session_id');
    }
}
