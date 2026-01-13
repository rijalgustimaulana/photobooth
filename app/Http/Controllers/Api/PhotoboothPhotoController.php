<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoboothPhoto;
use App\Models\PhotoboothSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoboothPhotoController extends Controller
{
    public function store(Request $request, $sessionId)
    {
        $request->validate([
            'frame' => 'required|integer|min:1|max:3',
            'image_base64' => 'required|string',
        ]);

        $session = PhotoboothSession::findOrFail($sessionId);

        $imageBase64 = $request->image_base64;

        if (str_contains($imageBase64, ',')) {
            $imageBase64 = explode(',', $imageBase64)[1];
        }

        $image = base64_decode($imageBase64);

        if ($image === false) {
            return response()->json([
                'message' => 'Invalid base64 image',
            ], 422);
        }

        
        $fileName = Str::uuid().'.jpg';
        $path = "photobooth/{$fileName}";

        Storage::disk('public')->put($path, $image);

        $photo = PhotoboothPhoto::updateOrCreate(
            [
                'photobooth_session_id' => $session->id,
                'frame' => $request->frame,
            ],
            [
                'image_path' => $path,
            ]
        );

        $totalFrames = $session->photos()
            ->select('frame')
            ->distinct()
            ->count();

            if ($totalFrames >= 3 && $session->status !== 'completed') {
            $session->update([
                'status' => 'completed',
            ]);
        }

        if ($session->status === 'completed') {
            return response()->json([
                'message' => 'Session already completed',
            ], 409);
        }
        
        return response()->json([
            'photo_id' => $photo->id,
            'frame' => $photo->frame,
            'session_status' => $session->fresh()->status,
            'image_url' => asset('storage/'.$photo->image_path),
            'message' => 'Photo saved successfully',
        ], 201);
    }
}
