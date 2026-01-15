<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoboothPhoto;
use App\Models\PhotoboothSession;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PhotoboothResultController extends Controller
{
    public function strip($id)
    {
        $session = PhotoboothSession::with('photos')->findOrFail($id);

        if ($session->status !== 'completed') {
            return response()->json(['message' => 'Session not completed'], 409);
        }

        if ($session->photos->count() !== 3) {
            return response()->json(['message' => 'Incomplete photos'], 422);
        }

        $fileName = "strip-{$session->id}.jpg";
        $path = "photobooth/strips/{$fileName}";

        // cache
        if (Storage::disk('public')->exists($path)) {
            return response()->json([
                'strip_url' => asset('storage/'.$path),
                'cached' => true,
            ]);
        }

        // generate
        $photos = $session->photos->sortBy('frame')->values();
        $images = [];

        foreach ($photos as $photo) {
            $fullPath = storage_path('app/public/'.$photo->image_path);
            $images[] = imagecreatefromstring(file_get_contents($fullPath));
        }

        $width = imagesx($images[0]);
        $height = imagesy($images[0]) * 3;

        $strip = imagecreatetruecolor($width, $height);

        foreach ($images as $i => $img) {
            imagecopy($strip, $img, 0, $i * imagesy($img), 0, 0, imagesx($img), imagesy($img));
            imagedestroy($img);
        }

        Storage::disk('public')->makeDirectory('photobooth/strips');
        imagejpeg($strip, storage_path("app/public/{$path}"), 90);
        imagedestroy($strip);

        return response()->json([
            'strip_url' => asset('storage/'.$path),
            'cached' => false,
        ]);
    }

    // 🔥 INI KUNCI DOWNLOAD ASLI
    public function download($id): BinaryFileResponse
    {
        $path = storage_path("app/public/photobooth/strips/strip-{$id}.jpg");

        abort_if(! file_exists($path), 404);

        return response()->download(
            $path,
            "photobooth-strip-{$id}.jpg",
            ['Content-Type' => 'image/jpeg']
        );
    }

    public function myStrips(Request $request)
    {
        $user = $request->user();

        $sessions = \App\Models\PhotoboothSession::where('user_id', $user->id)
            ->where('status', 'completed')
            ->latest()
            ->take(3)
            ->get();

        $results = $sessions->map(function ($session) {
            $path = "photobooth/strips/strip-{$session->id}.jpg";

            return [
                'session_id' => $session->id,
                'strip_url' => asset('storage/'.$path),
            ];
        });

        return response()->json($results);
    }

    public function destroy($sessionId)
    {
        $session = PhotoboothSession::where('id', $sessionId)
            ->where('user_id', auth()->id())
            ->first();

        if (! $session) {
            return response()->json([
                'message' => 'Session tidak ditemukan',
            ], 404);
        }

        // 🔥 Hapus strip hasil
        $stripPath = "photobooth/strips/strip-{$sessionId}.jpg";
        if (Storage::disk('public')->exists($stripPath)) {
            Storage::disk('public')->delete($stripPath);
        }

        // 🔥 Ambil foto mentah (PAKAI FK YANG BENAR)
        $photos = PhotoboothPhoto::where('photobooth_session_id', $sessionId)->get();

        foreach ($photos as $photo) {
            if ($photo->image_path && Storage::disk('public')->exists($photo->image_path)) {
                Storage::disk('public')->delete($photo->image_path);
            }
        }

        // 🔥 Hapus DB
        PhotoboothPhoto::where('photobooth_session_id', $sessionId)->delete();
        $session->delete();

        return response()->json([
            'message' => 'Photobooth berhasil dihapus',
        ]);
    }
}
