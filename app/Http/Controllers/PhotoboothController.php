<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoboothController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|string'
        ]);

        // Ambil base64
        $base64Image = $request->image;

        // Pisahkan metadata & data
        if (!preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            return response()->json(['message' => 'Format base64 tidak valid'], 422);
        }

        $imageType = strtolower($type[1]); // png / jpg
        $imageData = substr($base64Image, strpos($base64Image, ',') + 1);
        $imageData = base64_decode($imageData);

        if ($imageData === false) {
            return response()->json(['message' => 'Decode base64 gagal'], 422);
        }

        // Nama file
        $fileName = 'photobooth_' . Str::uuid() . '.' . $imageType;
        $path = 'photobooth/' . $fileName;

        // Simpan
        Storage::disk('public')->put($path, $imageData);

        // URL publik
        $url = asset('storage/' . $path);

        return response()->json([
            'success' => true,
            'url' => $url
        ]);
    }
}
