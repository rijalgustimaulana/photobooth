<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PhotoboothSession;

class PhotoboothSessionResultController extends Controller
{
    public function show($id)
    {
        $session = PhotoboothSession::with('photos')
        ->findOrFail($id);

        return response()->json([
            'session_id' => $session->id,
            'status' => $session->status,
            'photos' => $session->photos
                ->sortBy('frame')
                ->values()
                ->map(function($photo){
                    return [
                        'frame' => $photo->frame,
                        'image_url' => asset('storage/' . $photo->image_path),
                    ];
                }),
            ]);
    }
}
