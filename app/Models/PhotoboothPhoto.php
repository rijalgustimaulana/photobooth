<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoboothPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'photobooth_session_id',
        'frame',
        'image_path',
    ];

    public function session()
    {
        return $this->belongsTo(PhotoboothSession::class, 'photobooth_session_id');
    }
}
